import { ClientMessageDataType, WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription, throttleTime } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';

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

    @Prop()
    format: WebsocketConnectionFormat = 'binary';

    @Prop()
    encoding: WebsocketConnectionEncoding = 'msgpack';

    @Prop()
    apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    @State()
    size = 1;

    @State()
    data = [];

    @Prop()
    throttle = 1000;

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    connectedCallback() {
        this.log('widget attached');

        this.loadTwits();

        if (this.connection === null) {
            this.connection = new WebsocketConnection({
                host: this.host,
                format: this.format,
                encoding: this.encoding,
                channels: this.channel ? [this.channel] : [],
                apiKey: this.apiKey,
            });
        }

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.log('client connected', message.value.client_id);
            this.size = message.value.channel_size;
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            throttleTime(this.throttle),
        ).subscribe(message => {
            this.saveTwit(message.value);
        }));

        this.subscriptions.add(this.connection.connect());
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
                        return <li class="twit">
                            <img class="avatar" title={ twit.User.Name } src={ twit.User.ProfileImageURLHttps } />
                            <div class="body">
                                <div class="user">
                                    <div>{ twit.User.Name }</div>
                                    { twit.User.Verified ?
                                    <div class="verified"></div>
                                    : null }
                                    <div class="handler">@{ twit.User.ScreenName }</div>
                                </div>
                                <div class="msg">{ twit.Text }</div>
                                <div class="time">{ twit.CreatedAt }</div>
                                { twit.Source ?
                                <div class="source">
                                    <span>Source:</span>
                                    <span innerHTML={ twit.Source }></span>
                                </div>
                                : null }
                            </div>
                        </li>
                    })}
                    </ul>
                </div>
                <div class="powered-by">Powered by Twitter</div>
            </div>
        );
    }

}
