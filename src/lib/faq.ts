import type { Component } from 'svelte';

export interface FAQMeta {
    question: string;
    order: number;
    category?: string;
    slug?: string;
}

export interface FAQ extends FAQMeta {
    component: Component;
}

// Dynamically import all .svx files from the faq directory
const faqModules = import.meta.glob('/src/lib/faq/*.svx', { eager: true });

export function deriveFAQSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function getAllFAQs(): Promise<FAQ[]> {
    const faqs: FAQ[] = [];
    const usedSlugs = new Set<string>();

    for (const [path, module] of Object.entries(faqModules)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = module as any;
        const meta = mod.metadata as FAQMeta;

        if (meta) {
            const filename = path.split('/').pop()?.replace('.svx', '') || '';
            const baseSlug = deriveFAQSlug(meta.slug || meta.question || filename) || filename;
            let uniqueSlug = baseSlug;
            let counter = 2;

            while (usedSlugs.has(uniqueSlug)) {
                uniqueSlug = `${baseSlug}-${counter}`;
                counter += 1;
            }

            usedSlugs.add(uniqueSlug);

            faqs.push({
                ...meta,
                slug: uniqueSlug,
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
