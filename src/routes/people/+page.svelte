<script lang="ts">
    import { getPeopleByType, filterPeopleByName } from '$lib/people';
    import { resolve } from '$app/paths';

    let searchQuery = '';

    let staff = getPeopleByType('staff');
    let students = getPeopleByType('student');
    let alumni = getPeopleByType('alumni');

    $: filteredStaff = filterPeopleByName(staff, searchQuery);
    $: filteredStudents = filterPeopleByName(students, searchQuery);
    $: filteredAlumni = filterPeopleByName(alumni, searchQuery);

    function handleSearch(e: Event) {
        const target = e.target as HTMLInputElement;
        searchQuery = target.value;
    }
</script>

<div class="people-page">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1>Our People</h1>
            <p class="subtitle">
                Meet the dedicated faculty, talented students, and accomplished alumni who make our
                Computer Science department a world-class institution
            </p>
        </div>
    </section>

    <!-- Search Controls -->
    <section class="controls-section">
        <div class="container">
            <div class="search-controls">
                <input
                    type="text"
                    placeholder="Search by name or title..."
                    class="search-input"
                    value={searchQuery}
                    oninput={handleSearch}
                />
                <p class="results-count">
                    {filteredStaff.length + filteredStudents.length + filteredAlumni.length} result(s)
                </p>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <section class="content-section">
        <div class="container">
            <div class="people-content">
                <!-- Staff Section -->
                <div class="people-section">
                    <h2 class="section-heading">Faculty & Staff</h2>
                    {#if filteredStaff.length > 0}
                        <div class="people-grid">
                            {#each filteredStaff as member (member.slug)}
                                <a href={resolve(`/people/${member.slug}`)} class="person-card">
                                    <div class="card-image">
                                        <img src={member.image} alt={member.name} />
                                    </div>

                                    <div class="card-content">
                                        <h3 class="person-name">{member.name}</h3>
                                        <p class="person-title">{member.title}</p>

                                        <span
                                            class="person-email"
                                            role="button"
                                            tabindex="0"
                                            onclick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.location.href = `mailto:${member.email}`;
                                            }}
                                            onkeydown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${member.email}`;
                                                }
                                            }}>{member.email}</span
                                        >

                                        <div class="about-section">
                                            <p class="about-text">{member.about}</p>
                                        </div>

                                        <span class="view-profile">View Profile →</span>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No staff members match your search.</p>
                    {/if}
                </div>

                <!-- Students Section -->
                <div class="people-section">
                    <h2 class="section-heading">Students</h2>
                    {#if filteredStudents.length > 0}
                        <div class="people-grid">
                            {#each filteredStudents as member (member.slug)}
                                <a href={resolve(`/people/${member.slug}`)} class="person-card">
                                    <div class="card-image">
                                        <img src={member.image} alt={member.name} />
                                    </div>

                                    <div class="card-content">
                                        <h3 class="person-name">{member.name}</h3>
                                        <p class="person-title">{member.title}</p>

                                        <span
                                            class="person-email"
                                            role="button"
                                            tabindex="0"
                                            onclick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.location.href = `mailto:${member.email}`;
                                            }}
                                            onkeydown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${member.email}`;
                                                }
                                            }}>{member.email}</span
                                        >

                                        <div class="about-section">
                                            <p class="about-text">{member.about}</p>
                                        </div>

                                        <span class="view-profile">View Profile →</span>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No students match your search.</p>
                    {/if}
                </div>

                <!-- Alumni Section -->
                <div class="people-section">
                    <h2 class="section-heading">Alumni</h2>
                    {#if filteredAlumni.length > 0}
                        <div class="people-grid">
                            {#each filteredAlumni as member (member.slug)}
                                <a href={resolve(`/people/${member.slug}`)} class="person-card">
                                    <div class="card-image">
                                        <img src={member.image} alt={member.name} />
                                    </div>

                                    <div class="card-content">
                                        <h3 class="person-name">{member.name}</h3>
                                        <p class="person-title">{member.title}</p>

                                        <span
                                            class="person-email"
                                            role="button"
                                            tabindex="0"
                                            onclick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                window.location.href = `mailto:${member.email}`;
                                            }}
                                            onkeydown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    window.location.href = `mailto:${member.email}`;
                                                }
                                            }}>{member.email}</span
                                        >

                                        <div class="about-section">
                                            <p class="about-text">{member.about}</p>
                                        </div>

                                        <span class="view-profile">View Profile →</span>
                                    </div>
                                </a>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No alumni match your search.</p>
                    {/if}
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

    .people-page {
        background: #f8f9fa;
        min-height: 100vh;
    }

    /* Hero Section */
    .hero-section {
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
            font-size: 3rem;
            font-weight: 700;
            margin: 0 0 1rem 0;
        }

        .subtitle {
            margin: 0;
            font-size: 1.125rem;
            line-height: 1.6;
            opacity: 0.95;
            max-width: 700px;
            margin: 0 auto;
        }
    }

    /* Search Controls */
    .controls-section {
        padding: 2rem 0 0 0;
    }

    .search-controls {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .search-input {
        flex: 1;
        min-width: 250px;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 8px;
        font-family: inherit;

        &::placeholder {
            color: #999;
        }

        &:focus {
            outline: none;
            border-color: #d22730;
            box-shadow: 0 0 0 3px rgba(210, 39, 48, 0.15);
        }
    }

    .results-count {
        font-size: 0.875rem;
        color: #666;
        margin: 0;
        white-space: nowrap;
    }

    /* Content Section */
    .content-section {
        padding: 3rem 0;
    }

    .people-content {
        display: flex;
        flex-direction: column;
        gap: 4rem;
    }

    .people-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .section-heading {
        font-size: 2rem;
        margin: 0;
        color: #61223b;
        padding-bottom: 1rem;
        border-bottom: 3px solid #d22730;
        font-weight: 700;
    }

    /* People Grid */
    .people-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 2rem;
    }

    /* Person Card */
    .person-card {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        border: 2px solid transparent;

        &:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            transform: translateY(-4px);
            border-color: #d22730;
        }
    }

    .card-image {
        width: 100%;
        height: 280px;
        overflow: hidden;
        background: #f5f5f5;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
    }

    .person-card:hover .card-image img {
        transform: scale(1.05);
    }

    .card-content {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .person-name {
        font-size: 1.25rem;
        margin: 0 0 0.5rem 0;
        color: #333;
        font-weight: 700;
    }

    .person-title {
        font-size: 0.875rem;
        color: #d22730;
        font-weight: 600;
        margin: 0 0 1rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .person-email {
        font-size: 0.875rem;
        color: #61223b;
        text-decoration: none;
        margin-bottom: 1rem;
        display: inline-block;
        transition: color 0.2s ease;
        cursor: pointer;

        &:hover {
            color: #d22730;
            text-decoration: underline;
        }
    }

    .about-section {
        flex: 1;
        margin-bottom: 1rem;
    }

    .about-text {
        font-size: 0.9rem;
        line-height: 1.6;
        color: #666;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .view-profile {
        font-size: 0.875rem;
        color: #d22730;
        font-weight: 600;
        transition: all 0.2s ease;
        display: inline-block;
    }

    .person-card:hover .view-profile {
        transform: translateX(4px);
    }

    .no-results {
        font-size: 1rem;
        color: #999;
        text-align: center;
        padding: 3rem 2rem;
        background: white;
        border-radius: 12px;
        margin: 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .people-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
    }

    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 0;

            h1 {
                font-size: 2.25rem;
            }

            .subtitle {
                font-size: 1rem;
            }
        }

        .controls-section {
            padding: 1.5rem 0 0 0;
        }

        .search-controls {
            padding: 1rem;
            flex-direction: column;
            align-items: flex-start;
        }

        .search-input {
            width: 100%;
        }

        .content-section {
            padding: 2rem 0;
        }

        .people-content {
            gap: 3rem;
        }

        .section-heading {
            font-size: 1.5rem;
        }

        .people-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        .card-image {
            height: 240px;
        }

        .card-content {
            padding: 1.25rem;
        }

        .container {
            padding: 0 1.5rem;
        }
    }
</style>
