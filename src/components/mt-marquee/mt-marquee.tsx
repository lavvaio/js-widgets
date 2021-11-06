import { ClientMessageDataType, LVLogger, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { filter, Subscription } from 'rxjs';
import store from 'store2';
import { createLogger, translate } from "../../utils";
import { Quote, TradeSymbol } from '../../shared/mt-quote';

@Component({
    tag: 'mt-marquee',
    styleUrls: [ 'mt-marquee.scss' ],
    shadow: true,
    assetsDirs: [ './assets' ]
})
export class MtMarquee {

    private logger: LVLogger;
    private connection: WebsocketConnection;
    private subscriptions = new Subscription();

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
    size: 'default' | 'large' = 'default'

    @Prop()
    center = false;

    @Prop()
    animation = true;

    @Prop()
    symbols: TradeSymbol[] = [
        { key: "BTCUSDm", label: "BTC/USD" },
        { key: "XAUUSDm", label: "Gold/USD" },
        { key: "EURUSDm",  label: "EUR/USD" },
        { key: "USOILm", label: "US Oil" },
        { key: "ETHUSDm", label: "ETH/USD" },
        //
        { key: "USTECm", label: "US Tech 100" },
        { key: "UK100m", label: "UK 100 Index" },
        { key: "STOXX50m",  label: "EU 50 Index" },
        { key: "HK50m", label: "HK 50 Index" },
        { key: "DE30m", label: "DE 30 Index" },
        //
        { key: "BTCUSDm", label: "BTC/USD" },
        { key: "BTCJPYm", label: "BTC/JPY" },
        { key: "ETHUSDm", label: "ETH/USD" },
        { key: "LTCUSDm", label: "LTC/USD" },
        { key: "XRPUSDm", label: "XRP/USD" },
        //
        { key: "AAPLm", label: "Apple" },
        { key: "BABAm", label: "AliBaba" },
        { key: "Cm", label: "CitiGroup" },
        { key: "KOm", label: "CocaCola" },
        { key: "NFLXm", label: "Netflix" },
        //
        { key: "XAUUSDm", label: "Gold/USD" },
        { key: "XAGUSDm", label: "Silver/USD" },
        { key: "USOILm", label: "US Crude Oil" },
        { key: "XPDUSDm", label: "Palladium/USD" },
        { key: "XPTUSDm", label: "Platinum/USD" },
    ];

    @Event()
    symbolClick: EventEmitter<TradeSymbol>;

    @Prop()
    apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    @Prop()
    snapshot = true;

    @Prop()
    useCache = true;

    @Prop()
    namespace = 'mt-marquee';

    @Watch('namespace')
    createLogger(newValue: string, _: string) {
        this.logger = createLogger(newValue, 'background-color:red;color:#fff;padding: 2px 4px;font-size:10px;border-radius:4px;');
    }

    @State()
    data = [];

    @State()
    loading = true;

    @State()
    storage = new Map<string, Quote>();

    private marqueeSet = false;
    private ref: HTMLElement = null;

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    loadQuotes() {
        this.logger.log('loading quotes');

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
            this.storage = new Map<string, any>((this.data || []).map(x => {
                return [x.Symbol, x] as [string, any]
            }));

            this.logger.log('cached quotes found', this.data);
        }
    }

    saveQuote(quote: Quote) {
        if (this.storage.has(quote.Symbol)) {
            if (this.storage.get(quote.Symbol).Timestamp > quote.Timestamp) {
                this.logger.log("detected older quote", quote);
                return;
            }
        }

        if (this.loading) this.loading = false;
        this.storage.set(quote.Symbol, quote);
        this.data = Array.from(this.storage, ([_, value]) => (value));

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.channel, this.data);
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
            // this.logger.log('message received', message.value);
            this.saveQuote(message.value);
        }));

        this.subscriptions.add(this.connection.connect());
    }

    componentWillUpdate() {
        if (!this.ref) return;
        if (this.marqueeSet) return;
        this.marqueeSet = true;
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    renderSymbol(symbol: TradeSymbol) {
        const quote = this.storage.get(symbol.key);
        const change = parseFloat(`${quote.Change || 0}`).toFixed(3);
        const bid = !!quote.Digits ? parseFloat(`${quote.Bid}`).toFixed(quote.Digits) : quote.Bid;

        return (
            <div class="quote" onClick={_ => this.symbolClick.emit(symbol)}>
                <span class="symbol">{symbol.label}</span>
                <span class="bid">{bid}</span>
                <span class={quote.Change > 0 ? "change up" : (quote.Change < 0 ? "change down" : "change")}>{quote.Change > 0 ? "+" : ""}{change}%</span>
            </div>
        )
    }

    renderLoading() {
        return (
            <div class="loader">
                <span class="txt">{this.translate("loading", "Loading...")}</span>
            </div>
        )
    }

    render() {
        const classes = [ "size-default" ];
        if (this.center) classes.push("center");
        const tickerClass = [ "ticker__list" ];
        if (!this.animation) tickerClass.push("no-animation");
        return (
            <div class={classes.join(" ")}>
                {this.loading && this.renderLoading()}
                {!this.loading &&
                    <div class="quotes" ref={el => this.ref = el}>
                        <div class={tickerClass.join(" ")}>
                            {this.symbols.filter(symbol => this.storage.has(symbol.key)).map(symbol => {
                                return this.renderSymbol(symbol);
                            })}
                        </div>
                        {this.animation &&
                        <div class={tickerClass.join(" ")}>
                            {this.symbols.filter(symbol => this.storage.has(symbol.key)).map(symbol => {
                                return this.renderSymbol(symbol);
                            })}
                        </div>}
                    </div>}
            </div>
        );
    }

}
