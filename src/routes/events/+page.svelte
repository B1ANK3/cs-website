<script lang="ts">
    import EventCard from '$lib/components/EventCard.svelte';
    import { filterEvents, getUpcomingEvents, getPastEvents, type Event } from '$lib/events';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

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
</script>

<main class="events-page">
    <div class="events-header">
        <h1>Events</h1>
        <p class="subtitle">Discover upcoming seminars, workshops, and research showcases</p>
    </div>

    <div class="events-controls">
        <div class="search-box">
            <input
                type="text"
                placeholder="Search events..."
                bind:value={searchQuery}
                class="search-input"
            />
        </div>

        <div class="filter-buttons">
            <button
                class="filter-btn"
                class:active={filterType === 'upcoming'}
                onclick={() => (filterType = 'upcoming')}
            >
                Upcoming Events
            </button>
            <button
                class="filter-btn"
                class:active={filterType === 'all'}
                onclick={() => (filterType = 'all')}
            >
                All Events
            </button>
            <button
                class="filter-btn"
                class:active={filterType === 'past'}
                onclick={() => (filterType = 'past')}
            >
                Past Events
            </button>
        </div>
    </div>

    {#if filteredEvents.length === 0}
        <div class="no-events">
            <p>No events found matching your criteria.</p>
        </div>
    {:else}
        <div class="events-list">
            <p class="event-count">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
            </p>
            {#each filteredEvents as event (event.slug)}
                <EventCard {event} />
            {/each}
        </div>
    {/if}
</main>

<style lang="scss">
    .events-page {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .events-header {
        margin-bottom: 3rem;
        text-align: center;

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0 0 0.5rem 0;
            color: var(--text-primary, #111827);
        }

        .subtitle {
            margin: 0;
            font-size: 1.125rem;
            color: var(--text-secondary, #6b7280);
        }
    }

    .events-controls {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 2rem;

        @media (min-width: 768px) {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
        }
    }

    .search-box {
        flex: 1;
        display: flex;
        align-items: center;

        @media (min-width: 768px) {
            max-width: 400px;
        }
    }

    .search-input {
        width: 100%;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.375rem;
        background: var(--input-bg, #ffffff);
        color: var(--text-primary, #111827);

        &::placeholder {
            color: var(--text-tertiary, #9ca3af);
        }

        &:focus {
            outline: none;
            border-color: var(--accent-color, #3b82f6);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
    }

    .filter-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;

        @media (min-width: 768px) {
            flex-wrap: nowrap;
        }
    }

    .filter-btn {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.375rem;
        background: var(--button-bg, #f3f4f6);
        color: var(--text-primary, #111827);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
            background: var(--button-hover-bg, #e5e7eb);
            border-color: var(--accent-color, #3b82f6);
        }

        &.active {
            background: var(--accent-color, #3b82f6);
            color: white;
            border-color: var(--accent-color, #3b82f6);
        }

        &:focus-visible {
            outline: 2px solid var(--accent-color, #3b82f6);
            outline-offset: 2px;
        }
    }

    .events-list {
        margin-top: 2rem;

        .event-count {
            font-size: 0.875rem;
            color: var(--text-secondary, #6b7280);
            margin: 0 0 1rem 0;
            font-weight: 500;
        }
    }

    .no-events {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-secondary, #6b7280);

        p {
            font-size: 1.125rem;
            margin: 0;
        }
    }

    @media (max-width: 640px) {
        .events-header {
            h1 {
                font-size: 2rem;
            }

            .subtitle {
                font-size: 1rem;
            }
        }
    }
</style>
