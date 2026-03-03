import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            strict: true,
            precompress: true
        }),
        paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
            // Sometimes you gotta test with base as not '' cause svelte is terrible with handling these.
            // base: '/some_url'
        },
        prerender: {
            handleHttpError: ({ path, message, referrer }) => {
                console.warn(path + ' is not resolved correctly: In file: ' + referrer);

                // Default
                throw new Error(message);
            }
        },
        // Added to enforce '@html'
        csp: {
            directives: {
                'script-src': ['self']
            },
            reportOnly: {
                'script-src': ['self'],
                'report-uri': ['/']
            }
        }
    },
    preprocess: [vitePreprocess(), mdsvex()],
    extensions: ['.svelte', '.svx']
};

export default config;
