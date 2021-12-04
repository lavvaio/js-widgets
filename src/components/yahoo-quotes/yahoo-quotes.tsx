import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger } from "../../shared/utils";
import { LavvaWidget } from '../../shared/model';

@Component({
    tag: 'yahoo-quotes',
    styleUrl: './yahoo-quotes.scss',
    shadow: false,
})
export class YahooQuotesComponent implements LavvaWidget {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    channel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'yahoo-quotes';

    @Prop()
    useCache = true;

    @State()
    symbols = new Map<string, any>();

    @State()
    data = [];

    @Prop()
    debug = false;

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    private logger = createLogger('yahoo-quotes');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadQuotes();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.log('client connected', message.value.client_id);
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => this.dataKey === undefined ? true : message.key === this.dataKey),
            // debounceTime(150),
        ).subscribe(message => {
            this.saveQuote(message.value);
        }));
    }

    saveQuote(quote: any) {
        this.symbols.set(quote.symbol, quote);
        this.data = Array.from(this.symbols, ([name, value]) => ({ name, value }));
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.channel, this.data);
        }
    }

    loadQuotes() {
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
            this.symbols = new Map<string, any>((this.data || []).map(x => [x.name, x.value] as [string, any]));
        }
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div>
                <div class="yquotes">
                    {this.data.map((quote) => {
                        return <yahoo-quote class={ quote.name } data={ quote.value }></yahoo-quote>
                    })}
                </div>
                <div class="powered-by">Powered by Yahoo quotes</div>
            </div>
        );
    }

}
