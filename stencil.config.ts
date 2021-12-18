import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lavva-js-widgets',
    plugins: [
        sass()
    ],
    bundles: [
        { components: ['mt-marquee'] },
        { components: ['mt-quote'] },
        { components: ['mt-rates'] },
    ],
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements',
        },
        {
            type: 'dist-custom-elements-bundle',
        },
        {
            type: 'stats'
        },
        {
            type: 'docs-readme',
        },
        {
            type: 'www',
            serviceWorker: null, // disable service workers
            copy: [
                {
                    src: 'favicon.ico',
                    dest: 'favicon.ico'
                },
                {
                    src: 'demo.html',
                    dest: 'demo.html'
                },
                {
                    src: 'components/mt-rates/assets',
                    dest: 'build/assets'
                }
            ]
        },
    ],
};
