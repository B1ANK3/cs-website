<script lang="ts">
    import { goto } from '$app/navigation';
    import { resolve } from '$app/paths';
    import { getEventMonth, getEventDay, generateGoogleCalendarLink } from '$lib/events';
    import type { Event } from '$lib/events';

    interface Props {
        event: Event;
    }

    const { event }: Props = $props();

    const month = $derived(getEventMonth(event.date));
    const day = $derived(getEventDay(event.date));

    const handleCardClick = () => {
        goto(resolve(`/events/${event.slug}`));
    };

    const googleCalendarUrl = $derived(generateGoogleCalendarLink(event));
</script>

<div
    class="event-card"
    onclick={handleCardClick}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && handleCardClick()}
>
    <div class="date-sidebar">
        <div class="month text-accent">{month}</div>
        <div class="day text-accent">{day}</div>
    </div>

    <div class="event-content">
        <div class="event-header">
            <h3 class="event-title">{event.title}</h3>
            {#if event.time}
                <p class="event-time">{event.time}</p>
            {/if}
        </div>

        <div class="event-meta">
            <div class="meta-item">
                <span class="label">📍</span>
                <span>{event.location}</span>
            </div>
        </div>

        <p class="event-description">{event.description}</p>

        <div class="event-footer">
            <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                class="calendar-link"
                onclick={(e) => e.stopPropagation()}
            >
                + Add to Calendar
            </a>
        </div>
    </div>

    {#if event.pinned}
        <div class="pinned-badge">📌</div>
    {/if}
</div>

<style lang="scss">
    .event-card {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        background: var(--card-bg, #f9fafb);
        border: 1px solid var(--border-color, #e5e7eb);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-color: var(--accent-color, #3b82f6);
            transform: translateY(-2px);
        }

        &:focus-visible {
            outline: 2px solid var(--accent-color, #3b82f6);
            outline-offset: 2px;
        }
    }

    .date-sidebar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 70px;
        padding: 0.5rem;
        text-align: center;
        border-radius: 0.25rem;
        background: var(--accent-bg, rgba(59, 130, 246, 0.1));

        .month {
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .day {
            font-size: 2rem;
            font-weight: 700;
        }
    }

    .event-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .event-header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .event-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary, #111827);
        transition: color 0.3s ease;

        .event-card:hover & {
            color: var(--accent-color, #3b82f6);
        }
    }

    .event-time {
        margin: 0;
        font-size: 0.875rem;
        color: var(--text-secondary, #6b7280);
    }

    .event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.875rem;
        color: var(--text-secondary, #6b7280);

        .meta-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            .label {
                flex-shrink: 0;
            }
        }
    }

    .event-description {
        margin: 0.5rem 0 0 0;
        font-size: 0.95rem;
        color: var(--text-secondary, #6b7280);
        line-height: 1.5;
        display: -webkit-box;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .event-footer {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .calendar-link {
        font-size: 0.875rem;
        color: var(--accent-color, #3b82f6);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
            color: var(--accent-color-dark, #2563eb);
            text-decoration: underline;
        }
    }

    .pinned-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        font-size: 1.25rem;
    }

    .text-accent {
        color: var(--accent-color, #3b82f6);
    }

    @media (max-width: 640px) {
        .event-card {
            flex-direction: column;
            gap: 1rem;
        }

        .date-sidebar {
            flex-direction: row;
            width: 100%;
            min-width: unset;
            gap: 1rem;

            .month {
                font-size: 0.625rem;
            }

            .day {
                font-size: 1.5rem;
            }
        }

        .event-title {
            font-size: 1.125rem;
        }

        .event-meta {
            gap: 0.5rem;
        }
    }
</style>
