import { ClientMessageDataType, LVLogger, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Component, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';
import { filter, Subscription } from 'rxjs';
import store from 'store2';
import { createLogger, translate } from '../../shared/utils';
import { Quote, TradeSymbol } from '../../shared/mt-quote';

@Component({
    tag: 'mt-marquee',
    styleUrls: [ 'mt-marquee.scss' ],
    shadow: true,
    assetsDirs: [ './assets' ]
})
export class MtMarquee {

    private logger: LVLogger;
    private subscriptions = new Subscription();

    @Prop()
    host = 'xxxxxxxxxx.apps.anadyme.com';

    @Prop()
    channel: string;

    @Prop()
    locale = 'en';

    @Prop()
    translations: {
        [key: string]: {
            [key: string]: string;
        }
    } = null;

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
        { key: "BTCUSDm", label: "BTC/USD" , image: "/build/assets/svg/BTCUSDm.svg" },
        { key: "XAUUSDm", label: "Gold/USD", image: "/build/assets/svg/XAUUSDm.svg" },
        { key: "EURUSDm",  label: "EUR/USD", image: "/build/assets/svg/EURUSDm.svg" },
        { key: "USOILm", label: "US Oil"   , image: "/build/assets/svg/USOILm.svg" },
        { key: "ETHUSDm", label: "ETH/USD" , image: "/build/assets/svg/ETHUSDm.svg" },
        //
        { key: "EURUSDm", label: "EUR/USD" , image: "/build/assets/svg/EURUSDm.svg" },
        { key: "USDJPYm", label: "USD/JPY" , image: "/build/assets/svg/USDJPYm.svg" },
        { key: "GBPUSDm",  label: "GBP/USD", image: "/build/assets/svg/GBPUSDm.svg" },
        { key: "USDCHFm", label: "USD/CHF" , image: "/build/assets/svg/USDCHFm.svg" },
        { key: "USDCADm", label: "USD/CAD" , image: "/build/assets/svg/USDCADm.svg" },
        //
        { key: "USTECm", label: "US Tech 100"   , image: "/build/assets/svg/USTECm.svg" },
        { key: "UK100m", label: "UK 100 Index"  , image: "/build/assets/svg/UK100m.svg" },
        { key: "STOXX50m",  label: "EU 50 Index", image: "/build/assets/svg/STOXX50m.svg" },
        { key: "HK50m", label: "HK 50 Index"    , image: "/build/assets/svg/HK50m.svg" },
        { key: "DE30m", label: "DE 30 Index"    , image: "/build/assets/svg/DE30m.svg" },
        //
        { key: "XAUUSDm", label: "Gold/USD", image: "/build/assets/svg/XAUUSDm.svg" },
        { key: "XAGUSDm", label: "Silver/USD", image: "/build/assets/svg/XAGUSDm.svg" },
        { key: "USOILm", label: "US Crude Oil", image: "/build/assets/svg/USOILm.svg" },
        { key: "XPDUSDm", label: "Palladium/USD", image: "/build/assets/svg/XPDUSDm.svg" },
        { key: "XPTUSDm", label: "Platinum/USD", image: "/build/assets/svg/XPTUSDm.svg" },
        //
        { key: "AAPLm", label: "Apple"  , image: "/build/assets/svg/AAPLm.svg" },
        { key: "BABAm", label: "AliBaba", image: "/build/assets/svg/BABAm.svg" },
        { key: "Cm", label: "CitiGroup" , image: "/build/assets/svg/Cm.svg" },
        { key: "KOm", label: "CocaCola" , image: "/build/assets/svg/KOm.svg" },
        { key: "NFLXm", label: "Netflix", image: "/build/assets/svg/NFLXm.svg" },
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

    @Prop()
    debug = false;

    @Prop()
    autoconnect = true;

    @Prop({ mutable: true })
    connection: WebsocketConnection = null;

    @Watch('connection')
    connect(_, old) {
        if (this.autoconnect && !!old) {
            this.log('could not subscribe to events');
            return;
        }

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.log('client connected', message.value.client_id, message);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => message.category === 'ticks'),
        ).subscribe(message => {
            this.saveQuote(message.value);
        }));
    }

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    private marqueeSet = false;
    private ref: HTMLElement = null;

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    loadQuotes() {
        this.log('loading quotes');

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
            this.storage = new Map<string, any>((this.data || []).map(x => {
                return [x.Symbol, x] as [string, any]
            }));

            this.log('cached quotes found', this.data);
        }
    }

    saveQuote(quote: Quote) {
        this.log('>> saving quote', quote);

        if (this.storage.has(quote.Symbol)) {
            if (this.storage.get(quote.Symbol).Time > quote.Time) {
                this.log("detected older quote", quote);
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

        this.log('widget attached', this.locale);

        this.loadQuotes();

        if (this.autoconnect) {
            this.connection = new WebsocketConnection({
                host: this.host,
                format: this.format,
                encoding: this.encoding,
                channels: this.channel ? [this.channel] : [],
                apiKey: this.apiKey,
            });

            this.subscriptions.add(this.connection.connect());
        }
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
        const change = parseFloat(`${quote.PerDiff || 0}`).toFixed(3);
        const bid = !!quote.Digits ? parseFloat(`${quote.Bid}`).toFixed(quote.Digits) : quote.Bid;

        return (
            <div class="quote" onClick={_ => this.symbolClick.emit(symbol)}>
                <span class="symbol">{symbol.label}</span>
                <span class="bid">{bid}</span>
                <span class={quote.PerDiff > 0 ? "change up" : (quote.PerDiff < 0 ? "change down" : "change")}>{quote.PerDiff > 0 ? "+" : ""}{change}%</span>
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
