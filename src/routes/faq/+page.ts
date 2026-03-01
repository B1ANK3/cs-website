import { getAllFAQs } from '$lib/faq';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const faqs = await getAllFAQs();

    return {
        faqs
    };
};
