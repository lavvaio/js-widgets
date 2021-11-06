import { LVLogger } from '@anadyme/lavva-js-sdk';

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function createLogger(label = 'lavva', style?: string) {
    return new LVLogger(label, style);
}

export function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', (err) => reject(err));
        img.src = url;
    });
}

export function translate(key, fallback: string, translations: { [key: string]: { [key: string]: string } } = null, locale = 'en'): string {
    if (!translations) {
        return fallback;
    }

    if (!translations.hasOwnProperty(locale)) {
        return fallback;
    }

    if (!translations[locale].hasOwnProperty(key)) {
        return fallback;
    }

    return translations[locale][key];
}
