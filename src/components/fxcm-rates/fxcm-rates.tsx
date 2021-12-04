import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';
import { FXCMRate } from './fxcm';

@Component({
    tag: 'fxcm-rates',
    styleUrl: './fxcm-rates.scss',
    shadow: false,
})
export class FXCMRatesComponent implements LavvaWidget {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    dataChannel!: string;

    @Prop()
    dataKey: string[] = [];

    @Prop()
    namespace = 'fxcm-rates';

    @State()
    rates = new Map<string, FXCMRate>();

    @State()
    data = [];

    @State()
    size = 1;

    @Prop()
    useCache = true;

    @Prop()
    symbolNames = [];

    @Prop()
    debug = false;

    @Method()
    async log(...args: any[]) {
        if (this.debug) {
            this.logger.log(...args);
        }
    }

    private logger = createLogger('fxcm-rates');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadRates();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.subscriptions.add(this.connection.channelStream(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.log('client connected', message.value.client_id);
            this.size = message.value.channel_size;
        }));

        this.subscriptions.add(this.connection.channelStream(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => {
                if (this.dataKey === undefined) {
                    return true;
                }

                if (this.dataKey.length === 0) {
                    return true;
                }

                return this.dataKey.includes(message.key);
            }),
        ).subscribe(message => {
            this.saveRate(message.value);
        }));
    }

    saveRate(rate: FXCMRate) {
        this.rates.set(rate.Symbol, rate);
        this.data = Array.from(this.rates, ([name, value]) => ({ name, value }));
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.dataChannel, this.data);
        }
    }

    loadRates() {
        this.log('loading rates');
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.dataChannel, this.data);
            this.rates = new Map<string, FXCMRate>((this.data || []).map(x => [x.name, x.value] as [string, any]));
        }
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    getDirectionClass(rate: FXCMRate) {
        if (rate.Direction === 1) {
            return 'entry direction-up';
        } else if (rate.Direction === -1) {
            return 'entry direction-down';
        }

        return 'entry direction-none';
    }

    render() {
        return (
            <div>
                <div class="fxcm-rates">
                    <section class="top">
                        <div>Symbol</div>
                        <div>Bid</div>
                        <div>Ask</div>
                        <div>Low</div>
                        <div>High</div>
                        <div>Last Updated</div>
                    </section>
                    <section class="entries">
                    {this.data.map((rate) => {
                        return <section class={ this.getDirectionClass(rate.value) }>
                            <div>{ rate.value.Symbol }</div>
                            <div>{ rate.value.Bid }</div>
                            <div>{ rate.value.Ask }</div>
                            <div>{ rate.value.Low }</div>
                            <div>{ rate.value.High }</div>
                            <div>{ rate.value.LastUpdated }</div>
                        </section>
                    })}
                    </section>
                </div>
                <div class="powered-by">Powered by FXCM rates</div>
            </div>
        );
    }

}
