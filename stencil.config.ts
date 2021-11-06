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
                //
            ]
        },
    ],
};
