import { ClientMessageDataType, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Event, EventEmitter, Component, h, Prop, State, Method } from '@stencil/core';
import { filter, Subscription } from 'rxjs';
import store from 'store2';
import { Category, Quote, TradeSymbol } from '../../shared/mt-quote';
import { createLogger, translate } from '../../utils';


@Component({
    tag: 'mt-rates',
    styleUrls: [ 'mt-rates.scss' ],
    shadow: true,
    assetsDirs: [ './assets' ]
})
export class MT4Rates {

    private connection: WebsocketConnection;
    private logger = createLogger('mt-rates');
    private subscriptions = new Subscription();

    @Prop()
    host = 'xxxxxxxxxx.apps.anadyme.com';

    @Prop()
    channel: string;

    @Prop()
    locale = 'en';

    @Prop()
    size: 'default' | 'large' = 'default'

    @Prop()
    translations: {
        [key: string]: {
            [key: string]: string;
        }
    } = null;

    @Prop()
    tabs = true

    @Prop()
    names = true

    @Prop()
    tab = "popular"

    @Prop({ mutable: true })
    groups: Category[] = [
        {
            name: "popular",
            label: this.translate("popular", "Popular"),
            symbols: [
                { key: "BTCUSDm", label: "BTC/USD" , image: "/build/assets/svg/BTCUSDm.svg" },
                { key: "XAUUSDm", label: "Gold/USD", image: "/build/assets/svg/XAUUSDm.svg" },
                { key: "EURUSDm",  label: "EUR/USD", image: "/build/assets/svg/EURUSDm.svg" },
                { key: "USOILm", label: "US Oil"   , image: "/build/assets/svg/USOILm.svg" },
                { key: "ETHUSDm", label: "ETH/USD" , image: "/build/assets/svg/ETHUSDm.svg" },
            ],
        },
        {
            name: "forex",
            label: this.translate("forex", "Forex"),
            symbols: [
                { key: "EURUSDm", label: "EUR/USD" , image: "/build/assets/svg/EURUSDm.svg" },
                { key: "USDJPYm", label: "USD/JPY" , image: "/build/assets/svg/USDJPYm.svg" },
                { key: "GBPUSDm",  label: "GBP/USD", image: "/build/assets/svg/GBPUSDm.svg" },
                { key: "USDCHFm", label: "USD/CHF" , image: "/build/assets/svg/USDCHFm.svg" },
                { key: "USDCADm", label: "USD/CAD" , image: "/build/assets/svg/USDCADm.svg" },
            ]
        },
        {
            name: "stocks",
            label: this.translate("stocks", "Stocks"),
            symbols: [
                { key: "USTECm", label: "US Tech 100"   , image: "/build/assets/svg/USTECm.svg" },
                { key: "UK100m", label: "UK 100 Index"  , image: "/build/assets/svg/UK100m.svg" },
                { key: "STOXX50m",  label: "EU 50 Index", image: "/build/assets/svg/STOXX50m.svg" },
                { key: "HK50m", label: "HK 50 Index"    , image: "/build/assets/svg/HK50m.svg" },
                { key: "DE30m", label: "DE 30 Index"    , image: "/build/assets/svg/DE30m.svg" },
            ]
        },
        {
            name: "crypto",
            label: this.translate("crypto", "Crypto"),
            symbols: [
                { key: "BTCUSDm", label: "BTC/USD", image: "/build/assets/svg/BTCUSDm.svg" },
                { key: "BTCJPYm", label: "BTC/JPY", image: "/build/assets/svg/BTCJPYm.svg" },
                { key: "ETHUSDm", label: "ETH/USD", image: "/build/assets/svg/ETHUSDm.svg" },
                { key: "LTCUSDm", label: "LTC/USD", image: "/build/assets/svg/LTCUSDm.svg" },
                { key: "XRPUSDm", label: "XRP/USD", image: "/build/assets/svg/XRPUSDm.svg" },
            ]
        },
        {
            name: "shares",
            label: this.translate("shares", "Shares"),
            symbols: [
                { key: "AAPLm", label: "Apple"  , image: "/build/assets/svg/AAPLm.svg" },
                { key: "BABAm", label: "AliBaba", image: "/build/assets/svg/BABAm.svg" },
                { key: "Cm", label: "CitiGroup" , image: "/build/assets/svg/Cm.svg" },
                { key: "KOm", label: "CocaCola" , image: "/build/assets/svg/KOm.svg" },
                { key: "NFLXm", label: "Netflix", image: "/build/assets/svg/NFLXm.svg" },
            ]
        },
        {
            name: "metal",
            label: this.translate("metal", "Metals"),
            symbols: [
                { key: "XAUUSDm", label: "Gold/USD"     , image: "/build/assets/svg/XAUUSDm.svg" },
                { key: "XAGUSDm", label: "Silver/USD"   , image: "/build/assets/svg/XAGUSDm.svg" },
                { key: "XPDUSDm", label: "Palladium/USD", image: "/build/assets/svg/XPDUSDm.svg" },
                { key: "XPTUSDm", label: "Platinum/USD" , image: "/build/assets/svg/XPTUSDm.svg" },
                { key: "XPTUSDm", label: "Platinum/USD" , image: "/build/assets/svg/XPTUSDm.svg" },
            ]
        }
    ];

