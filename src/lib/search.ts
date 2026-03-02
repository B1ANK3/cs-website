import { compile } from 'mdsvex';

export interface SearchResult {
    title: string;
    url: string;
    excerpt: string;
    type: 'course' | 'event' | 'news' | 'person' | 'research' | 'faq';
}

interface ContentMetadata {
    slug?: string;
    title?: string;
    name?: string;
    question?: string;
    link?: string;
    [key: string]: string | number | boolean | undefined;
}

// Import all content files using Vite's glob import
const courseModules = import.meta.glob('/src/lib/courses/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const eventModules = import.meta.glob('/src/lib/events/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const newsModules = import.meta.glob('/src/lib/news/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const peopleModules = import.meta.glob('/src/lib/people/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const researchModules = import.meta.glob('/src/lib/research/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const faqModules = import.meta.glob('/src/lib/faq/*.svx', {
    eager: true,
    query: '?raw',
    import: 'default'
});

interface IndexedContent {
    title: string;
    url: string;
    content: string;
    metadata: ContentMetadata;
    type: 'course' | 'event' | 'news' | 'person' | 'research' | 'faq';
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function parseFrontmatter(
    content: string
): Promise<{ metadata: ContentMetadata; body: string }> {
    // const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    // const match = content.match(frontmatterRegex);
    const match = await compile(content);

    if (!match) {
        return { metadata: {}, body: content };
    }

    const { data, code } = match;
    const metadata: ContentMetadata = (data?.fm as ContentMetadata) || {};

    return { metadata, body: code };
}

function getSlugFromPath(path: string): string {
    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    return filename.replace('.svx', '');
}

async function buildIndex(): Promise<IndexedContent[]> {
    const indexed: IndexedContent[] = [];

    // Helper function to process modules
    const processModules = async (
        modules: Record<string, unknown>,
        type: IndexedContent['type'],
        urlPrefix: string
    ) => {
        for (const [path, content] of Object.entries(modules)) {
            if (typeof content !== 'string') continue;

            const { metadata, body } = await parseFrontmatter(content);
            const slug = getSlugFromPath(path);
            const derivedFaqSlug = slugify(metadata.slug || metadata.question || slug) || slug;
            const url =
                type === 'faq'
                    ? metadata.link || `${urlPrefix}#${derivedFaqSlug}`
                    : metadata.link || `${urlPrefix}/${slug}`;
            const title = metadata.title || metadata.name || metadata.question || slug;

            indexed.push({
                title,
                url,
                content: body,
                metadata,
                type
            });
        }
    };

    // FIXME: This adds ALL the content from static files to search index.
    // Absolutely need to fix this. Its makes the site load slower because of the size.
    const promises = [
        processModules(courseModules, 'course', '/courses'),
        processModules(eventModules, 'event', '/events'),
        processModules(newsModules, 'news', '/news'),
        processModules(peopleModules, 'person', '/people'),
        processModules(researchModules, 'research', '/research'),
        processModules(faqModules, 'faq', '/faq')
    ];
    await Promise.allSettled(promises);

    return indexed;
}

// Build the search index once
const searchIndex = await buildIndex();

function stripMarkdown(text: string): string {
    return text
        .replace(/#{1,6}\s+/g, '') // Headers
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
        .replace(/\*([^*]+)\*/g, '$1') // Italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/`([^`]+)`/g, '$1') // Code
        .replace(/\n+/g, ' ') // Multiple newlines
        .trim();
}

function getExcerpt(content: string, query: string, contextLength: number = 100): string {
    const cleanContent = stripMarkdown(content);
    const lowerContent = cleanContent.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const index = lowerContent.indexOf(lowerQuery);
    if (index === -1) {
        return cleanContent.substring(0, contextLength) + '...';
    }

    // Get context around the match
    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(cleanContent.length, index + query.length + contextLength / 2);

    let excerpt = cleanContent.substring(start, end);

    if (start > 0) {
        excerpt = '...' + excerpt;
    }
    if (end < cleanContent.length) {
        excerpt = excerpt + '...';
    }

    return excerpt;
}

function highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

export function search(query: string, limit: number = 10): SearchResult[] {
    // Remove whitespace and check if we have at least 4 characters
    const trimmedQuery = query.replace(/\s/g, '');
    if (trimmedQuery.length < 4) {
        return [];
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const item of searchIndex) {
        const searchableText = (
            item.title +
            ' ' +
            stripMarkdown(item.content) +
            ' ' +
            Object.values(item.metadata).join(' ')
        ).toLowerCase();

        if (searchableText.includes(lowerQuery)) {
            const excerpt = getExcerpt(item.content, query);
            const highlightedExcerpt = highlightText(excerpt, query);

            results.push({
                title: item.title,
                url: item.url,
                excerpt: highlightedExcerpt,
                type: item.type
            });

            if (results.length >= limit) {
                break;
            }
        }
    }

    return results;
}
