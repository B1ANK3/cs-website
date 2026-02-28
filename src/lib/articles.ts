export interface ArticleMeta {
    title: string;
    summary: string;
    date: string;
    author: string;
    slug?: string;
}

export interface Article extends ArticleMeta {
    component: any;
}

// Dynamically import all .svx files from the news directory
const articleModules = import.meta.glob('/src/lib/news/*.svx', { eager: true });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function getAllArticles(): Promise<Article[]> {
    const articles: Article[] = [];

    for (const [path, module] of Object.entries(articleModules)) {
        const mod = module as any;
        const meta = mod.metadata as ArticleMeta;

        if (meta) {
            const filename = path.split('/').pop()?.replace('.svx', '') || '';
            articles.push({
                ...meta,
                slug: slugify(meta.title),
                component: mod.default
            });
        }
    }

    return articles;
}

export function sortArticles(
    articles: Article[],
    sortBy: 'date' | 'title' | 'author' = 'date',
    order: 'asc' | 'desc' = 'desc'
): Article[] {
    const sorted = [...articles].sort((a, b) => {
        let aVal: string | Date;
        let bVal: string | Date;

        if (sortBy === 'date') {
            aVal = new Date(a.date);
            bVal = new Date(b.date);
        } else if (sortBy === 'title') {
            aVal = a.title;
            bVal = b.title;
        } else {
            aVal = a.author;
            bVal = b.author;
        }

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
}

export function filterArticles(articles: Article[], searchQuery: string): Article[] {
    if (!searchQuery.trim()) return articles;

    const query = searchQuery.toLowerCase();
    return articles.filter(
        (article) =>
            article.title.toLowerCase().includes(query) ||
            article.summary.toLowerCase().includes(query) ||
            article.author.toLowerCase().includes(query)
    );
}

export function getArticleBySlug(articles: Article[], slug: string): Article | undefined {
    return articles.find((article) => article.slug === slug);
}

export function getArticlesByAuthor(articles: Article[], author: string): Article[] {
    return articles.filter((article) => article.author.toLowerCase() === author.toLowerCase());
}
