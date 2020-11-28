import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import store from 'store2';
import { createLogger, capitalize } from '../../shared/utils';

@Component({
    tag: 'owm-daily',
    styleUrl: './owm-daily.scss',
    shadow: false,
})
export class OpenWeatherComponent {

    @Prop()
    connection: WebsocketConnection;

    @Prop()
    channel: string;

    @Prop()
    namespace = 'own';

    @State()
    data: any;

    @Method()
    log(args: any[]) {
        this.logger.log(...args);
    }

    private logger = createLogger('owm');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.log(['host connected']);

        this.loadWeather();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.log(['connection found', this.channel]);

        this.subscriptions.add(this.connection.channelStream(this.channel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            debounceTime(150),
        ).subscribe(message => {
            this.saveWeather(message.value);
        }));
    }

    saveWeather(weather: any) {
        this.logger.log('saving weather', weather);
        this.data = weather;
        const ns = store.namespace(this.namespace);
        ns.set(this.channel, weather);
    }

    loadWeather() {
        this.logger.log('loading weather');
        const ns = store.namespace(this.namespace);
        this.data = ns.get(this.channel, this.data);
    }

    disconnectedCallback() {
        console.log('>> host disconnected');
        this.subscriptions.unsubscribe();
    }

    render() {
        if (!this.data) {
            return ( <span class="loading">loading</span> );
        }

        const wiClass = `weather wi wi-owm-${ this.data.current.weather[0].id }`;
        const wsDescription = capitalize(this.data.current.weather[0].description);

        return (
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
        );
    }

}
