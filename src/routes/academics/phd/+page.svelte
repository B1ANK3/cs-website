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

    const phdInfo: ProgrammeInfo = {
        title: 'PhD Programme',
        description:
            'The PhD in Computer Science is a research-intensive degree designed for students who want to produce original, publishable contributions and become leaders in academia, research, or advanced innovation-driven industry roles.',
        keyPoints: [
            'Focused on independent, original research under expert supervision',
            'Typically completed over 3-4 years of full-time doctoral study',
            'Engagement with research seminars, publications, and conferences',
            'Interdisciplinary collaboration across labs and research groups',
            'Structured milestones including proposal defense and progress reviews',
            'Strong preparation for academic, R&D, and specialist leadership pathways'
        ]
    };

    const phdLinks: ResourceLink[] = [
        {
            title: 'PhD Application Process',
            description: 'Admission criteria, proposal expectations, and submission requirements',
            //@ts-expect-error - iNclUde WHy A dIrecTive is NeEded. CaUsE Svelte
            url: resolve('/academics/postgraduate#how-do-i-apply')
        },
        {
            title: 'Doctoral Research Areas',
            description: 'Explore active focus areas to shape your PhD research direction',
            url: resolve('/research')
        },
        {
            title: 'Supervisor Matching Guide',
            description: 'How to identify and approach potential supervisors effectively',
            url: resolve('/people')
        },
        {
            title: 'Publication & Conference Support',
            description: 'Resources for presenting, publishing, and building your research profile',
            url: resolve('/events')
        },
        {
            title: 'Funding & Doctoral Scholarships',
            description: 'Scholarships, grants, and assistantship opportunities for PhD students',
            //@ts-expect-error - iNclUde WHy A dIrecTive is NeEded. CaUsE Svelte
            url: resolve('/academics/postgraduate#funding')
        }
    ];
</script>

<div class="phd-page">
    <section class="hero-section">
        <div class="container">
            <h1>{phdInfo.title}</h1>
            <p class="lead">{phdInfo.description}</p>
        </div>
    </section>

    <section class="key-features-section">
        <div class="container">
            <div class="content-grid">
                <div class="key-points">
                    <h2>Key Features</h2>
                    <ul>
                        {#each phdInfo.keyPoints as point (point)}
                            <li>{point}</li>
                        {/each}
                    </ul>
                </div>

                <div class="additional-info">
                    <div class="info-card">
                        <h3>Programme Duration</h3>
                        <p>Usually 3-4 years full-time, with structured annual milestone reviews</p>
                    </div>
                    <div class="info-card">
                        <h3>Entry Requirements</h3>
                        <p>
                            Master's degree with strong research performance and aligned interests
                        </p>
                    </div>
                    <div class="info-card">
                        <h3>Research Output</h3>
                        <p>
                            Thesis and peer-reviewed publications demonstrating original
                            contribution
                        </p>
                    </div>
                    <div class="info-card">
                        <h3>Career Trajectories</h3>
                        <p>
                            Academic posts, research institutes, and high-level innovation
                            leadership
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="resources-section">
        <div class="container">
            <h2>Useful Links & Resources</h2>
            <p class="section-subtitle">Key support resources for successful doctoral studies</p>
            <div class="links-grid">
                {#each phdLinks as link (link.title)}
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
