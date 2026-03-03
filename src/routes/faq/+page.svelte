<!-- TODO: Remove legacy mode -->
<script lang="ts">
    import type { PageData } from './$types';
    import { onMount, tick } from 'svelte';
    import { resolve } from '$app/paths';

    interface PageProps {
        data: PageData;
    }

    const { data }: PageProps = $props();

    let activeSection = $state('');

    async function scrollToHashSection(behavior: ScrollBehavior = 'auto') {
        const hashSlug = decodeURIComponent(window.location.hash.replace('#', '').trim());
        if (!hashSlug) {
            return;
        }

        await tick();

        const element = document.getElementById(hashSlug);
        if (element) {
            activeSection = hashSlug;
            element.scrollIntoView({ behavior, block: 'start' });
        }
    }

    onMount(() => {
        // Set initial active section
        if (data.faqs.length > 0) {
            activeSection = data.faqs[0].slug || '';
        }

        // Intersection Observer for scrollspy
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activeSection = entry.target.id;
                    }
                });
            },
            {
                rootMargin: '-100px 0px -66%',
                threshold: 0
            }
        );

        // Observe all FAQ sections
        data.faqs.forEach((faq) => {
            const element = document.getElementById(faq.slug || '');
            if (element) {
                observer.observe(element);
            }
        });

        const handleHashChange = () => {
            void scrollToHashSection('smooth');
        };

        window.addEventListener('hashchange', handleHashChange);
        void scrollToHashSection('auto');

        return () => {
            observer.disconnect();
            window.removeEventListener('hashchange', handleHashChange);
        };
    });

    function scrollToSection(slug: string) {
        console.log('Scrolling to section...');
        const element = document.getElementById(slug);
        if (element) {
            window.history.replaceState(null, '', `#${slug}`);
            activeSection = slug;
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
</script>

<svelte:head>
    <title>Frequently Asked Questions - CS Department</title>
    <meta
        name="description"
        content="Find answers to common questions about the Computer Science department, programs, and student life."
    />
</svelte:head>

<div class="faq-page">
    <div class="faq-container">
        <!-- Table of Contents -->
        <aside class="toc">
            <div class="toc-sticky">
                <h2>Questions</h2>
                <nav>
                    <ul class="toc-list">
                        {#each data.faqs as faq, index (faq.slug)}
                            <li class="toc-item" class:active={activeSection === faq.slug}>
                                <!-- Why doesn't this button work in ssg mode? -->
                                <button
                                    onclick={() => scrollToSection(faq.slug || '')}
                                    class="toc-link"
                                >
                                    <span class="toc-number">{index + 1}.</span>
                                    <span class="toc-text">{faq.question}</span>
                                </button>
                                {#if faq.category}
                                    <span class="toc-category">{faq.category}</span>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                </nav>
            </div>
        </aside>

        <!-- FAQ Content -->
        <main class="faq-content">
            <header class="faq-header">
                <h1>Frequently Asked Questions</h1>
                <p class="faq-intro">
                    Find answers to common questions about our Computer Science department,
                    programs, student life, and more. If you can't find what you're looking for,
                    feel free to <a href={resolve('/contact')}>contact us</a>.
                </p>
            </header>

            <div class="faq-list">
                {#each data.faqs as faq, index (faq.slug)}
                    {@const FaqComponent = faq.component}

                    <article id={faq.slug} class="faq-item">
                        <div class="faq-question-header">
                            <span class="faq-number">{index + 1}</span>
                            <h2 class="faq-question">{faq.question}</h2>
                            {#if faq.category}
                                <span class="faq-badge">{faq.category}</span>
                            {/if}
                        </div>
                        <div class="faq-answer">
                            <FaqComponent />
                        </div>
                    </article>
                {/each}
            </div>
        </main>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .faq-page {
        min-height: 100vh;
        background: $light-bg;
    }

    .faq-container {
        max-width: $max-width;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 60px;
        padding: 40px 20px;

        @media (max-width: 1024px) {
            grid-template-columns: 250px 1fr;
            gap: 40px;
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 20px;
        }
    }

    /* Table of Contents */
    .toc {
        position: relative;

        @media (max-width: 768px) {
            position: static;
        }
    }

    .toc-sticky {
        position: sticky;
        top: 1rem;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
        padding: 20px;
        background: white;
        border: 1px solid $border-color;
        border-radius: 8px;

        @media (max-width: 768px) {
            position: static;
            max-height: none;
            overflow-y: visible;
        }

        h2 {
            margin: 0 0 20px 0;
            font-size: 1.25rem;
            color: $primary-color;
            padding-bottom: 10px;
            border-bottom: 2px solid $border-color;
        }
    }

    .toc-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .toc-item {
        margin-bottom: 12px;
        border-left: 3px solid transparent;
        transition: border-color 0.2s ease;

        &.active {
            border-left-color: $accent-color;

            .toc-link {
                color: $accent-color;
                font-weight: 600;
            }
        }
    }

    .toc-link {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 12px;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        color: $text-color;
        transition: all 0.2s ease;
        width: 100%;
        line-height: 1.4;

        &:hover {
            color: $accent-color;
            background: rgba($accent-color, 0.05);
        }
    }

    .toc-number {
        flex-shrink: 0;
        font-weight: 600;
        color: $secondary-color;
    }

    .toc-text {
        flex: 1;
    }

    .toc-category {
        display: block;
        font-size: 0.75rem;
        color: $secondary-color;
        margin-top: 4px;
        margin-left: 28px;
        font-style: italic;
    }

    /* FAQ Content */
    .faq-content {
        min-width: 0; // Prevent grid blowout
    }

    .faq-header {
        margin-bottom: 50px;

        h1 {
            font-size: 2.5rem;
            color: $primary-color;
            margin: 0 0 20px 0;

            @media (max-width: 768px) {
                font-size: 2rem;
            }
        }

        .faq-intro {
            font-size: 1.1rem;
            color: $secondary-color;
            line-height: 1.6;
            max-width: 700px;

            a {
                color: $accent-color;
                text-decoration: underline;

                &:hover {
                    text-decoration: none;
                }
            }
        }
    }

    .faq-list {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .faq-item {
        scroll-margin-top: 100px;
        padding: 30px;
        background: white;
        border: 1px solid $border-color;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border-color: $accent-color;
        }
    }

    .faq-question-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .faq-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: $accent-color;
        color: white;
        border-radius: 50%;
        font-weight: bold;
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    .faq-question {
        flex: 1;
        font-size: 1.5rem;
        color: $primary-color;
        margin: 0;
        min-width: 200px;

        @media (max-width: 768px) {
            font-size: 1.25rem;
        }
    }

    .faq-badge {
        padding: 4px 12px;
        background: rgba($accent-color, 0.1);
        color: $accent-color;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .faq-answer {
        color: $text-color;
        line-height: 1.8;
        font-size: 1rem;

        :global(h1) {
            display: none; // Hide the duplicate h1 from markdown
        }

        :global(h2) {
            font-size: 1.3rem;
            color: $primary-color;
            margin: 25px 0 15px 0;
            font-weight: 600;
        }

        :global(h3) {
            font-size: 1.1rem;
            color: $primary-color;
            margin: 20px 0 10px 0;
            font-weight: 600;
        }

        :global(p) {
            margin: 15px 0;
        }

        :global(ul),
        :global(ol) {
            margin: 15px 0;
            padding-left: 25px;
        }

        :global(li) {
            margin: 8px 0;
        }

        :global(a) {
            color: $accent-color;
            text-decoration: none;
            font-weight: 500;
            border-bottom: 1px solid transparent;
            transition: border-color 0.2s ease;

            &:hover {
                border-bottom-color: $accent-color;
            }
        }

        :global(strong) {
            color: $primary-color;
            font-weight: 600;
        }

        :global(code) {
            background: rgba($primary-color, 0.05);
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        :global(img) {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 20px 0;
        }
    }

    /* Scrollbar styling for TOC */
    .toc-sticky::-webkit-scrollbar {
        width: 6px;
    }

    .toc-sticky::-webkit-scrollbar-track {
        background: transparent;
    }

    .toc-sticky::-webkit-scrollbar-thumb {
        background: $border-color;
        border-radius: 3px;

        &:hover {
            background: $secondary-color;
        }
    }
</style>
