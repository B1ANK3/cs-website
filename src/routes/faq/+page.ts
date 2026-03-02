import { getAllFAQs } from '$lib/faq';
import type { PageLoad } from './$types';

// We can't prerender this page as it uses '#' link to search for content
// on the page. This prevents prerendering as svelte doesn't know how to
// handle this and fails when compiling for SSG.
// Thus we just have to eat the performance cost of client-side rendering.
// FIXME: Enable some sort of hash routing to prerender routes.
export const prerender = false;

// This runs only in SSR mode, therefore ssg fails to load this
export const load: PageLoad = async () => {
    const faqs = await getAllFAQs();

    return {
        faqs
    };
};
