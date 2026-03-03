<script lang="ts">
    import { programmeData } from '$lib/academics/undergraduate/programme';
    import { getAllCourses, type Stream } from '$lib/courses';
    import type { Course } from '$lib/courses';

    let courses: Course[] = [];
    let streams: Stream[] = [];

    // Define descriptions for each stream
    const streamDescriptions: Record<Stream, string> = {
        'AI & Machine Learning':
            'Building intelligent systems, data science, and cutting-edge AI applications.',
        Cybersecurity:
            'Security analysis, penetration testing, and protecting digital infrastructure.',
        'Web & Mobile Development':
            'Full-stack development, mobile apps, cloud systems, and enterprise software.',
        'Data Science': 'Data engineering, business intelligence, and data-driven decision making.'
    };

    async function loadCourses() {
        courses = await getAllCourses();
        // Filter for undergraduate courses and get unique streams
        const undergraduateCourses = courses.filter(
            (c) => c.programme === 'undergraduate' && c.stream
        );
        const uniqueStreams = new Set(undergraduateCourses.map((c) => c.stream).filter(Boolean));
        streams = Array.from(uniqueStreams) as Stream[];
    }

    loadCourses();
</script>

<div class="programme-page">
    <section class="hero-section">
        <div class="container">
            <h1>{programmeData.title}</h1>
            <p class="lead">{programmeData.summary}</p>
        </div>
    </section>

    <section class="content-section">
        <div class="container">
            <div class="programme-overview">
                <div class="overview-card">
                    <h2>Programme Structure</h2>
                    <p>
                        The undergraduate programme is structured across 4 years (8 semesters), with
                        a total of 480 credits required for graduation. Students progress through
                        core foundational modules before specializing in their chosen area of
                        interest.
                    </p>

                    <div class="year-structure">
                        <div class="year">
                            <h3>Year 1 - Foundation</h3>
                            <p>
                                Core programming, mathematics, and computer science fundamentals.
                                Introduction to the field and building essential skills.
                            </p>
                            <div class="credits">120 Credits</div>
                        </div>

                        <div class="year">
                            <h3>Year 2 - Development</h3>
                            <p>
                                Data structures, algorithms, systems programming, and introduction
                                to specialized areas. Begin exploring elective options.
                            </p>
                            <div class="credits">120 Credits</div>
                        </div>

                        <div class="year">
                            <h3>Year 3 - Specialization & Placement</h3>
                            <p>
                                Advanced modules in chosen specialization track. Optional 12-month
                                industry placement for practical experience and professional
                                development.
                            </p>
                            <div class="credits">120 Credits</div>
                        </div>

                        <div class="year">
                            <h3>Year 4 - Capstone</h3>
                            <p>
                                Final year project, advanced electives, and preparation for career
                                or further study. Independent research and development work.
                            </p>
                            <div class="credits">120 Credits</div>
                        </div>
                    </div>
                </div>

                <div class="pathways-card">
                    <h2>Career Pathways</h2>
                    <p>
                        Our graduates pursue diverse and rewarding careers across the technology
                        industry and beyond. The programme prepares students for:
                    </p>

                    <div class="pathways-grid">
                        {#each streams as stream (stream)}
                            <div class="pathway">
                                <h3>{stream}</h3>
                                <p>{streamDescriptions[stream]}</p>
                            </div>
                        {/each}

                        <!-- Additional career pathways not tied to specific streams -->
                        <div class="pathway">
                            <h3>Research & Academia</h3>
                            <p>
                                Graduate studies, research positions, and academic careers advancing
                                computer science.
                            </p>
                        </div>

                        <div class="pathway">
                            <h3>Entrepreneurship</h3>
                            <p>
                                Founding tech startups and bringing innovative products to market.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="requirements-card">
                    <h2>Entry Requirements</h2>
                    <div class="requirements-content">
                        <div class="requirement">
                            <h3>Academic Requirements</h3>
                            <ul>
                                <li>High school diploma or equivalent qualification</li>
                                <li>Mathematics: Minimum grade B (or equivalent)</li>
                                <li>Recommended: Physics or Computer Science</li>
                            </ul>
                        </div>

                        <div class="requirement">
                            <h3>Application Process</h3>
                            <ul>
                                <li>Submit online application by January 15</li>
                                <li>Academic transcripts and references</li>
                                <li>Personal statement (500-800 words)</li>
                                <li>Optional: Portfolio of projects or coding experience</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    @use '$lib/styles/globals.scss' as *;

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .hero-section {
        background: $primary-color;
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
            background: $accent-color;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        .lead {
            font-size: 1.2rem;
            max-width: 800px;
            line-height: 1.6;
            opacity: 0.95;
        }
    }

    .content-section {
        padding: 4rem 0;
        background: #f8f9fa;

        .programme-overview {
            display: flex;
            flex-direction: column;
            gap: 3rem;
        }
    }

    .overview-card,
    .pathways-card,
    .requirements-card {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px $shadow-color;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-color: rgba(210, 39, 48, 0.1);
        }

        h2 {
            font-size: 2rem;
            color: $primary-color;
            margin-bottom: 1.5rem;
        }
    }

    .overview-card p,
    .pathways-card > p {
        color: $text-color;
        line-height: 1.7;
    }

    .year-structure {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-top: 2rem;

        .year {
            background: #f8f9fa;
            padding: 1.75rem;
            border-radius: 12px;
            border-left: 4px solid $accent-color;
            transition: all 0.3s ease;

            &:hover {
                background: white;
                box-shadow: 0 4px 12px $shadow-color;
                transform: translateY(-2px);
            }

            h3 {
                font-size: 1.25rem;
                color: $primary-color;
                margin-bottom: 0.75rem;
                font-weight: 600;
            }

            p {
                color: $text-color;
                font-size: 0.95rem;
                line-height: 1.6;
                margin-bottom: 1rem;
            }

            .credits {
                font-weight: 600;
                color: $accent-color;
                font-size: 0.9rem;
            }
        }
    }

    .pathways-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-top: 2rem;

        .pathway {
            text-align: center;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 12px;
            transition: all 0.3s ease;
            border: 2px solid transparent;

            &:hover {
                background: white;
                box-shadow: 0 4px 16px $shadow-color;
                transform: translateY(-4px);
                border-color: $accent-color;
            }

            h3 {
                font-size: 1.25rem;
                color: $primary-color;
                margin-bottom: 0.75rem;
                font-weight: 600;
            }

            p {
                color: $text-color;
                font-size: 0.95rem;
                line-height: 1.6;
                margin: 0;
            }
        }
    }

    .requirements-content {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;

        .requirement {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 12px;
            border: 2px solid transparent;
            transition: all 0.3s ease;

            &:hover {
                background: white;
                border-color: rgba(210, 39, 48, 0.2);
                box-shadow: 0 2px 12px $shadow-color;
            }

            h3 {
                font-size: 1.3rem;
                color: $primary-color;
                margin-bottom: 1rem;
                font-weight: 600;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    padding: 0.75rem 0;
                    color: $text-color;
                    position: relative;
                    padding-left: 1.75rem;
                    line-height: 1.6;

                    &::before {
                        content: '✓';
                        position: absolute;
                        left: 0;
                        color: $accent-color;
                        font-weight: bold;
                        font-size: 1.1rem;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 0;

            h1 {
                font-size: 2rem;
            }

            .lead {
                font-size: 1rem;
            }
        }

        .content-section {
            padding: 2rem 0;
        }

        .overview-card,
        .pathways-card,
        .requirements-card {
            padding: 2rem;

            h2 {
                font-size: 1.5rem;
            }
        }

        .year-structure {
            grid-template-columns: 1fr;
        }

        .pathways-grid {
            grid-template-columns: 1fr;
        }

        .requirements-content {
            grid-template-columns: 1fr;
        }

        .container {
            padding: 0 1rem;
        }
    }
</style>
