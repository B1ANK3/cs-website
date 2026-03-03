import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            strict: true,
            precompress: true
        }),
        paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
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
