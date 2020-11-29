import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createLogger } from '../../shared/utils';

@Component({
    tag: 'twit-ter',
    styleUrl: './twitr.scss',
    shadow: false,
})
export class TwitrComponent {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    dataChannel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'twitr';

    @State()
    data = [];

    @Method()
    async log(...args: any[]) {
        this.logger.log(...args);
    }

    private logger = createLogger('twitr');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.logger.log('host connected');

        this.loadTwits();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.logger.log('connection found', this.dataChannel);

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
            this.logger.log('message arrived', this.dataKey, message);
            this.saveTwit(message.value);
        }));
    }

    loadTwits() {
        //
    }

    saveTwit(twit: any) {
        if (this.data.length > 0) {
            this.data.pop();
        }

        this.data.unshift(twit);
    }

    disconnectedCallback() {
        this.logger.log('host disconnected');
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div>
                <ul>
                {this.data.map(twit => {
                    return <li>{ twit.text }</li>
                })}
                </ul>
            </div>
        );
    }

}
