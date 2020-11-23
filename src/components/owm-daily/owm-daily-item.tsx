import { Component, h, Prop } from '@stencil/core';
import { capitalize } from '../../shared/utils';

@Component({
    tag: 'owm-daily-item',
    styleUrl: 'owm-daily-item.scss',
})
export class OpenWeatherDailyItemComponent {

    @Prop()
    day: any;

    @Prop()
    seq = 0;

    @Prop()
    weekDays = [
        'SUN',
        'MON',
        'TUE',
        'WED',
        'THU',
        'FRI',
        'SAT',
    ];

    render() {
        const klass=`owm-daily seq-${this.seq}`;
        const dateNow = new Date(this.day.dt * 1000);
        const wiClass = `weather wi wi-owm-${ this.day.weather[0].id }`;
        const wsDescription = capitalize(this.day.weather[0].description);
        return (
            <section class={ klass }>
                <div class="daily">
                    <label>{this.weekDays[dateNow.getDay()]}</label>

                    <div class="temp" title="Day temperature">
                        <i class="wi wi-day-sunny"></i>
                        <div>{this.day.temp.day}&deg;</div>
                    </div>

                    <i title={ wsDescription } class={ wiClass }></i>

                    <div class="temp temp2" title="Night temperature">
                        <i class="wi wi-night-clear"></i>
                        <div>{this.day.temp.night}&deg;</div>
                    </div>
                </div>
            </section>
        );
    }

}
