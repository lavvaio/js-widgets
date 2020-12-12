import { ClientMessageDataType, WebsocketConnection } from '@anadyme/lavva-js-sdk';
import { Component, h, Method, Prop, State } from '@stencil/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import store from 'store2';
import { createLogger, loadImage } from '../../shared/utils';
import { LavvaWidget } from '../../shared/model';
import { FinnhubNewsItem } from './finnhub';

@Component({
    tag: 'finnhub-news',
    styleUrl: './finnhub-news.scss',
    shadow: false,
})
export class FinnhubNewsComponent implements LavvaWidget {

    @Prop()
    connection!: WebsocketConnection;

    @Prop()
    dataChannel!: string;

    @Prop()
    dataKey: string = undefined;

    @Prop()
    namespace = 'finnhub-news';

    @Prop()
    useCache = true;

    @State()
    size = 1;

    @State()
    data: FinnhubNewsItem[] = [];

    @Method()
    async log(...args: any[]) {
        this.logger.log(...args);
    }

    private logger = createLogger('finnhub-news');

    private subscriptions = new Subscription();

    connectedCallback() {
        this.loadNews();

        if (!this.connection)  {
            throw new Error('connection was not found');
        }

        this.subscriptions.add(this.connection.channelStream(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.CLIENT_CONNECTED),
        ).subscribe(message => {
            this.logger.log('client connected', message.value.client_id);
            this.size = message.value.channel_size;
        }));

        this.subscriptions.add(this.connection.channelStream<FinnhubNewsItem>(this.dataChannel).pipe(
            filter(message => message.type === ClientMessageDataType.DATA),
            filter(message => this.dataKey === undefined ? true : message.key === this.dataKey),
        ).subscribe(message => {
            this.saveNews(message.value);
        }));
    }

    loadNews() {
        if (this.useCache) {
            const ns = store.namespace(this.namespace);
            this.data = ns.get(this.dataChannel, this.data);
        }
    }

    saveNews(news: FinnhubNewsItem) {
        if (this.data.find(item => item.id === news.id)) {
            return;
        }

        loadImage(news.image).then(_ => {
            this.data = [ news, ...this.data.slice(0, this.size - 1) ].sort((a, b) => b.datetime - a.datetime);
            if (this.useCache) {
                const ns = store.namespace(this.namespace);
                ns.set(this.dataChannel, this.data);
            }
        });
    }

    disconnectedCallback() {
        this.subscriptions.unsubscribe();
    }

    render() {
        return (
            <div>
                <div class="finnhub">
                    <ul class="news">
                        {this.data.map(news => {
                            return <li>
                                <div class="news-item">
                                    <div class="cover">
                                        <img src={ news.image } alt={ news.headline } title={ news.headline } />
                                    </div>
                                    <div class="body">
                                        <div class="title">{ news.headline }</div>
                                        <div class="date">{ new Date(news.datetime * 1000).toISOString() }</div>
                                        <div class="summary" innerHTML={ news.summary }></div>
                                        <div class="footer">
                                            <div class="source">
                                                <span class="label">Source: </span>{ news.source }
                                            </div>
                                            <a href={ news.url } class="learnmore" target="_blank">Learn more</a>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
                <div class="powered-by">Powered by Finnhub</div>
            </div>
        );
    }

}
