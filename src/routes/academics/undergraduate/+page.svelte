<script lang="ts">
    import EventCard from '$lib/components/EventCard.svelte';
    import { modulesData } from '$lib/academics/undergraduate/modules';
    import { programmeData } from '$lib/academics/undergraduate/programme';
    import type { PageData } from './$types';
    import { resolve } from '$app/paths';

    const { data }: { data: PageData } = $props();

    const academicCards = [
        {
            slug: 'modules',
            ...modulesData,
            href: resolve('/academics/undergraduate/modules')
        },
        {
            slug: 'programme',
            ...programmeData,
            href: resolve('/academics/undergraduate/programme')
        }
    ];
</script>

<div class="undergraduate-page">
    <!-- Overview Section -->
    <section class="overview-section">
        <div class="container">
            <h1>Undergraduate Programme</h1>
            <div class="overview-content">
                <div class="overview-text">
                    <p class="lead">
                        Our Bachelor of Science in Computer Science is designed to provide a
                        comprehensive education in computing fundamentals while offering flexibility
                        to explore specialized areas of interest.
                    </p>
                    <p>
                        The programme combines rigorous theoretical foundations with hands-on
                        practical experience, preparing students for successful careers in software
                        development, research, entrepreneurship, and beyond. Students benefit from
                        industry partnerships, research opportunities, and a supportive community of
                        faculty and peers.
                    </p>
                    <div class="highlights">
                        <div class="highlight-item">
                            <div class="highlight-text">
                                <h3>4-Year Programme</h3>
                                <p>Comprehensive curriculum with specialization tracks</p>
                            </div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-text">
                                <h3>Industry Placements</h3>
                                <p>12-month internship opportunities with leading tech companies</p>
                            </div>
                        </div>
                        <div class="highlight-item">
                            <div class="highlight-text">
                                <h3>Research Projects</h3>
                                <p>Final-year projects with cutting-edge research groups</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Academic Cards Section -->
    <section class="academic-cards-section">
        <div class="container">
            <h2>Explore the Programme</h2>
            <div class="cards-grid">
                {#each academicCards as card (card.slug)}
                    <a href={card.href} class="academic-card">
                        <div class="card-image-wrapper">
                            <div
                                class="card-image"
                                style="background-image: url({card.frontImage})"
                            >
                                <div class="card-overlay"></div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h3>{card.title}</h3>
                            <p>{card.summary}</p>
                            <div class="card-action">
                                <span class="learn-more">Learn More →</span>
                            </div>
                        </div>
                    </a>
                {/each}
            </div>
        </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
        <div class="container">
            <div class="events-header">
                <div>
                    <h2>Undergraduate Events</h2>
                    <p class="section-subtitle">
                        Stay connected with events, workshops, and opportunities designed for
                        undergraduate students
                    </p>
                </div>
                <a href={resolve('/events')} class="view-all-link">View All Events →</a>
            </div>

            {#if data.undergradEvents && data.undergradEvents.length > 0}
                <div class="events-grid">
                    {#each data.undergradEvents as event (event.slug)}
                        <EventCard {event} />
                    {/each}
                </div>
            {:else}
                <div class="no-events">
                    <p>No upcoming undergraduate events at the moment. Check back soon!</p>
                    <a href={resolve('/events')} class="browse-link">Browse all events</a>
                </div>
            {/if}
        </div>
    </section>
</div>

<style lang="scss">
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* Overview Section */
    .overview-section {
        background: #61223b;
        color: white;
        padding: 5rem 0;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #d22730;
        }

        h1 {
            font-size: 3.5rem;
            margin-bottom: 2rem;
            font-weight: 700;
            text-align: center;
        }

        .overview-content {
            max-width: 900px;
            margin: 0 auto;
        }

        .overview-text {
            .lead {
                font-size: 1.3rem;
                margin-bottom: 1.5rem;
                line-height: 1.6;
                font-weight: 500;
            }

            p {
                font-size: 1.05rem;
                line-height: 1.7;
                margin-bottom: 1.5rem;
                opacity: 0.95;
            }
        }

        .highlights {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;

            .highlight-item {
                display: flex;
                gap: 1rem;
                align-items: flex-start;

                .highlight-text {
                    h3 {
                        font-size: 1.2rem;
                        margin: 0 0 0.5rem 0;
                    }

                    p {
                        margin: 0;
                        font-size: 0.95rem;
                        opacity: 0.9;
                    }
                }
            }
        }
    }

    /* Academic Cards Section */
    .academic-cards-section {
        padding: 5rem 0;
        background: #f8f9fa;

        h2 {
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 3rem;
            color: #333;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
            gap: 2.5rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }
    }

    .academic-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        text-decoration: none;
        color: inherit;

        &:hover {
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            transform: translateY(-8px);

            .card-image {
                transform: scale(1.05);
            }

            .learn-more {
                color: #61223b;
            }
        }

        .card-image-wrapper {
            height: 200px;
            overflow: hidden;
            position: relative;
        }

        .card-image {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 0.3s ease;
            position: relative;

            .card-overlay {
                position: absolute;
                inset: 0;
                background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
            }
        }

        .card-body {
            padding: 2rem;
            flex: 1;
            display: flex;
            flex-direction: column;

            h3 {
                font-size: 1.5rem;
                margin: 0 0 1rem 0;
                color: #333;
            }

            p {
                color: #666;
                line-height: 1.6;
                margin: 0 0 1.5rem 0;
                flex: 1;
            }

            .card-action {
                margin-top: auto;

                .learn-more {
                    color: #d22730;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    transition: all 0.2s ease;
                }
            }
        }
    }

    /* Events Section */
    .events-section {
        padding: 5rem 0;
        background: white;

        .events-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3rem;
            gap: 2rem;

            @media (max-width: 768px) {
                flex-direction: column;
            }

            h2 {
                font-size: 2.5rem;
                margin: 0 0 0.5rem 0;
                color: #333;
            }

            .section-subtitle {
                color: #666;
                font-size: 1.1rem;
                margin: 0;
            }

            .view-all-link {
                color: #d22730;
                font-weight: 600;
                text-decoration: none;
                white-space: nowrap;
                transition: color 0.2s ease;
                padding-top: 0.5rem;

                &:hover {
                    color: #61223b;
                }
            }
        }

        .events-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }

        .no-events {
            text-align: center;
            padding: 4rem 2rem;
            background: #f8f9fa;
            border-radius: 12px;

            p {
                font-size: 1.2rem;
                color: #666;
                margin-bottom: 1.5rem;
            }

            .browse-link {
                display: inline-block;
                padding: 0.75rem 1.5rem;
                background: #d22730;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.2s ease;

                &:hover {
                    background: #61223b;
                    transform: translateY(-2px);
                }
            }
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .overview-section {
            padding: 3rem 0;

            h1 {
                font-size: 2.5rem;
            }

            .overview-text {
                .lead {
                    font-size: 1.1rem;
                }

                p {
                    font-size: 1rem;
                }
            }

            .highlights {
                grid-template-columns: 1fr;
                gap: 1.5rem;
            }
        }

        .academic-cards-section {
            padding: 3rem 0;

            h2 {
                font-size: 2rem;
            }
        }

        .events-section {
            padding: 3rem 0;

            .events-header h2 {
                font-size: 2rem;
            }
        }
    }
</style>
