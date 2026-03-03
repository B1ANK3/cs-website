<script lang="ts">
    import { filterArticles, sortArticles } from '$lib/articles';
    import type { Article } from '$lib/articles';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const heroBackgroundImage: string | null = null;

    let articles: Article[] = $derived(data.articles);
    let searchQuery = $state('');
    let sortBy: 'date' | 'title' | 'author' = $state('date');
    let sortOrder: 'asc' | 'desc' = $state('desc');

    let filteredArticles: Article[] = $derived.by(() => {
        let result = filterArticles(articles, searchQuery);
        result = sortArticles(result, sortBy, sortOrder);
        return result;
    });

    function getAuthorPath(author: string): string {
        return author.toLowerCase().replace(/\s+/g, '-');
    }

    function getArticleLink(article: Article): string {
        return `/news/${getAuthorPath(article.author)}/${article.slug}`;
    }

    function resetFilters() {
        searchQuery = '';
        sortBy = 'date';
        sortOrder = 'desc';
    }
</script>

<svelte:head>
    <title>News | CS Department</title>
    <meta
        name="description"
        content="Latest stories, updates, and highlights from the Computer Science division."
    />
</svelte:head>

<main class="news-page page-shell">
    <section
        class="news-hero hero-section"
        class:has-image={Boolean(heroBackgroundImage)}
        style={heroBackgroundImage ? `--hero-image: url('${heroBackgroundImage}')` : undefined}
    >
        <div class="container">
            <h1>News</h1>
            <p class="subtitle">
                Latest stories, updates, and highlights from the Computer Science division
            </p>
        </div>
    </section>

    <section class="news-content content-section">
        <div class="container">
            <div class="news-layout page-layout">
                <aside class="filters-sidebar">
                    <div class="filters-header">
                        <h2>Filters</h2>
                        <button class="reset-btn" onclick={resetFilters}>Reset</button>
                    </div>

                    <div class="filter-section">
                        <label for="news-search">Search</label>
                        <input
                            id="news-search"
                            type="text"
                            placeholder="Search articles..."
                            bind:value={searchQuery}
                            class="search-input"
                        />
                    </div>

                    <div class="filter-section">
                        <label for="news-sort">Sort By</label>
                        <select id="news-sort" bind:value={sortBy} class="sort-select">
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
                                onchange={(e) =>
                                    (sortOrder = e.currentTarget.checked ? 'asc' : 'desc')}
                            />
                            Ascending Order
                        </label>
                    </div>

                    <div class="results-count">
                        <p>
                            {filteredArticles.length} article{filteredArticles.length !== 1
                                ? 's'
                                : ''} found
                        </p>
                    </div>
                </aside>

                <div class="articles-main">
                    {#if filteredArticles.length === 0}
                        <div class="no-articles no-results">
                            <p>No articles found matching your search.</p>
                            <button class="reset-btn" onclick={resetFilters}>Reset Filters</button>
                        </div>
                    {:else}
                        <div class="articles-grid">
                            {#each filteredArticles as article (article.slug)}
                                <a href={getArticleLink(article)} class="article-card">
                                    <h3 class="article-title">
                                        {article.title}
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
                                    <span class="read-more">Read More →</span>
                                </a>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </section>
</main>

<style lang="scss">
    @use '$lib/styles/globals.scss' as *;

    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .page-shell {
        min-height: 100vh;
        background: #f8f9fa;
    }

    .hero-section {
        background: linear-gradient(135deg, $primary-color 0%, #8b2f4a 100%);
        color: white;
        padding: 4rem 0 3rem;
        position: relative;
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: var(--hero-image);
            background-size: cover;
            background-position: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
                135deg,
                rgba(97, 34, 59, 0.9) 0%,
                rgba(139, 47, 74, 0.9) 100%
            );
            pointer-events: none;
        }

        &.has-image::before {
            opacity: 1;
        }

        .container {
            position: relative;
            z-index: 1;
        }

        h1 {
            font-size: 3rem;
            margin: 0 0 1rem 0;
            font-weight: 700;
        }

        .subtitle {
            margin: 0;
            font-size: 1.125rem;
            line-height: 1.6;
            opacity: 0.95;
            max-width: 800px;
        }
    }

    .content-section {
        padding: 3rem 0;
    }

    .page-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        align-items: start;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    }

    .filters-sidebar {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 2rem;

        .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;

            h2 {
                font-size: 1.5rem;
                color: #333;
                margin: 0;
            }
        }

        .filter-section {
            margin-bottom: 1.5rem;

            label {
                display: block;
                font-size: 0.95rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #333;
            }
        }
    }

    .search-input,
    .sort-select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid $border-color;
        border-radius: 8px;
        font-size: 0.9rem;
        background: #fff;

        &:focus {
            outline: none;
            border-color: $primary-color;
            box-shadow: 0 0 0 3px rgba(97, 34, 59, 0.15);
        }
    }

    .reset-btn {
        background: none;
        border: 1px solid $accent-color;
        color: $accent-color;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;

        &:hover {
            background: $accent-color;
            color: white;
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
            accent-color: $primary-color;
        }
    }

    .results-count {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e0e0e0;
        font-size: 0.9rem;
        color: #666;
        text-align: center;

        p {
            margin: 0;
        }
    }

    .articles-main {
        min-height: 400px;
    }

    .no-results {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px $shadow-color;
        text-align: center;

        p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }
    }

    .articles-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .article-card {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 1.75rem;
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        text-decoration: none;
        color: inherit;

        &:hover {
            border: 1px solid $accent-color;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }
    }

    .article-title {
        font-size: 1.3rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        line-height: 1.4;
        color: #333;
    }

    .article-summary {
        color: #666;
        font-size: 0.95rem;
        line-height: 1.6;
        margin: 0 0 1.25rem 0;
        flex-grow: 1;
    }

    .article-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        padding: 0.85rem 0;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        font-size: 0.85rem;
        color: #999;
    }

    .article-date {
        font-weight: 500;
    }

    .read-more {
        color: $accent-color;
        font-weight: 500;
        margin-top: 0.75rem;
        display: inline-block;
    }

    @media (max-width: 1024px) {
        .filters-sidebar {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            h1 {
                font-size: 2rem;
            }

            .subtitle {
                font-size: 1rem;
            }
        }

        .container {
            padding: 0 1rem;
        }

        .filters-sidebar {
            padding: 1.5rem;
        }
    }
</style>
