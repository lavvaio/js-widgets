import { ClientMessageDataType, LVLogger, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from "@anadyme/lavva-js-sdk";
import { Component, Prop, h, State, Watch, Element } from "@stencil/core";
import { filter, Subscription } from "rxjs";
import store from "store2";
import { Historical, Quote } from "../../shared/mt-quote";
import { createLogger, translate } from "../../utils";
import Chart from 'chart.js/auto';

@Component({
    tag: 'mt-quote',
    styleUrls: [ 'mt-quote.scss' ],
    shadow: true,
    assetsDirs: [ './assets' ]
})
export class MtQuote {

    private logger: LVLogger;
    private connection: WebsocketConnection;
    private subscriptions = new Subscription();

    public chart: Chart;
    private chartUp: string;
    private chartDown: string;
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    @Element()
    element: HTMLElement;

    @Prop()
    host = 'xxxxxxxxxx.apps.anadyme.com';

    @Prop()
    translations: {
        [key: string]: {
            [key: string]: string;
        }
    } = null;

    @Prop()
    channel: string;

    @Prop()
    locale = 'en';

    @Prop()
    format: WebsocketConnectionFormat = 'binary';

    @Prop()
    encoding: WebsocketConnectionEncoding = 'msgpack';

    @Prop()
    apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    @Prop()
    snapshot = true;

    @Prop()
    size = 30;

    @Prop()
    namespace = 'mt-quote';

    @Watch('namespace')
    createLogger(newValue: string, _: string) {
        this.logger = createLogger(newValue, 'background-color:red;color:#fff;padding: 2px 4px;font-size:10px;border-radius:4px;');
    }

    @Prop()
    symbol = "BTCUSDm";

    @Prop()
    label = "";

    @Prop()
    showChart = true;

    @State()
    loading = true;

    @State()
    quoteData = [];

    @State()
    quotes = new Map<string, Quote>();

    @State()
    historical = new Map<string, number>();

    @State()
    chartData: { labels: string[], data: number[] } = { labels: [], data: [] };

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    private setCanvas(canvas: HTMLCanvasElement) {
        if (!this.showChart) {
            return;
        }

        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }

    loadHistory() {
        this.logger.log('loading history');

        const ns = store.namespace(`${this.namespace}.${this.channel}`);
        const snapshot = ns.get('history', []) as Array<{ symbol: string; chart: [ string[], number[] ]}>;
        const index = snapshot.findIndex(value => value.symbol === this.symbol);
        if (index === -1) {
            return;
        }

        const [ labels, data ] = snapshot[index].chart;
        this.chartData = { labels, data };
        this.historical.set(this.symbol, Date.parse(`${labels[labels.length - 1]}`));
        this.logger.log('cached historical found', this.chartData);
    }

    getQuoteColor(direction: number) {
        const borderColor = direction === 1 ?
            this.chartUp : ( direction === -1 ? this.chartDown : '#aaa' );
        return borderColor.trim();
    }

    addData(label, value) {
        if (!this.showChart) {
            return;
        }

        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(value);
        });
        this.chart.update();

        let labels = (this.chart.data.labels || []) as string[];
        let data = (this.chart.data.datasets[0].data || []) as number[];

        if (data.length > this.size) {
            labels = labels.slice(0, this.size);
            data = data.slice(0, this.size);
        }

        const ns = store.namespace(`${this.namespace}.${this.channel}`);
        const snapshot = ns.get('history', []) as Array<any>;
        const index = snapshot.findIndex(entry => entry.symbol === this.symbol);
        if (index === -1) {
            snapshot.push({ symbol: this.symbol, chart: [ labels, data ] });
        } else {
            snapshot[index] = { symbol: this.symbol, chart: [ labels, data ] };
        }

        ns.set('history', snapshot);
    }

    saveHistory(pos: Historical) {
        if (!this.showChart) {
            return;
        }

        if (!this.chart) {
            return;
        }

        // this.logger.log('saving historical', pos);

        if (this.historical.has(pos.Symbol)) {
            const last = this.historical.get(pos.Symbol);
            if (last >= pos.Time) {
                // this.logger.log("detected older historical position", new Date(last).toUTCString(), pos);
                return;
            }
        }

        this.historical.set(this.symbol, pos.Time);

        this.addData(new Date(pos.Time).toUTCString(), pos.Close);
    }

    loadQuotes() {
        this.logger.log('loading quotes');

        const ns = store.namespace(`${this.namespace}.${this.channel}`);
        this.quoteData = ns.get('quotes', this.quoteData);

        this.quotes = new Map<string, any>((this.quoteData || []).map(x => {
            return [x.Symbol, x] as [string, any]
        }));

        this.logger.log('cached quotes loaded', this.quoteData);
    }

    saveQuote(quote: Quote) {
        // this.logger.log('saving quote', quote);

        if (this.quotes.has(quote.Symbol)) {
            if (this.quotes.get(quote.Symbol).Time > quote.Time) {
                this.logger.log("detected older quote", quote);
                return;
            }
        }

        this.quotes.set(quote.Symbol, quote);
        this.quoteData = Array.from(this.quotes, ([_, value]) => (value));

        const ns = store.namespace(`${this.namespace}.${this.channel}`);
        ns.set('quotes', this.quoteData);

        if (!this.showChart) {
            return;
        }

        if (this.chart) {
            this.chart.data.datasets[0].borderColor = this.getQuoteColor(quote.Direction);
            this.chart.update();
        }
    }

    connectedCallback() {
        this.createLogger(this.namespace, null);
        this.logger.log('widget attached', this.locale);
        this.loadHistory();
        this.loadQuotes();
        this.loading = true;

        this.connection = new WebsocketConnection({
            host: this.host,
            format: this.format,
            encoding: this.encoding,
            channels: this.channel ? [this.channel] : [],
            apiKey: this.apiKey,
        });

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
            filter(message => message.key === this.symbol),
        ).subscribe(message => {
            this.logger.log('client connected', message.value.client_id, message);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => message.key === this.symbol),
        ).subscribe(message => {
            if (message.category === 'history') {
                if (this.showChart) {
                    this.saveHistory(message.value);
                }
            } else {
                this.saveQuote(message.value);
            }

            if (this.loading) {
                this.loading = false;
            }
        }));

        this.subscriptions.add(this.connection.connect());
    }

    renderLoading() {
        return (
            <div class="loader">
                <span class="txt">{this.translate("loading", "Loading...")}</span>
            </div>
        )
    }

    renderChart(values: { data: number[], labels: string[], direction: number }) {
        this.chartUp = getComputedStyle(this.element, null).
            getPropertyValue('--symbol-percent-up');

        this.chartDown = getComputedStyle(this.element, null).
            getPropertyValue('--symbol-percent-down');

        const data = {
            labels: values.labels,
            datasets : [
                {
                    borderColor: this.getQuoteColor(values.direction),
                    borderWidth: 1,
                    data: values.data,
                }
            ]
        }

        this.chart = new Chart(this.context, {
            type: 'line',
            data: data,
            options: {
                elements: {
                    point: {
                        radius: 0,
                    }
                },

                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        // https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks
                        enabled: true,
                    },
                },

                scales: {
                    y: {
                        display: false // Hide Y axis labels
                    },
                    x: {
                        display: false // Hide X axis labels
                    }
                }
            }
        });
    }

    renderSymbol() {
        if (!this.symbol) {
            return this.renderLoading();
        }

        if (!this.quotes.has(this.symbol)) {
            return this.renderLoading();
        }

        const quote = this.quotes.get(this.symbol);
        const change = parseFloat(`${quote.PerDiff || 0}`).toFixed(3);

        return <div class="quote">
            {this.label ? <div class="symbol">{this.symbol} ({this.label})</div> : <div class="symbol">{this.symbol}</div>}
            <div class="bid">{quote.Bid}</div>
            <div class={quote.PerDiff > 0 ? "change up" : (quote.PerDiff < 0 ? "change down" : "change")}>{quote.PerDiff > 0 ? "+" : ""}{quote.Diff} ({quote.PerDiff > 0 ? "+" : ""}{change}%)</div>
        </div>
    }

    componentDidLoad(): void {
        if (!this.showChart) {
            return;
        }

        this.renderChart({
            data: this.chartData.data,
            labels: this.chartData.labels,
            direction: 0
        });
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        const classes = [ "size-default" ];
        return (
            <div class={classes.join(" ")}>
                {this.loading && this.renderLoading()}
                {!this.loading && this.renderSymbol()}
                {this.showChart &&
                <div class="graph">
                    <canvas ref={ref => this.setCanvas(ref)} height="70px"></canvas>
                </div>}
            </div>
        );
    }

}
