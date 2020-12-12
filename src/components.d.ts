/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { WebsocketConnection } from "@anadyme/lavva-js-sdk";
export namespace Components {
    interface FinnhubNews {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey": string;
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
    interface OwmDaily {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey": string;
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
    interface TwitTer {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey": string;
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
    interface YahooQuote {
        "data": any;
        "symbol": string;
    }
    interface YahooQuotes {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey": string;
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
    interface HTMLTwitTerElement extends Components.TwitTer, HTMLStencilElement {
    }
    var HTMLTwitTerElement: {
        prototype: HTMLTwitTerElement;
        new (): HTMLTwitTerElement;
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
        "owm-daily": HTMLOwmDailyElement;
        "owm-daily-item": HTMLOwmDailyItemElement;
        "twit-ter": HTMLTwitTerElement;
        "yahoo-quote": HTMLYahooQuoteElement;
        "yahoo-quotes": HTMLYahooQuotesElement;
    }
}
declare namespace LocalJSX {
    interface FinnhubNews {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface OwmDaily {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
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
    interface TwitTer {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
        /**
          * Prop (optional)
         */
        "namespace"?: string;
        /**
          * Prop
         */
        "useCache"?: boolean;
    }
    interface YahooQuote {
        "data"?: any;
        "symbol"?: string;
    }
    interface YahooQuotes {
        /**
          * Prop
         */
        "connection": WebsocketConnection;
        /**
          * Prop
         */
        "dataChannel": string;
        /**
          * Prop (optional)
         */
        "dataKey"?: string;
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
        "owm-daily": OwmDaily;
        "owm-daily-item": OwmDailyItem;
        "twit-ter": TwitTer;
        "yahoo-quote": YahooQuote;
        "yahoo-quotes": YahooQuotes;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "finnhub-news": LocalJSX.FinnhubNews & JSXBase.HTMLAttributes<HTMLFinnhubNewsElement>;
            "owm-daily": LocalJSX.OwmDaily & JSXBase.HTMLAttributes<HTMLOwmDailyElement>;
            "owm-daily-item": LocalJSX.OwmDailyItem & JSXBase.HTMLAttributes<HTMLOwmDailyItemElement>;
            "twit-ter": LocalJSX.TwitTer & JSXBase.HTMLAttributes<HTMLTwitTerElement>;
            "yahoo-quote": LocalJSX.YahooQuote & JSXBase.HTMLAttributes<HTMLYahooQuoteElement>;
            "yahoo-quotes": LocalJSX.YahooQuotes & JSXBase.HTMLAttributes<HTMLYahooQuotesElement>;
        }
    }
}
