<script lang="ts">
    import type { Course } from '$lib/courses';
    import { resolve } from '$app/paths';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    const course = $derived(data.course as Course);
    const CourseComponent = $derived(course.component);
</script>

<svelte:head>
    <title>{course.code} - {course.title} | CS Department</title>
    <meta name="description" content={course.description} />
</svelte:head>

<main class="course-detail-page">
    <div class="course-hero">
        <div class="container">
            <div class="breadcrumb">
                <a href={resolve('/courses')}>Courses</a>
                <span>/</span>
                <span>{course.code}</span>
            </div>
            <div class="course-header">
                <span class="course-code">{course.code}</span>
                <h1 class="course-title">{course.title}</h1>
                <p class="course-description">{course.description}</p>
            </div>
            <div class="course-meta">
                <span class="badge badge-{course.type}">{course.type}</span>
                <span class="badge badge-programme">{course.programme}</span>
                {#if course.stream}
                    <span class="badge badge-stream">{course.stream}</span>
                {/if}
            </div>
        </div>
    </div>

    <div class="course-container">
        <div class="container">
            <article class="course-content">
                <CourseComponent />
            </article>
        </div>
    </div>
</main>

<style lang="scss">
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .course-detail-page {
        min-height: 100vh;
        background: #f9f9f9;
    }

    .course-hero {
        background: linear-gradient(135deg, #61223b 0%, #8b2f4a 100%);
        color: white;
        padding: 3rem 0;
        border-bottom: 4px solid #d22730;

        .breadcrumb {
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
            opacity: 0.9;

            a {
                color: white;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }

            span {
                margin: 0 0.5rem;
            }
        }

        .course-header {
            margin-bottom: 1.5rem;
        }

        .course-code {
            display: inline-block;
            font-size: 0.9rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 0.3rem 0.8rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            margin-bottom: 1rem;
        }

        .course-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 0.5rem 0 1rem 0;
            line-height: 1.2;
        }

        .course-description {
            font-size: 1.1rem;
            line-height: 1.6;
            opacity: 0.95;
            max-width: 800px;
        }

        .course-meta {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .badge {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: capitalize;

            &.badge-core {
                background: #4caf50;
                color: white;
            }

            &.badge-elective {
                background: #2196f3;
                color: white;
            }

            &.badge-programme {
                background: rgba(255, 255, 255, 0.25);
                color: white;
            }

            &.badge-stream {
                background: #ff9800;
                color: white;
            }
        }
    }

    .course-container {
        padding: 3rem 0;
    }

    .course-content {
        background: white;
        padding: 3rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        :global(h1) {
            font-size: 2rem;
            color: #61223b;
            margin: 2rem 0 1rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #d22730;
        }

        :global(h2) {
            font-size: 1.5rem;
            color: #61223b;
            margin: 2rem 0 1rem 0;
        }

        :global(h3) {
            font-size: 1.2rem;
            color: #333;
            margin: 1.5rem 0 0.75rem 0;
        }

        :global(p) {
            line-height: 1.7;
            color: #444;
            margin-bottom: 1rem;
        }

        :global(ul),
        :global(ol) {
            margin: 1rem 0;
            padding-left: 2rem;

            :global(li) {
                line-height: 1.7;
                color: #444;
                margin-bottom: 0.5rem;
            }
        }

        :global(strong) {
            color: #d22730;
            font-weight: 600;
        }

        :global(code) {
            background: #f4f4f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
        }

        :global(pre) {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            margin: 1rem 0;

            :global(code) {
                background: none;
                padding: 0;
                color: inherit;
            }
        }

        :global(blockquote) {
            border-left: 4px solid #d22730;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #666;
            font-style: italic;
        }

        :global(a) {
            color: #d22730;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    @media (max-width: 768px) {
        .course-hero {
            padding: 2rem 0;

            .course-title {
                font-size: 1.8rem;
            }

            .course-description {
                font-size: 1rem;
            }
        }

        .course-content {
            padding: 1.5rem;

            :global(h1) {
                font-size: 1.5rem;
            }

            :global(h2) {
                font-size: 1.3rem;
            }
        }
    }
</style>
