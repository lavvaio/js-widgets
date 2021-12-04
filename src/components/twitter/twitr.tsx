import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger, loadImage } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';

@Component({
    tag: 'twit-ter',
    styleUrl: './twitr.scss',
    shadow: false,
})
export class TwitrComponent implements LavvaWidget {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    channel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'twitr';

    @Prop()
    useCache = true;

    @State()
    size = 1;

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

    private logger = createLogger('twitr');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadTwits();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.log('client connected', message.value.client_id);
            this.size = message.value.channel_size;
        }));

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => this.dataKey === undefined ? true : message.key === this.dataKey),
        ).subscribe(message => {
            this.saveTwit(message.value);
        }));
    }

    loadTwits() {
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.channel, this.data);
        }
    }

    saveTwit(twit: any) {
        loadImage(twit.user.profile_image_url_https).then(_ => {
            this.data = [ twit, ...this.data.slice(0, this.size - 1) ];
            if (this.useCache) {
                const ns = store.namespace(this.namespace);
                ns.set(this.channel, this.data);
            }
        });
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div>
                <div class="twitr">
                    <ul class="twits">
                    {this.data.map(twit => {
                        return <li class="twit">
                            <img class="avatar" title={ twit.user.name } src={ twit.user.profile_image_url_https } />
                            <div class="body">
                                <div class="user">
                                    <div>{ twit.user.name }</div>
                                    { twit.user.verified ?
                                    <div class="verified"></div>
                                    : null }
                                    <div class="handler">@{ twit.user.screen_name }</div>
                                </div>
                                <div class="msg">{ twit.text }</div>
                                <div class="time">{ twit.created_at }</div>
                                { twit.source ?
                                <div class="source">
                                    <span>Source:</span>
                                    <span innerHTML={ twit.source }></span>
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
