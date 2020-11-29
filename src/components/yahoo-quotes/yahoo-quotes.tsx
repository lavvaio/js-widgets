import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger } from "../../shared/utils";

@Component({
    tag: 'yahoo-quotes',
    styleUrl: './yahoo-quotes.scss',
    shadow: false,
})
export class YahooQuotesComponent {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    dataChannel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'yahoo-quotes';

    @State()
    symbols = new Map<string, any>();

    @State()
    data = [];

    @Method()
    async log(...args: any[]) {
        this.logger.log(...args);
    }

    private logger = createLogger('yahoo-quotes');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadQuotes();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.subscriptions.add(this.connection.channelStream(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.logger.log('client connected', message.value.client_id);
        }));

        this.subscriptions.add(this.connection.channelStream(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => this.dataKey === undefined ? true : message.key === this.dataKey),
            // debounceTime(150),
        ).subscribe(message => {
            // this.logger.log('message arrived', this.dataKey, message);
            this.saveQuote(message.value);
        }));
    }

    saveQuote(quote: any) {
        this.symbols.set(quote.symbol, quote);
        this.data = Array.from(this.symbols, ([name, value]) => ({ name, value }));
        const ns = store.namespace(this.namespace);
        ns.set(this.dataChannel, this.data);
    }

    loadQuotes() {
        const ns = store.namespace(this.namespace);
        this.data = ns.get(this.dataChannel, this.data);
        this.symbols = new Map<string, any>((this.data || []).map(x => [x.name, x.value] as [string, any]));
    }

    disconnectedCallback() {
        this.logger.log('host disconnected');
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
