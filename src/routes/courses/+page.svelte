<script lang="ts">
    import {
        getAllCourses,
        sortCoursesByCode,
        type Course,
        type CourseType,
        type Stream,
        type Semester
    } from '$lib/courses';

    let allCourses: Course[] = $state([]);
    let filteredCourses: Course[] = $state([]);
    let searchQuery = $state('');
    let selectedType = $state<CourseType | 'all'>('all');
    let selectedStream = $state<Stream | 'all'>('all');
    let selectedSemester = $state<Semester | 'all'>('all');

    // Get unique values for filters
    let availableStreams: Stream[] = $derived(
        Array.from(new Set(allCourses.map((c) => c.stream).filter(Boolean))) as Stream[]
    );
    let availableSemesters: Semester[] = $derived(
        Array.from(new Set(allCourses.map((c) => c.semester).filter(Boolean))) as Semester[]
    );

    async function loadCourses() {
        allCourses = await getAllCourses();
        allCourses = sortCoursesByCode(allCourses);
        filterCourses();
    }

    function filterCourses() {
        let results = allCourses;

        // Search filter (code, title, description, professor)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(
                (course) =>
                    course.code.toLowerCase().includes(query) ||
                    course.title.toLowerCase().includes(query) ||
                    course.description.toLowerCase().includes(query) ||
                    course.professor?.toLowerCase().includes(query)
            );
        }

        // Type filter
        if (selectedType !== 'all') {
            results = results.filter((course) => course.type === selectedType);
        }

        // Stream filter
        if (selectedStream !== 'all') {
            results = results.filter((course) => course.stream === selectedStream);
        }

        // Semester filter
        if (selectedSemester !== 'all') {
            results = results.filter((course) => course.semester === selectedSemester);
        }

        filteredCourses = results;
    }

    function handleSearchInput() {
        filterCourses();
    }

    function resetFilters() {
        searchQuery = '';
        selectedType = 'all';
        selectedStream = 'all';
        selectedSemester = 'all';
        filterCourses();
    }

    loadCourses();

    $effect(() => {
        filterCourses();
    });
</script>

<svelte:head>
    <title>Courses | CS Department</title>
    <meta
        name="description"
        content="Browse all Computer Science courses with detailed information about curriculum, professors, and schedules."
    />
</svelte:head>

