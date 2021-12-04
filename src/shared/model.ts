export interface LavvaWidget {
    /**
     * Prop
     */
    channel: string;
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
