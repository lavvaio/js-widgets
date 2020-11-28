import { LVLogger } from '@anadyme/lavva-js-sdk';

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function createLogger(label = 'lavva') {
    return new LVLogger(label);
}
