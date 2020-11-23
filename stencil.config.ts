import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
    namespace: 'lavva-js-widgets',
    plugins: [
        sass()
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
                    src: '../node_modules/@anadyme/lavva-js-sdk/bundles/anadyme-lavva-js-sdk.umd.js',
                    dest: '../www/build/anadyme-lavva-js-sdk.umd.js'
                },
                {
                    src: '../node_modules/@anadyme/lavva-js-sdk/bundles/anadyme-lavva-js-sdk.umd.js.map',
                    dest: '../www/build/anadyme-lavva-js-sdk.umd.js.map'
                },
                {
                    src: '../node_modules/@anadyme/lavva-js-sdk/fesm2015/anadyme-lavva-js-sdk.js',
                    dest: '../www/build/anadyme-lavva-js-sdk.js'
                },
                {
                    src: '../node_modules/@anadyme/lavva-js-sdk/fesm2015/anadyme-lavva-js-sdk.js.map',
                    dest: '../www/build/anadyme-lavva-js-sdk.js.map'
                },
                {
                    src: '../node_modules/reconnecting-websocket/dist/reconnecting-websocket-iife.min.js',
                    dest: '../www/build/reconnecting-websocket.js'
                }
            ],
        },
    ],
};
