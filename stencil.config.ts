import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lavva-js-widgets',
    plugins: [
        sass()
    ],
    bundles: [
        { components: ['owm-daily'] },
        { components: ['yahoo-quotes'] },
    ],
    outputTargets: [
        {
            type: 'dist',
            esmLoaderPath: '../loader',
        },
        {
            type: 'dist-custom-elements-bundle',
        },
        {
            type: 'docs-readme',
        },
        {
            type: 'www',
            serviceWorker: null, // disable service workers
            copy: [
                {
                    src: '../node_modules/@anadyme/lavva-js-sdk/dist/lavva-js-sdk.umd.js',
                    dest: 'build/lavva-js-sdk.umd.js'
                },
                {
                    src: '../node_modules/@anadyme/lavva-js-sdk/dist/lavva-js-sdk.esm.js',
                    dest: 'build/lavva-js-sdk.esm.js'
                }
            ]
        },
    ],
};
