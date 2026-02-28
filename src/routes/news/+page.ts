import { getAllArticles } from '$lib/articles';

export async function load() {
    const articles = await getAllArticles();
    return {
        articles
    };
}
