import { ClientMessageDataType, LVLogger, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from "@anadyme/lavva-js-sdk";
import { Component, Prop, h, State, Watch, Element } from "@stencil/core";
import { filter, Subscription } from "rxjs";
import store from "store2";
import { Quote } from "../../shared/mt-quote";
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

    private graph: HTMLCanvasElement;
    private graphLoaded = false;

    public chart: Chart;

    private chartUp: string;
    private chartDown: string;

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
    useCache = true;

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

    @State()
    quoteData = [];

    @State()
    loading = true;

    @State()
    quotes = new Map<string, Quote>();

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    loadQuotes() {
        this.logger.log('loading quotes');

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.quoteData = ns.get(this.channel, this.quoteData);

            this.quotes = new Map<string, any>((this.quoteData || []).map(x => {
                return [x.Symbol, x] as [string, any]
            }));

            this.logger.log('cached quotes found', this.quoteData);
        }
    }

    saveHistory(history: History) {
        this.logger.log('>> saving history', history);
    }

    saveQuote(quote: Quote) {
        this.logger.log('>> saving quote', quote);

        if (this.quotes.has(quote.Symbol)) {
            if (this.quotes.get(quote.Symbol).Time > quote.Time) {
                this.logger.log("detected older quote", quote);
                return;
            }
        }

        if (this.loading) this.loading = false;
        this.quotes.set(quote.Symbol, quote);
        this.quoteData = Array.from(this.quotes, ([_, value]) => (value));

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.channel, this.quoteData);
        }
    }

    connectedCallback() {
        this.createLogger(this.namespace, null);

        this.logger.log('widget attached', this.locale);

        this.loadQuotes();

        this.connection = new WebsocketConnection({
            host: this.host,
            format: this.format,
            encoding: this.encoding,
            channels: this.channel ? [this.channel] : [],
            apiKey: this.apiKey,
        });

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.logger.log('client connected', message.value.client_id, message);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
        ).subscribe(message => {
            if (message.category === 'history') {
                this.saveHistory(message.value);
            } else {
                this.saveQuote(message.value);
            }
        }));

        this.subscriptions.add(this.connection.connect());
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    renderLoading() {
        return (
            <div class="loader">
                <span class="txt">{this.translate("loading", "Loading...")}</span>
            </div>
        )
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
    }

    renderChart(values: { data: number[], direction: 'up' | 'down' }) {
        this.chartUp = getComputedStyle(this.element, null).
            getPropertyValue('--symbol-percent-up');

        this.chartDown = getComputedStyle(this.element, null).
            getPropertyValue('--symbol-percent-down');

        const data = {
            // labels : ["January", "February", "March","April","May","June","July"],
            labels: values.data.map(value => `${value}`),

            datasets : [
                {
                    borderColor: values.direction === 'up' ?
                        this.chartUp : this.chartDown,
                    borderWidth: 1,
                    data: values.data,
                }
            ]
        }

        this.chart = new Chart(this.graph.getContext('2d'), {
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

        console.log( getComputedStyle(this.element, null).getPropertyValue('--symbol-percent-up') );

    }

    renderSymbol() {
        if (!this.symbol) {
            return this.renderLoading();
        }

        if (!this.quotes.has(this.symbol)) {
            return this.renderLoading();
        }

        if (!this.graphLoaded) {
            if (this.graph) {
                this.graphLoaded = true;
                this.renderChart({
                    data: [
                        1.233, 1.445, 1.245,
                        1.67, 1.333, 1.123,
                        1.245, 1.67, 1.333,
                        1.445, 1.245, 1.67,
                        1.67, 1.67, 1.11,
                        1.333, 1.123, 1.245,
                        1.333, 1.123, 1.245,
                        1.245, 1.333, 1.332,
                        1.445, 1.245, 1.67,
                        1.67, 1.67, 1.11,
                    ],
                    direction: 'down'
                });
            }
        }

        const quote = this.quotes.get(this.symbol);
        const change = parseFloat(`${quote.PerChange || 0}`).toFixed(3);
        const bid = !!quote.Digits ? parseFloat(`${quote.Bid}`).toFixed(quote.Digits) : quote.Bid;

        return <div>
            <div class="quote">
                {this.label ? <div class="symbol">{this.symbol} ({this.label})</div> : <div class="symbol">{this.symbol}</div>}
                <div class="bid">{bid}</div>
                <div class={quote.PerChange > 0 ? "change up" : (quote.PerChange < 0 ? "change down" : "change")}>({quote.PerChange > 0 ? "+" : ""}{change}%)</div>
            </div>
            <div class="graph">
                <canvas ref={el => this.graph = el} height="70px"></canvas>
            </div>
        </div>
    }

    render() {
        const classes = [ "size-default" ];
        return (
            <div class={classes.join(" ")}>
                {this.loading && this.renderLoading()}
                {!this.loading && this.renderSymbol()}
            </div>
        );
    }

}
