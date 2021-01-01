import { WebsocketConnection } from "@anadyme/lavva-js-sdk";

export interface LavvaWidget {
    /**
     * Prop
     */
    connection: WebsocketConnection;
    /**
     * Prop
     */
    dataChannel: string;
    /**
     * Prop (optional)
     */
    dataKey?: string | string[];
    /**
     * Prop (optional)
     */
    namespace?: string;
    /**
     * Prop
     */
    useCache: boolean;
    /**
     * Method
     */
    log(...args: any[]);
}
