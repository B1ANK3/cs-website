<!-- TODO: Remove legacy mode -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { Article } from '$lib/articles';
    import { resolve } from '$app/paths';

    export let data;

    const article: Article = data.article;
    const allArticles: Article[] = data.allArticles;

    // Find related articles by the same author
    const relatedArticles = allArticles.filter(
        (a) => a.author === article.author && a.slug !== article.slug
    );

    interface Heading {
        id: string;
        text: string;
        level: number;
    }

    let headings: Heading[] = [];
    let activeHeading = '';
    let contentElement: HTMLElement;

    function getArticleLink(art: Article): string {
        const authorPath = art.author.toLowerCase().replace(/\s+/g, '-');
        return `/news/${authorPath}/${art.slug}`;
    }

    function generateId(text: string, index: number): string {
        return (
            text
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .substring(0, 50) + `-${index}`
        );
    }

    onMount(() => {
        if (!contentElement) return;

        // Find all headings specifically in the article content, not in related articles
        const contentDiv = contentElement.querySelector('.article-content');
        if (!contentDiv) return;

        const headingElements = contentDiv.querySelectorAll('h2, h3');
        const extractedHeadings: Heading[] = [];

        headingElements.forEach((element, index) => {
            if (!element.id) {
                element.id = generateId(element.textContent || '', index);
            }

            extractedHeadings.push({
                id: element.id,
                text: element.textContent || '',
                level: parseInt(element.tagName[1])
            });
        });

        headings = extractedHeadings;

        // Set up Intersection Observer for scroll spy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeHeading = (entry.target as HTMLElement).id;
                    }
                });
            },
            {
                rootMargin: '-20% 0% -70% 0%'
            }
        );

        headingElements.forEach((element) => {
            observer.observe(element);
        });

        return () => {
            observer.disconnect();
        };
    });

    function scrollToHeading(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
</script>

<div class="article-layout">
    <article class="article-detail" bind:this={contentElement}>
        <div class="article-header">
            <a href={resolve('/news')} class="back-link">← Back to News</a>
            <h1>{article.title}</h1>
            <div class="article-meta">
                <span class="author">{article.author}</span>
                <span class="date">
                    {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </span>
            </div>
        </div>

        <div class="article-content">
            <svelte:component this={article.component} />
        </div>

        {#if relatedArticles.length > 0}
            <aside class="related-articles">
                <h2>More from {article.author}</h2>
                <div class="related-list">
                    {#each relatedArticles as relArticle (relArticle.slug)}
                        <div class="related-item">
                            <h3>
                                <a href={getArticleLink(relArticle)}>
                                    {relArticle.title}
                                </a>
                            </h3>
                            <p class="related-summary">{relArticle.summary}</p>
                            <a href={getArticleLink(relArticle)} class="related-link">Read more →</a
                            >
                        </div>
                    {/each}
                </div>
            </aside>
        {/if}
    </article>

    {#if headings.length > 0}
        <nav class="table-of-contents">
            <div class="toc-header">Contents</div>
            <ul class="toc-list">
                {#each headings as heading (heading.id)}
                    <li class="toc-item level-{heading.level}">
                        <button
                            class="toc-link"
                            class:active={activeHeading === heading.id}
                            on:click={() => scrollToHeading(heading.id)}
                        >
                            {heading.text}
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}
</div>

<style lang="scss">
    .article-layout {
        display: grid;
        grid-template-columns: 1fr 250px;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr;
        }
    }

    .article-detail {
        min-width: 0;
    }

    .back-link {
        display: inline-block;
        margin-bottom: 1.5rem;
        color: #0066cc;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
            color: #0052a3;
        }
    }

    .article-header {
        margin-bottom: 3rem;
        border-bottom: 2px solid #eee;
        padding-bottom: 1.5rem;

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 1rem 0 1rem 0;
            line-height: 1.3;
        }
    }

    .article-meta {
        display: flex;
        gap: 1.5rem;
        font-size: 0.95rem;
        color: #666;

        .author {
            font-weight: 600;
            color: #333;
        }
    }

    .article-content :global(h2) {
        font-size: 1.8rem;
        font-weight: 700;
        margin: 2rem 0 1rem 0;
    }

    .article-content :global(h3) {
        font-size: 1.4rem;
        font-weight: 600;
        margin: 1.5rem 0 0.75rem 0;
    }

    .article-content :global(p) {
        margin-bottom: 1rem;
    }

    .article-content :global(ul),
    .article-content :global(ol) {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }

    .article-content :global(ul li),
    .article-content :global(ol li) {
        margin-bottom: 0.5rem;
    }

    .article-content :global(code) {
        background: #f5f5f5;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
    }

    .article-content :global(pre) {
        background: #f5f5f5;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin-bottom: 1rem;
    }

    .article-content {
        line-height: 1.8;
        font-size: 1rem;
        color: #333;
        margin-bottom: 3rem;
    }

    .related-articles {
        background: #f9f9f9;
        padding: 2rem;
        border-radius: 8px;
        margin-top: 3rem;

        h2 {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
        }
    }

    .related-list {
        display: grid;
        gap: 1.5rem;
    }

    .related-item {
        background: white;
        padding: 1rem;
        border-radius: 4px;
        border-left: 3px solid #0066cc;

        h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;

            a {
                color: #333;
                text-decoration: none;

                &:hover {
                    color: #0066cc;
                }
            }
        }

        .related-summary {
            color: #666;
            font-size: 0.9rem;
            margin: 0 0 0.75rem 0;
        }
    }

    .related-link {
        color: #0066cc;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;

        &:hover {
            color: #0052a3;
        }
    }

    .table-of-contents {
        background: #f9f9f9;
        border-radius: 8px;
        padding: 1.5rem;
        height: fit-content;
        position: sticky;
        top: 2rem;

        @media (max-width: 1024px) {
            display: none;
        }
    }

    .toc-header {
        font-size: 0.9rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #333;
        margin-bottom: 1rem;
        letter-spacing: 0.5px;
    }

    .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .toc-item {
        margin: 0;

        &.level-2 {
            margin-left: 0;
        }

        &.level-3 {
            margin-left: 1rem;
        }

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }
    }

    .toc-link {
        background: none;
        border: none;
        color: #666;
        text-align: left;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.85rem;
        transition: all 0.3s ease;
        width: 100%;
        word-break: break-word;

        &:hover {
            background: #eee;
            color: #0066cc;
        }

        &.active {
            color: #0066cc;
            font-weight: 600;
            background: #e6f2ff;
        }
    }
</style>