<div class="courses-page">
    <section class="hero-section">
        <div class="container">
            <h1>Course Catalog</h1>
            <p class="lead">
                Explore our comprehensive range of Computer Science courses. Filter by type,
                specialization stream, or semester to find the perfect courses for your academic
                journey.
            </p>
        </div>
    </section>

    <section class="courses-content">
        <div class="container">
            <div class="courses-layout">
                <!-- Sidebar Filters -->
                <aside class="filters-sidebar">
                    <div class="filters-header">
                        <h2>Filters</h2>
                        <button class="reset-btn" onclick={resetFilters}>Reset</button>
                    </div>

                    <!-- Search -->
                    <div class="filter-section">
                        <label for="search">Search</label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Course code, name, or professor..."
                            bind:value={searchQuery}
                            oninput={handleSearchInput}
                        />
                    </div>

                    <!-- Course Type Filter -->
                    <div class="filter-section">
                        <fieldset>
                            <legend>Course Type</legend>
                            <div class="radio-group">
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="all"
                                        bind:group={selectedType}
                                    />
                                    All Courses
                                </label>
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="core"
                                        bind:group={selectedType}
                                    />
                                    Core Modules
                                </label>
                                <label class="radio-label">
                                    <input
                                        type="radio"
                                        name="type"
                                        value="elective"
                                        bind:group={selectedType}
                                    />
                                    Electives
                                </label>
                            </div>
                        </fieldset>
                    </div>

                    <!-- Stream Filter -->
                    {#if availableStreams.length > 0}
                        <div class="filter-section">
                            <label for="stream">Specialization Stream</label>
                            <select id="stream" bind:value={selectedStream}>
                                <option value="all">All Streams</option>
                                {#each availableStreams as stream (stream)}
                                    <option value={stream}>{stream}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}

                    <!-- Semester Filter -->
                    {#if availableSemesters.length > 0}
                        <div class="filter-section">
                            <label for="semester">Semester</label>
                            <select id="semester" bind:value={selectedSemester}>
                                <option value="all">All Semesters</option>
                                {#each availableSemesters as semester (semester)}
                                    <option value={semester}>{semester}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}

                    <!-- Results count -->
                    <div class="results-count">
                        {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    </div>
                </aside>

                <!-- Course List -->
                <main class="courses-list">
                    {#if filteredCourses.length === 0}
                        <div class="no-results">
                            <p>No courses found matching your criteria.</p>
                            <button class="reset-btn" onclick={resetFilters}>Reset Filters</button>
                        </div>
                    {:else}
                        {#each filteredCourses as course (course.code)}
                            <a href={course.link} class="course-card">
                                <div class="course-header">
                                    <div class="course-code-title">
                                        <span class="course-code">{course.code}</span>
                                        <h3 class="course-title">{course.title}</h3>
                                    </div>
                                    <span class="course-badge badge-{course.type}"
                                        >{course.type}</span
                                    >
                                </div>

                                <p class="course-description">{course.description}</p>

                                <div class="course-meta">
                                    {#if course.professor}
                                        <div class="meta-item">
                                            <span class="meta-label">Professor:</span>
                                            <span class="meta-value">{course.professor}</span>
                                        </div>
                                    {/if}
                                    {#if course.semester}
                                        <div class="meta-item">
                                            <span class="meta-label">Semester:</span>
                                            <span class="meta-value">{course.semester}</span>
                                        </div>
                                    {/if}
                                    {#if course.stream}
                                        <div class="meta-item">
                                            <span class="meta-label">Stream:</span>
                                            <span class="meta-value">{course.stream}</span>
                                        </div>
                                    {/if}
                                </div>
                            </a>
                        {/each}
                    {/if}
                </main>
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    .courses-page {
        min-height: 100vh;
        background: #f8f9fa;
    }

    .hero-section {
        background: linear-gradient(135deg, #61223b 0%, #8b2f4a 100%);
        color: white;
        padding: 4rem 0 3rem;
        border-bottom: 4px solid #d22730;

        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }

        .lead {
            font-size: 1.2rem;
            line-height: 1.6;
            max-width: 800px;
            opacity: 0.95;
        }
    }

    .courses-content {
        padding: 3rem 0;
    }

    .courses-layout {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 2rem;
        align-items: start;
    }

    /* Sidebar Filters */
    .filters-sidebar {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: sticky;
        top: 2rem;

        .filters-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;

            h2 {
                font-size: 1.5rem;
                color: #333;
                margin: 0;
            }
        }

        .filter-section {
            margin-bottom: 1.5rem;

            label,
            legend {
                display: block;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }

            fieldset {
                border: none;
                padding: 0;
                margin: 0;
            }

            input[type='text'] {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 0.95rem;
                transition: border-color 0.2s;

                &:focus {
                    outline: none;
                    border-color: #d22730;
                }
            }

            select {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 0.95rem;
                background: white;
                cursor: pointer;
                transition: border-color 0.2s;

                &:focus {
                    outline: none;
                    border-color: #d22730;
                }
            }
        }

        .radio-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .radio-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: normal;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 4px;
                transition: background 0.2s;

                &:hover {
                    background: #f8f9fa;
                }

                input[type='radio'] {
                    cursor: pointer;
                }
            }
        }

        .results-count {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 0.9rem;
            text-align: center;
        }
    }

    .reset-btn {
        background: none;
        border: 1px solid #d22730;
        color: #d22730;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        font-weight: 500;

        &:hover {
            background: #d22730;
            color: white;
        }
    }

    /* Course List */
    .courses-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .no-results {
        background: white;
        padding: 3rem;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        p {
            color: #666;
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
        }
    }

    .course-card {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: inherit;
        transition: all 0.3s ease;
        border-left: 4px solid transparent;

        &:hover {
            transform: translateX(4px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border-left-color: #d22730;
        }

        .course-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
            gap: 1rem;
        }

        .course-code-title {
            flex: 1;
        }

        .course-code {
            display: inline-block;
            font-weight: 600;
            color: #d22730;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            margin-bottom: 0.5rem;
        }

        .course-title {
            font-size: 1.5rem;
            color: #333;
            margin: 0;
            font-weight: 600;
            line-height: 1.3;
        }

        .course-badge {
            padding: 0.4rem 0.8rem;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: capitalize;
            white-space: nowrap;

            &.badge-core {
                background: #4caf50;
                color: white;
            }

            &.badge-elective {
                background: #2196f3;
                color: white;
            }
        }

        .course-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            font-size: 1rem;
        }

        .course-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #e0e0e0;

            .meta-item {
                display: flex;
                gap: 0.5rem;
                font-size: 0.9rem;

                .meta-label {
                    color: #999;
                    font-weight: 500;
                }

                .meta-value {
                    color: #333;
                    font-weight: 600;
                }
            }
        }
    }

    @media (max-width: 1024px) {
        .courses-layout {
            grid-template-columns: 1fr;
        }

        .filters-sidebar {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 0 2rem;

            h1 {
                font-size: 2rem;
            }

            .lead {
                font-size: 1rem;
            }
        }

        .filters-sidebar {
            padding: 1.5rem;
        }

        .course-card {
            padding: 1.5rem;

            .course-header {
                flex-direction: column;
            }

            .course-title {
                font-size: 1.2rem;
            }

            .course-meta {
                flex-direction: column;
                gap: 0.75rem;
            }
        }
    }
</style>