    @Event()
    tradeClick: EventEmitter<TradeSymbol>;

    @State()
    data = [];

    @State()
    loading = true;

    @State()
    storage = new Map<string, Quote>();

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
    namespace = 'mt-rates';

    @Prop()
    debug = false;

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    private selectCategory(cat: Category) {
        this.groups = this.groups.map(group => Object.assign(group, { active: group.name === cat.name }));
    }

    connectedCallback() {
        this.log('widget attached', this.tab);

        const found = this.groups.findIndex(value => value.name === this.tab)
        if (found >= 0) {
            this.groups[found].active = true;
        } else {
            this.groups[0].active = true;
        }

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
            this.log('client connected', message.value.client_id, message);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => message.category === 'ticks'),
        ).subscribe(message => {
            // this.log('message received', message.value);
            this.saveQuote(message.value);
        }));

        this.subscriptions.add(this.connection.connect());
    }

    saveQuote(quote: Quote) {
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

    loadQuotes() {
        this.log('loading quotes');

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
            this.storage = new Map<string, any>((this.data || []).map(x => {
                return [x.Symbol, x] as [string, any]
            }));

            this.log('cached quotes found', this.storage);
        }
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    getEmptyRatePlaceholder() {
        return <div class="column-values">
            <div class="icon">&nbsp;</div>
            {this.names &&
                <div class="name">&nbsp;</div>
            }
            <div class="sell">&nbsp;</div>
            <div class="buy">&nbsp;</div>
            <div class="spread">&nbsp;</div>
            <div class="change">&nbsp;</div>
            <div class="action">&nbsp;</div>
        </div>
    }

    getRate(quote: Quote, symbol: TradeSymbol, category: Category) {
        const change = parseFloat(`${quote.PerDiff || 0}`).toFixed(3);
        return <div class="column-values">
            <div class="icon">
                <img class={`${symbol.key} ${category.name}`} src={symbol.image} />
            </div>
            {this.names &&
                <div class="name"><span>{this.translate(symbol.key, symbol.label)}</span></div>
            }
            <div class="sell"><span>{quote.Bid}</span></div>
            <div class="buy"><span>{quote.Ask}</span></div>
            <div class="spread"><span>{quote.Spread}</span></div>
            <div class="change">
                <span class={quote.PerDiff > 0 ? "up" : (quote.PerDiff < 0 ? "down" : "")}>{quote.PerDiff > 0 ? "+" : ""}{change}%</span>
            </div>
            <div class="action"><button onClick={_ => this.tradeClick.emit(symbol)}>{this.translate("trade", "Trade")}</button></div>
        </div>
    }

    renderLoading() {
        return (
            <div class="loader">
                <span class="txt">{this.translate("loading", "Loading...")}</span>
            </div>
        )
    }

    render() {
        return (
            <div class={`size-default size-${this.size} ${this.tabs ? 'with-tabs' : 'no-tabs'} ${this.names ? 'with-names' : 'no-names'}`}>
                {this.tabs && (
                    <div>
                        <div class={ (this.groups[this.groups.length - 1].active) ? `active right-faded` : `right-faded` }></div>
                        <header>
                            <ul class="categories">
                                {this.groups.map(group =>{
                                    return <li onClick={_ => this.selectCategory(group)} class={group.active ? `${group.name} active` : group.name}><span>{this.translate(group.name, group.label)}</span></li>;
                                })}
                            </ul>
                        </header>
                    </div>
                )}
                <section class="body">
                    {this.loading && this.renderLoading()}
                    <div class="column-names">
                        <div class="icon"><span>&nbsp;</span></div>
                        {this.names &&
                            <div class="name"><span>{this.translate("name", "Name")}</span></div>
                        }
                        <div class="sell"><span>{this.translate("sell", "Sell")}</span></div>
                        <div class="buy"><span>{this.translate("buy", "Buy")}</span></div>
                        <div class="spread"><span>{this.translate("spread", "Spread")}</span></div>
                        <div class="change"><span>{this.translate("change", "Change")}</span></div>
                        <div class="action"><span>&nbsp;</span></div>
                    </div>
                    {this.groups.map(group => {
                        return <div class={group.active ? "symbol-group active" : "symbol-group"}>
                            {group.symbols.map(symbol => {
                                if (this.storage.has(symbol.key)) {
                                    const sm = this.storage.get(symbol.key);
                                    return this.getRate(sm, symbol, group);
                                }

                                return this.getEmptyRatePlaceholder();
                            })}
                        </div>
                    })}
                </section>
            </div>
        );
    }

}
