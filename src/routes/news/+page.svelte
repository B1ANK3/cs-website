<script lang="ts">
    import { filterArticles, sortArticles } from '$lib/articles';
    import type { Article } from '$lib/articles';
    import { onMount } from 'svelte';

    export let data;

    let articles: Article[] = data.articles;
    let filteredArticles: Article[] = articles;
    let searchQuery = '';
    let sortBy: 'date' | 'title' | 'author' = 'date';
    let sortOrder: 'asc' | 'desc' = 'desc';

    function updateArticles() {
        let result = filterArticles(articles, searchQuery);
        result = sortArticles(result, sortBy, sortOrder);
        filteredArticles = result;
    }

    function handleSearch(e: Event) {
        searchQuery = (e.target as HTMLInputElement).value;
        updateArticles();
    }

    function handleSort(e: Event) {
        sortBy = (e.target as HTMLSelectElement).value as 'date' | 'title' | 'author';
        updateArticles();
    }

    function handleSortOrder(e: Event) {
        sortOrder = (e.target as HTMLInputElement).checked ? 'asc' : 'desc';
        updateArticles();
    }

    function getAuthorPath(author: string): string {
        return author.toLowerCase().replace(/\s+/g, '-');
    }

    function getArticleLink(article: Article): string {
        return `/news/${getAuthorPath(article.author)}/${article.slug}`;
    }

    onMount(() => {
        updateArticles();
    });
</script>

<div class="news-container">
    <h1>News</h1>

    <div class="news-layout">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar">
            <div class="filter-section">
                <h2>Search</h2>
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    on:input={handleSearch}
                    class="search-input"
                />
            </div>

            <div class="filter-section">
                <h2>Sort By</h2>
                <select value={sortBy} on:change={handleSort} class="sort-select">
                    <option value="date">Date</option>
                    <option value="title">Title</option>
                    <option value="author">Author</option>
                </select>
            </div>

            <div class="filter-section">
                <label class="sort-order-label">
                    <input
                        type="checkbox"
                        checked={sortOrder === 'asc'}
                        on:change={handleSortOrder}
                    />
                    Ascending Order
                </label>
            </div>

            <div class="filter-info">
                <p>
                    {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </p>
            </div>
        </aside>

        <!-- Articles List -->
        <main class="articles-main">
            {#if filteredArticles.length === 0}
                <div class="no-articles">
                    <p>No articles found matching your search.</p>
                </div>
            {:else}
                <div class="articles-grid">
                    {#each filteredArticles as article (article.slug)}
                        <article class="article-card">
                            <h3 class="article-title">
                                <a href={getArticleLink(article)}>
                                    {article.title}
                                </a>
                            </h3>
                            <p class="article-summary">{article.summary}</p>
                            <div class="article-meta">
                                <span class="article-date">
                                    {new Date(article.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span class="article-author">{article.author}</span>
                            </div>
                            <a href={getArticleLink(article)} class="read-more">Read More →</a>
                        </article>
                    {/each}
                </div>
            {/if}
        </main>
    </div>
</div>

<style lang="scss">
    .news-container {
        padding: 2rem;
        max-width: 1400px;
        margin: 0 auto;

        h1 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            font-weight: 700;
        }
    }

    .news-layout {
        display: grid;
        grid-template-columns: 250px 1fr;
        gap: 2rem;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .filters-sidebar {
        background: #f5f5f5;
        padding: 1.5rem;
        border-radius: 8px;
        height: fit-content;
        position: sticky;
        top: 1rem;

        .filter-section {
            margin-bottom: 1.5rem;

            h2 {
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
                color: #333;
            }
        }
    }

    .search-input,
    .sort-select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.9rem;

        &:focus {
            outline: none;
            border-color: #0066cc;
            box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
        }
    }

    .sort-order-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.9rem;

        input {
            cursor: pointer;
        }
    }

    .filter-info {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #ddd;
        font-size: 0.85rem;
        color: #666;
    }

    .articles-main {
        min-height: 400px;
    }

    .no-articles {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
        font-size: 1.1rem;
    }

    .articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .article-card {
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;

        &:hover {
            border-color: #0066cc;
            box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
        }
    }

    .article-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        line-height: 1.4;

        a {
            color: #333;
            text-decoration: none;

            &:hover {
                color: #0066cc;
            }
        }
    }

    .article-summary {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0 0 1rem 0;
        flex-grow: 1;
    }

    .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 1rem 0;
        padding: 0.75rem 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        font-size: 0.85rem;
        color: #999;
    }

    .article-date {
        font-weight: 500;
    }

    .read-more {
        color: #0066cc;
        text-decoration: none;
        font-weight: 500;
        margin-top: 0.5rem;
        transition: color 0.3s ease;

        &:hover {
            color: #0052a3;
        }
    }
</style>
