import { ClientMessageDataType, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Event, EventEmitter, Component, h, Prop, State, getAssetPath } from '@stencil/core';
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
    tab = "most-traded"

    @Prop({ mutable: true })
    groups: Category[] = [
        {
            name: "most-traded",
            label: this.translate("most-traded", "Most traded"),
            symbols: [
                { key: "BTCUSDm", label: "BTC/USD" },
                { key: "XAUUSDm", label: "Gold/USD" },
                { key: "EURUSDm",  label: "EUR/USD" },
                { key: "USOILm", label: "US Oil" },
                { key: "ETHUSDm", label: "ETH/USD" }
            ],
        },
        {
            name: "currencies",
            label: this.translate("currencies", "Currencies"),
            symbols: [
                { key: "EURUSDm", label: "EUR/USD" },
                { key: "USDJPYm", label: "USD/JPY" },
                { key: "GBPUSDm",  label: "GBP/USD" },
                { key: "USDCHFm", label: "USD/CHF" },
                { key: "USDCADm", label: "USD/CAD" }
            ]
        },
        {
            name: "indices",
            label: this.translate("indices", "Indices"),
            symbols: [
                { key: "USTECm", label: "US Tech 100" },
                { key: "UK100m", label: "UK 100 Index" },
                { key: "STOXX50m",  label: "EU 50 Index" },
                { key: "HK50m", label: "HK 50 Index" },
                { key: "DE30m", label: "DE 30 Index" }
            ]
        },
        {
            name: "digital",
            label: this.translate("digital", "Digital"),
            symbols: [
                { key: "BTCUSDm", label: "BTC/USD" },
                { key: "BTCJPYm", label: "BTC/JPY" },
                { key: "ETHUSDm", label: "ETH/USD" },
                { key: "LTCUSDm", label: "LTC/USD" },
                { key: "XRPUSDm", label: "XRP/USD" },
            ]
        },
        {
            name: "shares",
            label: this.translate("shares", "Shares"),
            symbols: [
                { key: "AAPLm", label: "Apple" },
                { key: "BABAm", label: "AliBaba" },
                { key: "Cm", label: "CitiGroup" },
                { key: "KOm", label: "CocaCola" },
                { key: "NFLXm", label: "Netflix" },
            ]
        },
        {
            name: "commodities",
            label: this.translate("commodities", "Commodities"),
            symbols: [
                { key: "XAUUSDm", label: "Gold/USD" },
                { key: "XAGUSDm", label: "Silver/USD" },
                { key: "USOILm", label: "US Crude Oil" },
                { key: "XPDUSDm", label: "Palladium/USD" },
                { key: "XPTUSDm", label: "Platinum/USD" },
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
    namespace = 'mt4-rates';

    private translate(key, fallback: string) {
        return translate(key, fallback, this.translations, this.locale);
    }

    private selectCategory(cat: Category) {
        this.groups = this.groups.map(group => Object.assign(group, { active: group.name === cat.name }));
    }

    connectedCallback() {
        this.logger.log('widget attached', this.tab);

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
            this.logger.log('client connected', message.value.client_id, message);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => message.category === 'ticks'),
        ).subscribe(message => {
            // this.logger.log('message received', message.value);
            this.saveQuote(message.value);
        }));

        this.subscriptions.add(this.connection.connect());
    }

    saveQuote(quote: Quote) {
        if (this.storage.has(quote.Symbol)) {
            if (this.storage.get(quote.Symbol).Time > quote.Time) {
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

    loadQuotes() {
        this.logger.log('loading quotes');

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
            this.storage = new Map<string, any>((this.data || []).map(x => {
                return [x.Symbol, x] as [string, any]
            }));

            this.logger.log('cached quotes found', this.storage);
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
                <img class={`${symbol.key} ${category.name}`} src={symbol.src ? symbol.src : getAssetPath(`./assets/svg/${symbol.key}.svg`)} />
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
                        <div class="right-faded"></div>
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
