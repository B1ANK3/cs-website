import { getAllArticles, getArticleBySlug } from '$lib/articles';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const articles = await getAllArticles();
    const article = getArticleBySlug(articles, params.article);

    if (!article) {
        throw error(404, 'Article not found');
    }

    // Verify the author matches the URL parameter
    const authorPath = params.author.toLowerCase().replace(/-/g, ' ');
    if (article.author.toLowerCase() !== authorPath.toLowerCase()) {
        throw error(404, 'Article not found');
    }

    return {
        article,
        allArticles: articles
    };
};

export const entries: EntryGenerator = async () => {
    const articles = await getAllArticles();
    return articles.map((article) => ({
        article: article.slug!,
        author: article.author.toLowerCase().replace(/ /g, '-')
    }));
};

export const prerender = true;
