<script lang="ts">
    import { formatEventDate, generateGoogleCalendarLink, type Event } from '$lib/events';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    const event = $derived(data.event as Event);
    const EventComponent = $derived(event.component);
    const googleCalendarUrl = $derived(generateGoogleCalendarLink(event));

    // Helper function to format date range
    function formatDateRange(): string {
        if (event.endDate && event.endDate !== event.date) {
            return `${formatEventDate(event.date)} - ${formatEventDate(event.endDate)}`;
        }
        return formatEventDate(event.date);
    }
</script>

<svelte:head>
    <title>{event.title} | CS Department</title>
    <meta name="description" content={event.description} />
</svelte:head>

<main class="event-detail-page">
    <div class="event-hero">
        <h1 class="event-title">{event.title}</h1>
        <p class="event-summary">{event.summary || event.description}</p>
    </div>

    <div class="event-container">
        <article class="event-main">
            <div class="event-info">
                <div class="info-item">
                    <h3 class="info-label">Date & Time</h3>
                    <p class="info-content">{formatDateRange()}</p>
                    {#if event.time}
                        <p class="info-content time">{event.time}</p>
                    {/if}
                </div>

                <div class="info-item">
                    <h3 class="info-label">Location</h3>
                    <p class="info-content">{event.location}</p>
                </div>

                <div class="info-item">
                    <a
                        href={googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="add-calendar-btn"
                    >
                        + Add to Google Calendar
                    </a>
                </div>
            </div>

            <div class="event-content">
                <EventComponent />
            </div>
        </article>

        <aside class="event-sidebar">
            <div class="sidebar-box attendees-box">
                {#if event.hosts && event.hosts.length > 0}
                    <div class="attendees-section">
                        <h3 class="section-title">Host{event.hosts.length !== 1 ? 's' : ''}</h3>
                        <ul class="attendees-list">
                            {#each event.hosts as host (host)}
                                <li>{host}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if event.speakers && event.speakers.length > 0}
                    <div class="attendees-section">
                        <h3 class="section-title">
                            Speaker{event.speakers.length !== 1 ? 's' : ''}
                        </h3>
                        <ul class="attendees-list">
                            {#each event.speakers as speaker (speaker)}
                                <li>{speaker}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if event.organizers && event.organizers.length > 0}
                    <div class="attendees-section">
                        <h3 class="section-title">
                            Organizer{event.organizers.length !== 1 ? 's' : ''}
                        </h3>
                        <ul class="attendees-list">
                            {#each event.organizers as organizer (organizer)}
                                <li>{organizer}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}

                {#if event.attendees && event.attendees.length > 0}
                    <div class="attendees-section">
                        <h3 class="section-title">
                            Attendee{event.attendees.length !== 1 ? 's' : ''}
                        </h3>
                        <ul class="attendees-list">
                            {#each event.attendees as attendee (attendee)}
                                <li>{attendee}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        </aside>
    </div>
</main>

<style lang="scss">
    .event-detail-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .event-hero {
        margin-bottom: 3rem;
        padding-bottom: 2rem;
        border-bottom: 1px solid var(--border-color, #e5e7eb);

        .event-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
            color: var(--text-primary, #111827);

            @media (max-width: 640px) {
                font-size: 2rem;
            }
        }

        .event-summary {
            font-size: 1.125rem;
            margin: 0;
            color: var(--text-secondary, #6b7280);
            line-height: 1.6;

            @media (max-width: 640px) {
                font-size: 1rem;
            }
        }
    }

    .event-container {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 3rem;

        @media (max-width: 1024px) {
            grid-template-columns: 1fr 300px;
            gap: 2rem;
        }

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
    }

    .event-main {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .event-info {
        background: var(--card-bg, #f9fafb);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.5rem;
        padding: 2rem;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;

        @media (max-width: 768px) {
            padding: 1.5rem;
            gap: 1.5rem;
        }
    }

    .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        &:has(.add-calendar-btn) {
            grid-column: 1 / -1;
        }
    }

    .info-label {
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-primary, #111827);
    }

    .info-content {
        margin: 0;
        font-size: 0.95rem;
        color: var(--text-secondary, #6b7280);
        line-height: 1.5;

        &.time {
            font-weight: 500;
            color: var(--accent-color, #3b82f6);
        }
    }

    .add-calendar-btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background: var(--accent-color, #3b82f6);
        color: white;
        text-decoration: none;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        text-align: center;

        &:hover {
            background: var(--accent-color-dark, #2563eb);
            text-decoration: none;
        }

        &:focus-visible {
            outline: 2px solid var(--accent-color, #3b82f6);
            outline-offset: 2px;
        }
    }

    .event-content {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--text-primary, #111827);

        :global(h1) {
            font-size: 2rem;
            font-weight: 700;
            margin: 2rem 0 1rem;
            color: var(--text-primary, #111827);

            &:first-child {
                margin-top: 0;
            }
        }

        :global(h2) {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 1.5rem 0 0.75rem;
            color: var(--text-primary, #111827);
        }

        :global(h3) {
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.25rem 0 0.5rem;
            color: var(--text-primary, #111827);
        }

        :global(h4) {
            font-weight: 600;
            margin: 1rem 0 0.5rem;
            color: var(--text-primary, #111827);
        }

        :global(h5) {
            font-weight: 600;
            margin: 1rem 0 0.5rem;
            color: var(--text-primary, #111827);
        }

        :global(h6) {
            font-weight: 600;
            margin: 1rem 0 0.5rem;
            color: var(--text-primary, #111827);
        }

        :global(p) {
            margin: 1rem 0;
        }

        :global(ul) {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        :global(ol) {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        :global(li) {
            margin: 0.5rem 0;
        }

        :global(a) {
            color: var(--accent-color, #3b82f6);
            text-decoration: underline;

            &:hover {
                color: var(--accent-color-dark, #2563eb);
            }
        }

        :global(code) {
            background: var(--code-bg, #f3f4f6);
            padding: 0.2em 0.4em;
            border-radius: 0.25rem;
            font-family: monospace;
            font-size: 0.9em;
            color: var(--code-color, #d946ef);
        }

        :global(pre) {
            background: var(--code-bg, #1f2937);
            color: #e5e7eb;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
        }

        :global(blockquote) {
            border-left: 4px solid var(--accent-color, #3b82f6);
            padding-left: 1rem;
            margin: 1rem 0;
            color: var(--text-secondary, #6b7280);
            font-style: italic;
        }
    }

    .event-sidebar {
        @media (max-width: 768px) {
            position: static;
        }
    }

    .sidebar-box {
        background: var(--card-bg, #f9fafb);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.5rem;
        padding: 1.5rem;
        position: sticky;
        top: 2rem;

        @media (max-width: 768px) {
            position: static;
            top: auto;
        }
    }

    .attendees-section {
        &:not(:last-child) {
            margin-bottom: 1.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color, #e5e7eb);
        }
    }

    .section-title {
        margin: 0 0 0.75rem 0;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-primary, #111827);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .attendees-list {
        margin: 0;
        padding: 0;
        list-style: none;

        li {
            padding: 0.5rem 0;
            font-size: 0.9rem;
            color: var(--text-secondary, #6b7280);

            &::before {
                content: '👤 ';
                margin-right: 0.5rem;
            }
        }
    }

    @media (max-width: 640px) {
        .event-detail-page {
            padding: 1rem;
        }

        .event-hero {
            margin-bottom: 2rem;
        }

        .event-info {
            padding: 1rem;
            gap: 1rem;
        }

        .sidebar-box {
            padding: 1.25rem;
        }
    }
</style>
