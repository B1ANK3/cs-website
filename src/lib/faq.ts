import type { SvelteComponent } from 'svelte';

export interface FAQMeta {
    question: string;
    order: number;
    category?: string;
    slug?: string;
}

export interface FAQ extends FAQMeta {
    component: SvelteComponent;
}

// Dynamically import all .svx files from the faq directory
const faqModules = import.meta.glob('/src/lib/faq/*.svx', { eager: true });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function getAllFAQs(): Promise<FAQ[]> {
    const faqs: FAQ[] = [];

    for (const [path, module] of Object.entries(faqModules)) {
        const mod = module as any;
        const meta = mod.metadata as FAQMeta;

        if (meta) {
            const filename = path.split('/').pop()?.replace('.svx', '') || '';
            faqs.push({
                ...meta,
                slug: meta.slug || slugify(meta.question),
                component: mod.default
            });
        }
    }

    // Sort by order
    return faqs.sort((a, b) => a.order - b.order);
}

export function getFAQsByCategory(faqs: FAQ[]): Map<string, FAQ[]> {
    const categoryMap = new Map<string, FAQ[]>();

    for (const faq of faqs) {
        const category = faq.category || 'General';
        if (!categoryMap.has(category)) {
            categoryMap.set(category, []);
        }
        categoryMap.get(category)!.push(faq);
    }

    return categoryMap;
}

export function searchFAQs(faqs: FAQ[], query: string): FAQ[] {
    const lowerQuery = query.toLowerCase();
    return faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(lowerQuery) ||
            faq.category?.toLowerCase().includes(lowerQuery)
    );
}
