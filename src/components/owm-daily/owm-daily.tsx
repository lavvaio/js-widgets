import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger, capitalize } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';

@Component({
    tag: 'owm-daily',
    styleUrl: './owm-daily.scss',
    shadow: false,
})
export class OpenWeatherComponent implements LavvaWidget {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    dataChannel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'own';

    @State()
    data: any;

    @Prop()
    useCache = true;

    @Method()
    async log(...args: any[]) {
        this.logger.log(...args);
    }

    private logger = createLogger('owm');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadWeather();

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
            debounceTime(150),
        ).subscribe(message => {
            // this.logger.log('message arrived', this.dataKey, message);
            this.saveWeather(message.value);
        }));
    }

    saveWeather(weather: any) {
        this.data = weather;
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            ns.set(this.dataChannel, weather);
        }
    }

    loadWeather() {
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.dataChannel, this.data);
        }
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        if (!this.data) {
            return ( <span class="loading">loading</span> );
        }

        const wiClass = `weather wi wi-owm-${ this.data.current.weather[0].id }`;
        const wsDescription = capitalize(this.data.current.weather[0].description);

        return (
            <div>
                <div class="owm">
                    <div class="current">
                        <label>Today</label>
                        <div title="Temperature" class="temp">{this.data.current.temp}&deg;</div>
                        <i title={ wsDescription } class={ wiClass }></i>
                        <div class="humidity" title="Humidity">
                            <div>
                                <i class="wi wi-humidity"></i>
                            </div>
                            <div>{this.data.current.humidity} %</div>
                        </div>
                        <div class="pressure" title="Pressure">
                            <div>
                                <i class="wi wi-barometer"></i>
                            </div>
                            <div>{this.data.current.pressure} hPa</div>
                        </div>
                    </div>
                    {this.data.daily.filter((_, i) => i > 0 && i < 7).map((day, i) => {
                        return <owm-daily-item seq={ i } day={ day }></owm-daily-item>
                    })}
                </div>
                <div class="powered-by">Powered by OpenWeather</div>
            </div>
        );
    }

}
