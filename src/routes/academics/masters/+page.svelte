<script lang="ts">
    import { resolve } from '$app/paths';

    interface ProgrammeInfo {
        title: string;
        description: string;
        keyPoints: string[];
    }

    interface ResourceLink {
        title: string;
        description: string;
        url: string;
    }

    const mastersInfo: ProgrammeInfo = {
        title: "Master's Programme",
        description:
            "Our Master's in Computer Science combines advanced specialist coursework with independent research, giving students the depth required for high-impact industry roles or progression to doctoral study.",
        keyPoints: [
            'Flexible pathway with coursework and research-focused options',
            'Advanced modules in areas such as AI, cybersecurity, data science, and systems',
            'Supervised dissertation or thesis aligned with active research groups',
            'Industry collaboration opportunities through applied project work',
            'Strong preparation for PhD studies and research careers',
            'Access to seminars, labs, and postgraduate mentoring support'
        ]
    };

    const mastersLinks: ResourceLink[] = [
        {
            title: "Master's Admission Requirements",
            description: 'Entry criteria, supporting documents, and application timelines',
            //@ts-expect-error - iNclUde WHy A dIrecTive is NeEded. CaUsE Svelte
            url: resolve('/academics/postgraduate#entry-requirements')
        },
        {
            title: 'Coursework & Module Planning',
            description: 'Guidance for selecting modules and structuring your degree pathway',
            url: resolve('/courses')
        },
        {
            title: 'Dissertation & Thesis Guidelines',
            description: 'Milestones, supervision process, and submission requirements',
            //@ts-expect-error - iNclUde WHy A dIrecTive is NeEded. CaUsE Svelte
            url: resolve('/academics/masters#thesis-guidelines')
        },
        {
            title: 'Research Areas & Supervisors',
            description: 'Explore faculty expertise and identify potential supervisors',
            url: resolve('/research')
        },
        {
            title: 'Funding & Scholarships',
            description: 'Scholarships, bursaries, and assistantship opportunities for students',
            //@ts-expect-error - iNclUde WHy A dIrecTive is NeEded. CaUsE Svelte
            url: resolve('/academics/postgraduate#funding')
        }
    ];
</script>

<div class="masters-page">
    <section class="hero-section">
        <div class="container">
            <h1>{mastersInfo.title}</h1>
            <p class="lead">{mastersInfo.description}</p>
        </div>
    </section>

    <section class="key-features-section">
        <div class="container">
            <div class="content-grid">
                <div class="key-points">
                    <h2>Key Features</h2>
                    <ul>
                        {#each mastersInfo.keyPoints as point (point)}
                            <li>{point}</li>
                        {/each}
                    </ul>
                </div>

                <div class="additional-info">
                    <div class="info-card">
                        <h3>Programme Duration</h3>
                        <p>Typically 1-2 years depending on full-time or part-time registration</p>
                    </div>
                    <div class="info-card">
                        <h3>Entry Requirements</h3>
                        <p>Honours degree in Computer Science or a closely related field</p>
                    </div>
                    <div class="info-card">
                        <h3>Research Training</h3>
                        <p>Formal research methods support with guided dissertation development</p>
                    </div>
                    <div class="info-card">
                        <h3>Career Outcomes</h3>
                        <p>
                            Advanced technical, consulting, R&D, and doctoral progression
                            opportunities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="resources-section">
        <div class="container">
            <h2>Useful Links & Resources</h2>
            <p class="section-subtitle">
                Essential information for current and prospective Master's students
            </p>
            <div class="links-grid">
                {#each mastersLinks as link (link.title)}
                    <a href={link.url} class="resource-link">
                        <div class="link-content">
                            <h3>{link.title}</h3>
                            <p>{link.description}</p>
                        </div>
                        <span class="link-arrow">→</span>
                    </a>
                {/each}
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .hero-section {
        background: #61223b;
        color: white;
        padding: 5rem 0;
        text-align: center;
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
            margin-bottom: 1.5rem;
            font-weight: 700;
        }

        .lead {
            font-size: 1.2rem;
            max-width: 900px;
            margin: 0 auto;
            line-height: 1.7;
            opacity: 0.95;
        }
    }

    .key-features-section {
        padding: 5rem 0;
        background: white;

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: start;

            @media (max-width: 1024px) {
                grid-template-columns: 1fr;
                gap: 3rem;
            }
        }

        .key-points {
            h2 {
                font-size: 2.5rem;
                color: #333;
                margin-bottom: 2rem;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;

                li {
                    padding: 1rem 0;
                    padding-left: 2.5rem;
                    position: relative;
                    color: #666;
                    line-height: 1.7;
                    font-size: 1.05rem;

                    &::before {
                        content: '✓';
                        position: absolute;
                        left: 0;
                        color: #d22730;
                        font-weight: bold;
                        font-size: 1.3rem;
                    }

                    &:not(:last-child) {
                        border-bottom: 1px solid #f0f0f0;
                    }
                }
            }
        }

        .additional-info {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;

            .info-card {
                background: #f8f9fa;
                padding: 1.75rem;
                border-radius: 12px;
                border-left: 4px solid #d22730;
                transition: all 0.3s ease;

                &:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transform: translateX(4px);
                }

                h3 {
                    font-size: 1.2rem;
                    color: #61223b;
                    margin: 0 0 0.75rem 0;
                    font-weight: 600;
                }

                p {
                    color: #666;
                    margin: 0;
                    line-height: 1.6;
                }
            }
        }
    }

    .resources-section {
        padding: 5rem 0;
        background: #f8f9fa;

        h2 {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
        }

        .section-subtitle {
            text-align: center;
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 3rem;
        }

        .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }

        .resource-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            background: white;
            padding: 1.75rem;
            border-radius: 12px;
            text-decoration: none;
            border: 2px solid #e5e5e5;
            transition: all 0.3s ease;

            &:hover {
                border-color: #d22730;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                transform: translateY(-4px);

                .link-arrow {
                    transform: translateX(4px);
                }
            }

            .link-content {
                flex: 1;

                h3 {
                    font-size: 1.15rem;
                    color: #61223b;
                    margin: 0 0 0.5rem 0;
                    font-weight: 600;
                }

                p {
                    font-size: 0.95rem;
                    color: #666;
                    margin: 0;
                    line-height: 1.5;
                }
            }

            .link-arrow {
                font-size: 1.5rem;
                color: #d22730;
                transition: transform 0.3s ease;
                flex-shrink: 0;
            }
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 0;

            h1 {
                font-size: 2.5rem;
            }

            .lead {
                font-size: 1rem;
            }
        }

        .key-features-section {
            padding: 3rem 0;

            .key-points h2 {
                font-size: 2rem;
            }

            .additional-info {
                .info-card {
                    padding: 1.25rem;

                    h3 {
                        font-size: 1.1rem;
                    }
                }
            }
        }

        .resources-section {
            padding: 3rem 0;

            h2 {
                font-size: 2rem;
            }

            .links-grid {
                grid-template-columns: 1fr;
            }

            .resource-link {
                padding: 1.25rem;

                .link-content h3 {
                    font-size: 1rem;
                }
            }
        }
    }
</style>
