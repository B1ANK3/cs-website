<!-- TODO: Implement fuzzy searching -->
<script lang="ts">
    import { search, type SearchResult } from '$lib/search';
    import { goto } from '$app/navigation';
    import Search from '$lib/assets/svg/Search.svelte';

    let searchQuery = $state('');
    let searchResults = $state<SearchResult[]>([]);
    let showResults = $state(false);
    let searchInputRef: HTMLInputElement;

    // Debounce search
    let searchTimeout: ReturnType<typeof setTimeout>;

    function handleSearchInput() {
        clearTimeout(searchTimeout);

        // Check if query has at least 4 non-whitespace characters
        const trimmedQuery = searchQuery.replace(/\s/g, '');
        if (trimmedQuery.length < 4) {
            searchResults = [];
            showResults = false;
            return;
        }

        searchTimeout = setTimeout(() => {
            searchResults = search(searchQuery);
            showResults = searchResults.length > 0;
        }, 300);
    }

    function handleResultClick(result: SearchResult) {
        goto(result.url);
        searchQuery = '';
        searchResults = [];
        showResults = false;
        searchInputRef?.blur();
    }

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.search-container')) {
            showResults = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            showResults = false;
            searchInputRef?.blur();
        }
    }

    function getTypeLabel(type: SearchResult['type']): string {
        const labels = {
            course: 'Course',
            event: 'Event',
            news: 'News',
            person: 'Person',
            research: 'Research',
            faq: 'FAQ'
        };
        return labels[type];
    }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleKeydown} />

<div class="search-container">
    <div class="search-input-wrapper">
        <input
            bind:this={searchInputRef}
            type="text"
            placeholder="Search..."
            class="search-input"
            bind:value={searchQuery}
            oninput={handleSearchInput}
            onfocus={() => {
                if (searchResults.length > 0) {
                    showResults = true;
                }
            }}
        />
        <div class="search-icon">
            <Search />
        </div>
    </div>

    {#if showResults && searchResults.length > 0}
        <div class="search-results">
            {#each searchResults as result (result.title + result.url)}
                <button
                    class="search-result-item"
                    onclick={() => handleResultClick(result)}
                    type="button"
                >
                    <div class="result-header">
                        <span class="result-title">{result.title}</span>
                        <span class="result-type">{getTypeLabel(result.type)}</span>
                    </div>
                    <div class="result-excerpt">
                        {@html result.excerpt}
                    </div>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .search-container {
        position: relative;
        width: 100%;
        max-width: 400px;
    }

    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        border: 1px solid #ccc;
        border-radius: 20px;
        background-color: white;
        transition: border-color 0.2s;
        width: fit-content;

        &:focus-within {
            border-color: $secondary-color;
        }
    }

    .search-input {
        flex: 1;
        padding: 0.5rem 1rem;
        border: none;
        background: transparent;
        font-size: 0.9rem;
        outline: none;
        border-radius: 20px;
    }

    .search-icon {
        display: flex;
        align-items: center;
        padding: 0 0.75rem;
        color: #666;
        pointer-events: none;
    }

    .search-results {
        position: absolute;
        top: calc(100% + 0.5rem);
        left: 0;
        right: 0;
        max-height: 60vh;
        overflow-y: auto;
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
    }

    .search-result-item {
        width: 100%;
        padding: 0.75rem 1rem;
        border: none;
        border-bottom: 1px solid #eee;
        background: white;
        text-align: left;
        cursor: pointer;
        transition: background-color 0.2s;

        &:last-child {
            border-bottom: none;
        }

        &:hover {
            background-color: #f5f5f5;
        }
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
    }

    .result-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: #333;
    }

    .result-type {
        font-size: 0.75rem;
        padding: 0.125rem 0.5rem;
        background-color: #e3f2fd;
        color: #1976d2;
        border-radius: 12px;
        text-transform: uppercase;
        font-weight: 500;
    }

    .result-excerpt {
        font-size: 0.85rem;
        color: #666;
        line-height: 1.4;

        :global(mark) {
            background-color: #ffeb3b;
            padding: 0 0.2rem;
            border-radius: 2px;
            font-weight: 500;
        }
    }

    /* Scrollbar styling */
    .search-results::-webkit-scrollbar {
        width: 8px;
    }

    .search-results::-webkit-scrollbar-track {
        background: #f1f1f1;
    }

    .search-results::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;

        &:hover {
            background: #555;
        }
    }
</style>
