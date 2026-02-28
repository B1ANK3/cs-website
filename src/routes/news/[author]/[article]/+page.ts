import { getAllArticles, getArticleBySlug, getArticlesByAuthor } from '$lib/articles';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
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
}
