<script lang="ts">
    import { modulesData } from '$lib/academics/undergraduate/modules';
    import {
        getAllCourses,
        getCoreCourses,
        getCoursesByStream,
        sortCoursesByCode
    } from '$lib/courses';
    import type { Course } from '$lib/courses';

    let allCourses: Course[] = [];
    let coreCourses: Course[] = [];
    let coursesByStream: Record<string, Course[]> = {};

    async function loadCourses() {
        allCourses = await getAllCourses();
        // Filter for undergraduate courses
        const undergraduateCourses = allCourses.filter((c) => c.programme === 'undergraduate');
        coreCourses = sortCoursesByCode(getCoreCourses(undergraduateCourses));
        coursesByStream = getCoursesByStream(undergraduateCourses);
    }

    loadCourses();
</script>

<div class="modules-page">
    <section class="hero-section">
        <div class="container">
            <h1>{modulesData.title}</h1>
            <p class="lead">{modulesData.summary}</p>
        </div>
    </section>

    <section class="content-section">
        <div class="container">
            <div class="module-categories">
                <div class="category">
                    <h2>Core Modules</h2>
                    <p class="category-desc">
                        Essential foundational courses required for all undergraduate students.
                    </p>
                    <div class="module-list">
                        {#each coreCourses as course (course.code)}
                            <a href={course.link} class="module-card">
                                <div class="module-header">
                                    <div>
                                        <h3>{course.code} - {course.title}</h3>
                                        <p class="module-description">{course.description}</p>
                                    </div>
                                    <div class="module-tags">
                                        <span class="tag tag-core">Core</span>
                                        <span class="tag tag-undergraduate">Undergraduate</span>
                                    </div>
                                </div>
                            </a>
                        {/each}
                    </div>
                </div>

                <div class="category">
                    <h2>Elective Streams</h2>
                    <p class="category-desc">
                        Specialized tracks allowing students to focus on areas of interest.
                    </p>

                    {#each Object.entries(coursesByStream) as [streamName, streamCourses] (streamName)}
                        <div class="stream">
                            <h3>{streamName}</h3>
                            <div class="module-list">
                                {#each sortCoursesByCode(streamCourses) as course (course.code)}
                                    <a href={course.link} class="module-card">
                                        <div class="module-header">
                                            <div>
                                                <h4>{course.code} - {course.title}</h4>
                                                <p class="module-description">
                                                    {course.description}
                                                </p>
                                            </div>
                                            <div class="module-tags">
                                                <span class="tag tag-elective">Elective</span>
                                                <span class="tag tag-undergraduate"
                                                    >Undergraduate</span
                                                >
                                            </div>
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        </div>
                    {/each}
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

        .module-categories {
            display: flex;
            flex-direction: column;
            gap: 4rem;
        }

        .category {
            h2 {
                font-size: 2rem;
                color: $primary-color;
                margin-bottom: 1rem;
            }

            .category-desc {
                color: $text-color;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
        }

        .module-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .module-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px $shadow-color;
            transition: all 0.3s ease;
            text-decoration: none;
            display: block;
            border: 2px solid transparent;

            &:hover {
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px);
                border-color: $accent-color;
            }

            .module-header {
                padding: 1.75rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1.5rem;

                @media (max-width: 768px) {
                    flex-direction: column;
                    gap: 1rem;
                }
            }

            h3,
            h4 {
                color: $primary-color;
                font-size: 1.25rem;
                margin: 0 0 0.75rem 0;
                font-weight: 600;
                transition: color 0.2s ease;
            }

            &:hover h3,
            &:hover h4 {
                color: $accent-color;
            }

            .module-description {
                color: $text-color;
                margin: 0;
                line-height: 1.6;
                font-size: 0.95rem;
            }

            .module-tags {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
                flex-shrink: 0;
            }

            .tag {
                padding: 0.4rem 0.8rem;
                border-radius: 6px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                white-space: nowrap;

                &.tag-core {
                    background: rgba(210, 39, 48, 0.1);
                    color: $accent-color;
                }

                &.tag-elective {
                    background: rgba(202, 162, 88, 0.1);
                    color: $secondary-color;
                }

                &.tag-undergraduate {
                    background: rgba(97, 34, 59, 0.1);
                    color: $primary-color;
                }
            }
        }

        .stream {
            margin-bottom: 2.5rem;

            h3 {
                font-size: 1.5rem;
                color: $primary-color;
                margin-bottom: 1.5rem;
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

            .category h2 {
                font-size: 1.5rem;
            }

            .module-card {
                .module-header {
                    padding: 1.25rem;
                }

                h3,
                h4 {
                    font-size: 1.1rem;
                }
            }
        }

        .container {
            padding: 0 1rem;
        }
    }
</style>
