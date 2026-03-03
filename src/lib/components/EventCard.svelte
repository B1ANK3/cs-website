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

    const handleCardClick = async () => {
        await goto(resolve(`/events/${event.slug}`));
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
    <div class="date-square">
        <div class="month text-accent">{month}</div>
        <div class="day text-accent">{day}</div>
    </div>

    <div class="event-content">
        <div class="event-header">
            <div class="title-wrapper">
                <h3 class="event-title">
                    {event.title}
                </h3>
                {#if event.pinned}
                    <div class="pinned-badge">Pinned</div>
                {/if}
            </div>
        </div>
        <div>
            {#if event.time}
                <p class="event-time">{event.time}</p>
            {/if}

            <div class="event-meta">
                <div class="meta-item">
                    <span class="label">Location:</span>
                    <span>{event.location}</span>
                </div>
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
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .event-card {
        display: flex;
        gap: 1.5rem;
        padding: 1.5rem;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            border-color: $accent-color;
            transform: translateY(-2px);
        }

        &:focus-visible {
            outline: 2px solid $accent-color;
            outline-offset: 2px;
        }
    }

    .date-square {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        flex-shrink: 0;
        text-align: center;
        border-radius: 8px;
        // background: rgba(97, 34, 59, 0.08);
        border: 1px solid $primary-color;
        padding: 1rem;

        .month {
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.05em;
        }

        .day {
            font-size: 3rem;
            font-weight: 700;
            line-height: 1;
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

    .title-wrapper {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
    }

    .event-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #333;
        transition: color 0.3s ease;

        .event-card:hover & {
            color: $primary-color;
        }
    }

    .event-time {
        margin: 0;
        font-size: 0.8rem;
        color: $light-text-color;
    }

    .event-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.8rem;
        color: $light-text-color;

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
        font-size: 1rem;
        color: $text-color;
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
        color: $accent-color;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;

        &:hover {
            color: $secondary-color;
            text-decoration: none;
        }
    }

    .pinned-badge {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: $text-color-inverted;
        background: $primary-color;
        border-radius: 999px;
        padding: 0.25rem 0.6rem;
        font-weight: 600;
        flex-shrink: 0;
    }

    .text-accent {
        color: $primary-color;
    }

    @media (max-width: 640px) {
        .event-card {
            flex-direction: row;
            gap: 1rem;
        }

        .title-wrapper {
            flex-direction: column;
            align-items: flex-start;
        }

        .event-title {
            font-size: 1.125rem;
        }

        .event-meta {
            gap: 0.5rem;
        }
    }
</style>
