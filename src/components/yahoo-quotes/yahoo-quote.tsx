import { Component, h, Prop } from '@stencil/core';

@Component({
    tag: 'yahoo-quote',
    styleUrl: './yahoo-quote.scss',
    shadow: false,
})
export class YahooQuoteComponent {

    @Prop()
    symbol: string;

    @Prop()
    data: any;

    connectedCallback() {
        //
    }

    disconnectedCallback() {
        //
    }

    render() {
        let wiClass = 'yquote';

        if (this.data.regularMarketChangePercent > 0) {
            wiClass += ' up'
        } else if (this.data.regularMarketChangePercent < 0) {
            wiClass += ' down';
        } else {
            wiClass += ' neutral'
        }

        return (
            <div>
                <div class={ wiClass }>
                    <div class="title">{ this.data.symbol }<span class="move">
                        <span class="change">{ this.data.regularMarketChange > 0 ? `+${Number(this.data.regularMarketChange).toFixed(2)}` : Number(this.data.regularMarketChange).toFixed(2) }</span>
                        <span class="changePerCent">{this.data.regularMarketChangePercent > 0 ? `+${Number(this.data.regularMarketChangePercent).toFixed(2)}` :  Number(this.data.regularMarketChangePercent).toFixed(2) }%</span>
                    </span></div>
                    <div class="subtitle">{ this.data.shortName }</div>
                    <div class="rate">{ this.data.regularMarketPrice }<span class="currency">{ this.data.currency }</span></div>
                    <div class="rates">
                        <div class="bid">
                            <span class="label">Bid:</span>
                            <span class="value">{ this.data.bid }</span>
                        </div>
                        <div class="ask">
                            <span class="label">Ask:</span>
                            <span class="value">{ this.data.ask }</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}
