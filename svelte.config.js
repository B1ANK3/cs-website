import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter({
            fallback: '404.html',
            strict: true,
            precompress: true
        }),
        paths: {
            // base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
            // Sometimes you gotta test with base as not '' cause svelte is terrible with handling these.
            base: '/some_url'
        },
        prerender: {
            handleHttpError: ({ path }) => {
                // Ignore problems with using resolve because of base change in github pages.
                // When using dynamic links (like from most of UGC), some links redirect outside
                // the web application. Therefore svelte can't add the base to the link else it
                // breaks. We ignore any links that start with http as they probably not pointing
                // to inside the application. Any links that are relative should use `resolve`
                // to redirect correctly.
                if (path.startsWith('http')) {
                    // Ignore
                    return;
                }
                return;

                // Default
                // throw new Error(message);
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
