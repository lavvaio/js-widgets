import { ClientMessageDataType, LVLogger, WebsocketConnection } from "@anadyme/lavva-js-sdk";
import { Component, Prop, h, State, Watch } from "@stencil/core";
import { filter, Subscription } from "rxjs";
import store from "store2";
import { Quote } from "../../shared/mt-quote";
import { createLogger, translate } from "../../utils";

@Component({
    tag: 'mt-quote',
    styleUrls: [ 'mt-quote.scss' ],
    shadow: true,
    assetsDirs: [ './assets' ]
})
export class MTQuote {

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
    format: 'text' | 'binary' = 'binary';

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
    data = [];

    @State()
    loading = true;

    @State()
    storage = new Map<string, Quote>();

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

    renderSymbol() {
        if (!this.symbol) {
            return this.renderLoading();
        }

        if (!this.storage.has(this.symbol)) {
            return this.renderLoading();
        }

        const quote = this.storage.get(this.symbol);
        const change = parseFloat(`${quote.Change || 0}`).toFixed(3);
        const bid = !!quote.Digits ? parseFloat(`${quote.Bid}`).toFixed(quote.Digits) : quote.Bid;

        return <div class="quote">
            {this.label ? <div class="symbol">{this.symbol} ({this.label})</div> : <div class="symbol">{this.symbol}</div>}
            <div class="bid">{bid}</div>
            <div class={quote.Change > 0 ? "change up" : (quote.Change < 0 ? "change down" : "change")}>({quote.Change > 0 ? "+" : ""}{change}%)</div>
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
