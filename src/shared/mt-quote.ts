export interface Quote {
    Symbol: string;
    Ask: number;
    Bid: number;
    Change: number;
    Spread: number;
    Timestamp: number;
    Digits: number;
}

export interface TradeSymbol {
    key: string;
    label: string;
    src?: string;
}

export interface Category {
    name: string;
    label: string;
    active?: boolean;
    symbols: Array<TradeSymbol>;
}

export const isElementInViewport = (el: HTMLElement) => {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}
