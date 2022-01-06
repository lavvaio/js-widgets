import { WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from "@anadyme/lavva-js-sdk";
import { Component, Event, EventEmitter, Prop, State } from "@stencil/core";
import { Subscription } from "rxjs";

@Component({
    tag: 'lv-conn',
    shadow: false,
})
export class LavvaConnection {

    private subscriptions = new Subscription();

    @Event()
    open: EventEmitter<WebsocketConnection>;

    @State()
    connection: WebsocketConnection;

    @Prop()
    host = 'xxxxxxxxxx.apps.anadyme.com';

    @Prop()
    channels: string | string[];

    @Prop()
    format: WebsocketConnectionFormat = 'binary';

    @Prop()
    encoding: WebsocketConnectionEncoding = 'msgpack';

    @Prop()
    apiKey = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

    @Prop()
    snapshot = true;

    connectedCallback() {
        this.connection = new WebsocketConnection({
            host: this.host,
            format: this.format,
            encoding: this.encoding,
            channels: Array.isArray(this.channels) ? this.channels : this.channels.split(','),
            apiKey: this.apiKey,
        });

        this.subscriptions.add(this.connection.openConnectionStream().subscribe(() => {
            this.open.emit(this.connection);
        }));

        this.subscriptions.add(this.connection.errorConnectionStream().subscribe(() => {
            //
        }));

        this.subscriptions.add(this.connection.dataConnectionStream().subscribe(() => {
            //
        }));

        this.subscriptions.add(this.connection.closeConnectionStream().subscribe(() => {
            // this.open.emit(false);
        }));

        this.subscriptions.add(this.connection.connect());
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

}
