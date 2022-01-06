import { ClientMessageDataType, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State, Watch } from '@stencil/core';
import { Subscription, throttleTime } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';
import { Twit } from './twit';

@Component({
    tag: 'lv-twitter',
    styleUrl: './twitter.scss',
    shadow: true,
})
export class TwitterComponent implements LavvaWidget {

    private logger = createLogger('twitter');
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
    debug = false;

    @Prop()
    useCache = true;

    @Prop()
    namespace = 'twitter';

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
            this.log('client connected', message.value.client_id);
            if (this.size === undefined) {
                this.size = message.value.channel_size;
            }
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            throttleTime(this.throttle),
        ).subscribe(message => {
            this.saveTwit(message.value);
        }));
    }

    @Prop()
    format: WebsocketConnectionFormat = 'binary';

    @Prop()
    encoding: WebsocketConnectionEncoding = 'msgpack';

    @Prop()
    apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    @Prop({ mutable: true, reflect: true })
    size = undefined;

    @State()
    data = [];

    @Prop()
    throttle = 1000;

    @Prop()
    autoconnect = true;

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    connectedCallback() {
        this.log('widget attached', this.size, "xyz");

        this.loadTwits();

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

    loadTwits() {
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
        }
    }

    saveTwit(twit: any) {
        this.data = [
            twit,
            ...this.data.slice(0, this.size - 1)
        ];

        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.channel, this.data);
        }
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div data-size={this.size}>
                <div class="twitr">
                    <ul class="twits">
                    {this.data.map(twit => {
                        return <Twit data={twit} />
                    })}
                    </ul>
                </div>
                <div class="powered-by">Powered by Twitter</div>
            </div>
        );
    }

}
