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
            precompress: false,
            strict: true
        }),
        prerender: {
            crawl: true,
            entries: ['*'],
            handleHttpError: 'warn'
        }
    },
    preprocess: [vitePreprocess(), mdsvex()],
    extensions: ['.svelte', '.svx']
};

export default config;
