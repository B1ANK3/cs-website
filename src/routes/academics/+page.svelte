<script lang="ts">
    import {
        studentResources,
        academicAreas,
        professorTestimonials
    } from '$lib/academics/students';
</script>

<svelte:head>
    <title>Academics | CS Department</title>
    <meta
        name="description"
        content="Explore the academic programs, student resources, and faculty testimonials in the Computer Science division."
    />
</svelte:head>

<!-- Academic Summary Section -->
<section class="summary-section">
    <div class="container">
        <h1>Computer Science Academics</h1>
        <p class="lead">
            The Computer Science Division at our university is committed to providing world-class
            education and fostering groundbreaking research. Our programs span from undergraduate to
            doctoral levels, designed to prepare students for successful careers in technology and
            innovation.
        </p>
        <div class="summary-grid">
            <div class="stat">
                <h3>15+</h3>
                <p>Specialized Programs</p>
            </div>
            <div class="stat">
                <h3>100+</h3>
                <p>Faculty Members</p>
            </div>
            <div class="stat">
                <h3>2000+</h3>
                <p>Active Students</p>
            </div>
            <div class="stat">
                <h3>50+</h3>
                <p>Research Groups</p>
            </div>
        </div>
    </div>
</section>

<!-- Student Resources & Testimonials Section -->
<section class="resources-testimonials-section">
    <div class="container">
        <div class="resources-testimonials-grid">
            <!-- Student Resources Cards -->
            <div class="resources-column">
                <div class="resources-grid">
                    {#each studentResources as resource (resource.title)}
                        <div class="resource-card">
                            <h2>{resource.title}</h2>
                            <p class="description">{resource.description}</p>
                            <nav class="links-list">
                                {#each resource.links as link (link.label)}
                                    <a href={link.href} class="resource-link">
                                        <span class="arrow">→</span>
                                        {link.label}
                                    </a>
                                {/each}
                            </nav>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Testimonials Section -->
            <div class="testimonials-column">
                <h2>Faculty Voices</h2>
                <div class="testimonials-container">
                    {#each professorTestimonials as prof (prof.name)}
                        <div class="testimonial-card">
                            <div class="testimonial-header">
                                <img src={prof.image} alt={prof.name} class="prof-image" />
                                <div class="prof-info">
                                    <h3>{prof.name}</h3>
                                    <p class="prof-title">{prof.title}</p>
                                </div>
                            </div>
                            <p class="testimonial-text">"{prof.testimonial}"</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Academic Areas Section -->
<section class="academic-areas-section">
    <div class="container">
        <h2>Academic Pathways</h2>
        <p class="section-subtitle">Choose your path to success in computer science</p>
        <div class="areas-grid">
            {#each academicAreas as area (area.slug)}
                <a href={area.href} class="academic-card">
                    <div class="card-content">
                        <h3>{area.name}</h3>
                        <p>{area.description}</p>
                        <div class="card-footer">
                            <span class="learn-more">Learn More →</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* Summary Section */
    .summary-section {
        background: #61223b;
        color: white;
        padding: 4rem 0;
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
            max-width: 800px;
            margin: 0 auto 3rem;
            line-height: 1.6;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin-top: 2rem;

            .stat {
                h3 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    font-size: 1rem;
                    opacity: 0.95;
                }
            }
        }
    }

    /* Resources & Testimonials Section */
    .resources-testimonials-section {
        padding: 4rem 0;
        background: #f8f9fa;

        .resources-testimonials-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: start;

            @media (max-width: 1024px) {
                grid-template-columns: 1fr;
                gap: 2rem;
            }
        }

        h2 {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #333;
        }
    }

    /* Resources Column */
    .resources-column {
        .resources-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }
    }

    .resource-card {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-2px);
        }

        h2 {
            font-size: 1.5rem;
            margin-bottom: 0.75rem;
            color: #61223b;
        }

        .description {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.6;
        }

        .links-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .resource-link {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #d22730;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s ease;

            .arrow {
                display: inline-block;
                transition: transform 0.2s ease;
            }

            &:hover {
                color: #61223b;

                .arrow {
                    transform: translateX(4px);
                }
            }
        }
    }

    /* Testimonials Column */
    .testimonials-column {
        .testimonials-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
    }

    .testimonial-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .testimonial-header {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            align-items: flex-start;
        }

        .prof-image {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #d22730;
        }

        .prof-info {
            flex: 1;

            h3 {
                font-size: 1rem;
                margin: 0;
                color: #333;
            }

            .prof-title {
                font-size: 0.85rem;
                color: #d22730;
                margin: 0.25rem 0 0 0;
                font-weight: 500;
            }
        }

        .testimonial-text {
            color: #555;
            line-height: 1.6;
            font-style: italic;
            margin: 0;
            font-size: 0.95rem;
        }
    }

    /* Academic Areas Section */
    .academic-areas-section {
        padding: 4rem 0;

        h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #333;
        }

        .section-subtitle {
            color: #666;
            font-size: 1.2rem;
            margin-bottom: 3rem;
        }
    }

    .areas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }

    .academic-card {
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        text-decoration: none;
        border: 2px solid transparent;
        min-height: 250px;

        &:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            transform: translateY(-4px);
            border-color: #d22730;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        h3 {
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            color: #333;
        }

        p {
            color: #666;
            line-height: 1.6;
            margin: 0 0 1rem 0;
            flex: 1;
        }

        .card-footer {
            margin-top: auto;
        }

        .learn-more {
            color: #d22730;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            transition: all 0.2s ease;
        }

        &:hover .learn-more {
            color: #61223b;
            gap: 0.5rem;
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .summary-section {
            h1 {
                font-size: 2.5rem;
            }

            .lead {
                font-size: 1rem;
            }
        }

        .academic-areas-section {
            h2 {
                font-size: 2rem;
            }
        }

        .areas-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
