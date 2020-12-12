import { LVLogger } from '@anadyme/lavva-js-sdk';

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function createLogger(label = 'lavva') {
    return new LVLogger(label);
}

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = url;
    });
}
