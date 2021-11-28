export interface Quote {
    Ask: number;
    Bid: number;
    Changes: string;
    Digits: number;
    Direction: number;
    Last: number;
    Diff: number;
    PerDiff: number;
    Period: string;
    PrevClose: number;
    Spread: number;
    Symbol: string;
    Time: number;
    Volume: number;
}

export interface Historical {
    Close: number;
    Digits: number;
    High: number;
    Low: number;
    Open: number;
    Period: string;
    Time: number;
    Symbol: string;
    Volume: number;
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
