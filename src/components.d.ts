/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { WebsocketConnection, WebsocketConnectionEncoding, WebsocketConnectionFormat } from "@anadyme/lavva-js-sdk";
import { Category, TradeSymbol } from "./shared/mt-quote";
export namespace Components {
    interface FinnhubNews {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey": string;
        "debug": boolean;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        /**
          * Prop (optional)
         */
        "namespace": string;
        /**
          * Prop
         */
        "useCache": boolean;
    }
    interface FxcmRates {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey": string[];
        "debug": boolean;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        /**
          * Prop (optional)
         */
        "namespace": string;
        "symbolNames": any[];
        /**
          * Prop
         */
        "useCache": boolean;
    }
    interface LvTwitter {
        "apiKey": string;
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        "debug": boolean;
        "encoding": WebsocketConnectionEncoding;
        "format": WebsocketConnectionFormat;
        "host": string;
        "locale": string;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        /**
          * Prop (optional)
         */
        "namespace": string;
        "size": any;
        "throttle": number;
        "translations": {
        [key: string]: {
            [key: string]: string;
        }
    };
        /**
          * Prop
         */
        "useCache": boolean;
    }
    interface MtMarquee {
        "animation": boolean;
        "apiKey": string;
        "center": boolean;
        "channel": string;
        "connection": WebsocketConnection;
        "debug": boolean;
        "encoding": WebsocketConnectionEncoding;
        "format": WebsocketConnectionFormat;
        "host": string;
        "locale": string;
        "log": (...args: any[]) => Promise<void>;
        "namespace": string;
        "size": 'default' | 'large';
        "snapshot": boolean;
        "symbols": TradeSymbol[];
        "translations": {
        [key: string]: {
            [key: string]: string;
        }
    };
        "useCache": boolean;
    }
    interface MtQuote {
        "apiKey": string;
        "channel": string;
        "connection": WebsocketConnection;
        "debug": boolean;
        "encoding": WebsocketConnectionEncoding;
        "format": WebsocketConnectionFormat;
        "host": string;
        "label": string;
        "locale": string;
        "log": (...args: any[]) => Promise<void>;
        "namespace": string;
        "showChart": boolean;
        "size": number;
        "snapshot": boolean;
        "symbol": string;
        "translations": {
        [key: string]: {
            [key: string]: string;
        }
    };
        "useCache": boolean;
    }
    interface MtRates {
        "apiKey": string;
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        "debug": boolean;
        "encoding": WebsocketConnectionEncoding;
        "format": WebsocketConnectionFormat;
        "groups": Category[];
        "host": string;
        "locale": string;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        "names": boolean;
        /**
          * Prop (optional)
         */
        "namespace": string;
        "size": 'default' | 'large';
        "snapshot": boolean;
        "tab": string;
        "tabs": boolean;
        "translations": {
        [key: string]: {
            [key: string]: string;
        }
    };
        /**
          * Prop
         */
        "useCache": boolean;
    }
    interface OwmDaily {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey": string;
        "debug": boolean;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        /**
          * Prop (optional)
         */
        "namespace": string;
        /**
          * Prop
         */
        "useCache": boolean;
    }
    interface OwmDailyItem {
        "day": any;
        "seq": number;
        "weekDays": string[];
    }
    interface YahooQuote {
        "data": any;
        "symbol": string;
    }
    interface YahooQuotes {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey": string;
        "debug": boolean;
        /**
          * Method
         */
        "log": (...args: any[]) => Promise<void>;
        /**
          * Prop (optional)
         */
        "namespace": string;
        /**
          * Prop
         */
        "useCache": boolean;
    }
}
declare global {
    interface HTMLFinnhubNewsElement extends Components.FinnhubNews, HTMLStencilElement {
    }
    var HTMLFinnhubNewsElement: {
        prototype: HTMLFinnhubNewsElement;
        new (): HTMLFinnhubNewsElement;
    };
    interface HTMLFxcmRatesElement extends Components.FxcmRates, HTMLStencilElement {
    }
    var HTMLFxcmRatesElement: {
        prototype: HTMLFxcmRatesElement;
        new (): HTMLFxcmRatesElement;
    };
    interface HTMLLvTwitterElement extends Components.LvTwitter, HTMLStencilElement {
    }
    var HTMLLvTwitterElement: {
        prototype: HTMLLvTwitterElement;
        new (): HTMLLvTwitterElement;
    };
    interface HTMLMtMarqueeElement extends Components.MtMarquee, HTMLStencilElement {
    }
    var HTMLMtMarqueeElement: {
        prototype: HTMLMtMarqueeElement;
        new (): HTMLMtMarqueeElement;
    };
    interface HTMLMtQuoteElement extends Components.MtQuote, HTMLStencilElement {
    }
    var HTMLMtQuoteElement: {
        prototype: HTMLMtQuoteElement;
        new (): HTMLMtQuoteElement;
    };
    interface HTMLMtRatesElement extends Components.MtRates, HTMLStencilElement {
    }
    var HTMLMtRatesElement: {
        prototype: HTMLMtRatesElement;
        new (): HTMLMtRatesElement;
    };
    interface HTMLOwmDailyElement extends Components.OwmDaily, HTMLStencilElement {
    }
    var HTMLOwmDailyElement: {
        prototype: HTMLOwmDailyElement;
        new (): HTMLOwmDailyElement;
    };
    interface HTMLOwmDailyItemElement extends Components.OwmDailyItem, HTMLStencilElement {
    }
    var HTMLOwmDailyItemElement: {
        prototype: HTMLOwmDailyItemElement;
        new (): HTMLOwmDailyItemElement;
    };
    interface HTMLYahooQuoteElement extends Components.YahooQuote, HTMLStencilElement {
    }
    var HTMLYahooQuoteElement: {
        prototype: HTMLYahooQuoteElement;
        new (): HTMLYahooQuoteElement;
    };
    interface HTMLYahooQuotesElement extends Components.YahooQuotes, HTMLStencilElement {
    }
    var HTMLYahooQuotesElement: {
        prototype: HTMLYahooQuotesElement;
        new (): HTMLYahooQuotesElement;
    };
    interface HTMLElementTagNameMap {
        "finnhub-news": HTMLFinnhubNewsElement;
        "fxcm-rates": HTMLFxcmRatesElement;
        "lv-twitter": HTMLLvTwitterElement;
        "mt-marquee": HTMLMtMarqueeElement;
        "mt-quote": HTMLMtQuoteElement;
        "mt-rates": HTMLMtRatesElement;
        "owm-daily": HTMLOwmDailyElement;
        "owm-daily-item": HTMLOwmDailyItemElement;
        "yahoo-quote": HTMLYahooQuoteElement;
        "yahoo-quotes": HTMLYahooQuotesElement;
    }
}
declare namespace LocalJSX {
    interface FinnhubNews {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
        "debug"?: boolean;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface FxcmRates {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey"?: string[];
        "debug"?: boolean;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        "symbolNames"?: any[];
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface LvTwitter {
        "apiKey"?: string;
        /**
          * Prop
         */
        "channel"?: string;
        "connection"?: WebsocketConnection;
        "debug"?: boolean;
        "encoding"?: WebsocketConnectionEncoding;
        "format"?: WebsocketConnectionFormat;
        "host"?: string;
        "locale"?: string;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        "size"?: any;
        "throttle"?: number;
        "translations"?: {
        [key: string]: {
            [key: string]: string;
        }
    };
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface MtMarquee {
        "animation"?: boolean;
        "apiKey"?: string;
        "center"?: boolean;
        "channel"?: string;
        "connection"?: WebsocketConnection;
        "debug"?: boolean;
        "encoding"?: WebsocketConnectionEncoding;
        "format"?: WebsocketConnectionFormat;
        "host"?: string;
        "locale"?: string;
        "namespace"?: string;
        "onSymbolClick"?: (event: CustomEvent<TradeSymbol>) => void;
        "size"?: 'default' | 'large';
        "snapshot"?: boolean;
        "symbols"?: TradeSymbol[];
        "translations"?: {
        [key: string]: {
            [key: string]: string;
        }
    };
        "useCache"?: boolean;
    }
    interface MtQuote {
        "apiKey"?: string;
        "channel"?: string;
        "connection"?: WebsocketConnection;
        "debug"?: boolean;
        "encoding"?: WebsocketConnectionEncoding;
        "format"?: WebsocketConnectionFormat;
        "host"?: string;
        "label"?: string;
        "locale"?: string;
        "namespace"?: string;
        "showChart"?: boolean;
        "size"?: number;
        "snapshot"?: boolean;
        "symbol"?: string;
        "translations"?: {
        [key: string]: {
            [key: string]: string;
        }
    };
        "useCache"?: boolean;
    }
    interface MtRates {
        "apiKey"?: string;
        /**
          * Prop
         */
        "channel"?: string;
        "connection"?: WebsocketConnection;
        "debug"?: boolean;
        "encoding"?: WebsocketConnectionEncoding;
        "format"?: WebsocketConnectionFormat;
        "groups"?: Category[];
        "host"?: string;
        "locale"?: string;
        "names"?: boolean;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        "onTradeClick"?: (event: CustomEvent<TradeSymbol>) => void;
        "size"?: 'default' | 'large';
        "snapshot"?: boolean;
        "tab"?: string;
        "tabs"?: boolean;
        "translations"?: {
        [key: string]: {
            [key: string]: string;
        }
    };
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface OwmDaily {
        /**
          * Prop
         */
        "channel": string;
        "connection"?: WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
        "debug"?: boolean;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface OwmDailyItem {
        "day"?: any;
        "seq"?: number;
        "weekDays"?: string[];
    }
    interface YahooQuote {
        "data"?: any;
        "symbol"?: string;
    }
    interface YahooQuotes {
        /**
          * Prop
         */
        "channel": string;
        "connection": WebsocketConnection;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
        "debug"?: boolean;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface IntrinsicElements {
        "finnhub-news": FinnhubNews;
        "fxcm-rates": FxcmRates;
        "lv-twitter": LvTwitter;
        "mt-marquee": MtMarquee;
        "mt-quote": MtQuote;
        "mt-rates": MtRates;
        "owm-daily": OwmDaily;
        "owm-daily-item": OwmDailyItem;
        "yahoo-quote": YahooQuote;
        "yahoo-quotes": YahooQuotes;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "finnhub-news": LocalJSX.FinnhubNews & JSXBase.HTMLAttributes<HTMLFinnhubNewsElement>;
            "fxcm-rates": LocalJSX.FxcmRates & JSXBase.HTMLAttributes<HTMLFxcmRatesElement>;
            "lv-twitter": LocalJSX.LvTwitter & JSXBase.HTMLAttributes<HTMLLvTwitterElement>;
            "mt-marquee": LocalJSX.MtMarquee & JSXBase.HTMLAttributes<HTMLMtMarqueeElement>;
            "mt-quote": LocalJSX.MtQuote & JSXBase.HTMLAttributes<HTMLMtQuoteElement>;
            "mt-rates": LocalJSX.MtRates & JSXBase.HTMLAttributes<HTMLMtRatesElement>;
            "owm-daily": LocalJSX.OwmDaily & JSXBase.HTMLAttributes<HTMLOwmDailyElement>;
            "owm-daily-item": LocalJSX.OwmDailyItem & JSXBase.HTMLAttributes<HTMLOwmDailyItemElement>;
            "yahoo-quote": LocalJSX.YahooQuote & JSXBase.HTMLAttributes<HTMLYahooQuoteElement>;
            "yahoo-quotes": LocalJSX.YahooQuotes & JSXBase.HTMLAttributes<HTMLYahooQuotesElement>;
        }
    }
}
