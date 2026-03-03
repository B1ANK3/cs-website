<script lang="ts">
    import EventCard from '$lib/components/EventCard.svelte';
    import { filterEvents, getUpcomingEvents, getPastEvents, type Event } from '$lib/events';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    const heroBackgroundImage: string | null = null;

    let searchQuery: string = $state('');
    let filterType: 'all' | 'upcoming' | 'past' = $state('upcoming');

    let filteredEvents: Event[] = $derived.by(() => {
        let filtered = data.events;

        // Filter by type
        if (filterType === 'upcoming') {
            filtered = getUpcomingEvents(filtered, 365);
        } else if (filterType === 'past') {
            filtered = getPastEvents(filtered);
        }

        // Filter by search
        filtered = filterEvents(filtered, searchQuery);

        return filtered;
    });

    function resetFilters() {
        searchQuery = '';
        filterType = 'upcoming';
    }
</script>

<svelte:head>
    <title>Events | CS Department</title>
    <meta
        name="description"
        content="Discover upcoming seminars, workshops, and showcases in the Computer Science division."
    />
</svelte:head>

<main class="events-page page-shell">
    <section
        class="events-hero hero-section"
        class:has-image={Boolean(heroBackgroundImage)}
        style={heroBackgroundImage ? `--hero-image: url('${heroBackgroundImage}')` : undefined}
    >
        <div class="container">
            <h1>Events</h1>
            <p class="subtitle">Discover upcoming seminars, workshops, and research showcases</p>
        </div>
    </section>

    <section class="events-content content-section">
        <div class="container">
            <div class="events-layout page-layout">
                <aside class="filters-sidebar">
                    <div class="filters-header">
                        <h2>Filters</h2>
                        <button class="reset-btn" onclick={resetFilters}>Reset</button>
                    </div>

                    <div class="filter-section">
                        <label for="event-search">Search</label>
                        <input
                            id="event-search"
                            type="text"
                            placeholder="Title, location, host, speaker..."
                            bind:value={searchQuery}
                            class="search-input"
                        />
                    </div>

                    <div class="filter-section">
                        <fieldset>
                            <legend>Event Type</legend>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="event-filter"
                                        value="upcoming"
                                        bind:group={filterType}
                                    />
                                    Upcoming Events
                                </label>
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="event-filter"
                                        value="all"
                                        bind:group={filterType}
                                    />
                                    All Events
                                </label>
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="event-filter"
                                        value="past"
                                        bind:group={filterType}
                                    />
                                    Past Events
                                </label>
                            </div>
                        </fieldset>
                    </div>

                    <div class="results-count">
                        {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                    </div>
                </aside>

                <div class="events-main content-main">
                    {#if filteredEvents.length === 0}
                        <div class="no-events no-results">
                            <p>No events found matching your criteria.</p>
                            <button class="reset-btn" onclick={resetFilters}>Reset Filters</button>
                        </div>
                    {:else}
                        <div class="events-list">
                            {#each filteredEvents as event (event.slug)}
                                <EventCard {event} />
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
        background: #f8f9fa;
        min-height: 100vh;
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
            font-weight: 700;
            margin: 0 0 1rem 0;
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

            label,
            legend {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }

            fieldset {
                border: none;
                padding: 0;
                margin: 0;
            }
        }
    }

    .search-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid $border-color;
        border-radius: 6px;
        font-size: 0.95rem;
        background: white;
        transition: border-color 0.2s;

        &:focus {
            outline: none;
            border-color: $primary-color;
            box-shadow: 0 0 0 3px rgba(97, 34, 59, 0.15);
        }
    }

    .radio-group {
        display: flex;
        flex-direction: column;
        gap: 0;

        .radio-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: normal;
            cursor: pointer;
            padding: 0.35rem 0.5rem;
            border-radius: 4px;
            transition: background 0.2s;

            &:hover {
                background: #f8f9fa;
            }

            input[type='radio'] {
                cursor: pointer;
                accent-color: $primary-color;
            }
        }
    }

    .results-count {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e0e0e0;
        color: #666;
        font-size: 0.9rem;
        text-align: center;
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

    .content-main {
        min-height: 400px;
    }

    .events-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .no-results {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 2px 8px $shadow-color;
        color: #666;

        p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }
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

        .filters-sidebar {
            padding: 1.5rem;
        }

        .container {
            padding: 0 1rem;
        }
    }
</style>
