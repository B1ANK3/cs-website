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
        <div class="hero-image" style="background-image: url({modulesData.frontImage})">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <div class="container">
                    <h1>{modulesData.title}</h1>
                    <p class="lead">{modulesData.summary}</p>
                </div>
            </div>
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
                    <ul class="module-list">
                        {#each coreCourses as course (course.code)}
                            <li>
                                <a href={course.link} class="course-link">
                                    <strong>{course.code} - {course.title}</strong>
                                    <p>{course.description}</p>
                                </a>
                            </li>
                        {/each}
                    </ul>
                </div>

                <div class="category">
                    <h2>Elective Streams</h2>
                    <p class="category-desc">
                        Specialized tracks allowing students to focus on areas of interest.
                    </p>

                    {#each Object.entries(coursesByStream) as [streamName, streamCourses] (streamName)}
                        <div class="stream">
                            <h3>{streamName}</h3>
                            <ul class="module-list">
                                {#each sortCoursesByCode(streamCourses) as course (course.code)}
                                    <li>
                                        <a href={course.link} class="course-link">
                                            <strong>{course.code} - {course.title}</strong>
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    {/each}
                </div>
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
        position: relative;
        height: 400px;
        overflow: hidden;

        .hero-image {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            position: relative;

            .hero-overlay {
                position: absolute;
                inset: 0;
                background: rgba(97, 34, 59, 0.9);
            }
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #d22730;
            z-index: 10;
        }

        .hero-content {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;

            h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                font-weight: 700;
            }

            .lead {
                font-size: 1.2rem;
                max-width: 800px;
                line-height: 1.6;
            }
        }
    }

    .content-section {
        padding: 4rem 0;

        .module-categories {
            display: flex;
            flex-direction: column;
            gap: 4rem;
        }

        .category {
            h2 {
                font-size: 2rem;
                color: #333;
                margin-bottom: 1rem;
            }

            .category-desc {
                color: #666;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
        }

        .module-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            li {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;

                &:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transform: translateX(4px);
                }

                .course-link {
                    display: block;
                    padding: 1.5rem;
                    text-decoration: none;
                    color: inherit;

                    &:hover {
                        text-decoration: none;
                    }
                }

                strong {
                    color: #d22730;
                    font-size: 1.1rem;
                    display: block;
                    margin-bottom: 0.5rem;
                    transition: color 0.2s ease;
                }

                &:hover strong {
                    color: #a01f28;
                }

                p {
                    color: #666;
                    margin: 0;
                    line-height: 1.5;
                }
            }
        }

        .stream {
            margin-bottom: 2.5rem;

            h3 {
                font-size: 1.3rem;
                color: #333;
                margin-bottom: 1rem;
            }

            .module-list li {
                .course-link {
                    padding: 1rem;
                }

                strong {
                    font-size: 1rem;
                }
            }
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            height: 300px;

            .hero-content {
                h1 {
                    font-size: 2rem;
                }

                .lead {
                    font-size: 1rem;
                }
            }
        }

        .content-section {
            padding: 2rem 0;

            .category h2 {
                font-size: 1.5rem;
            }
        }
    }
</style>
