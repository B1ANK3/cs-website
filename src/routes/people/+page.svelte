<script lang="ts">
    import { getPeopleByType, filterPeopleByName, type Person } from '$lib/people';

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

<!-- Meet the Staff Section -->
<section class="section">
    <div class="section-container">
        <div class="people-layout">
            <!-- Search Bar on Left -->
            <aside class="search-sidebar">
                <div class="search-container">
                    <h3 class="search-title">Search</h3>
                    <input
                        type="text"
                        placeholder="Search by name or title..."
                        class="search-input"
                        value={searchQuery}
                        on:input={handleSearch}
                    />
                    <p class="search-hint">
                        Showing {filteredStaff.length +
                            filteredStudents.length +
                            filteredAlumni.length} result(s)
                    </p>
                </div>
            </aside>

            <!-- Main Content on Right -->
            <main class="people-content">
                <!-- Staff Section -->
                <div class="people-section">
                    <h2 class="section-subheading">Staff</h2>
                    {#if filteredStaff.length > 0}
                        <div class="staff-grid">
                            {#each filteredStaff as member (member.slug)}
                                <div class="staff-card">
                                    <a href="/people/{member.slug}" class="card-link">
                                        <div class="card-image">
                                            <img src={member.image} alt={member.name} />
                                        </div>

                                        <div class="card-content">
                                            <h3 class="staff-name">{member.name}</h3>
                                            <p class="staff-title">{member.title}</p>

                                            <div class="divider"></div>

                                            <span
                                                class="staff-email"
                                                role="button"
                                                tabindex="0"
                                                on:click|stopPropagation={() =>
                                                    (window.location.href = `mailto:${member.email}`)}
                                                on:keydown|stopPropagation={(e) =>
                                                    e.key === 'Enter' &&
                                                    (window.location.href = `mailto:${member.email}`)}
                                                >{member.email}</span
                                            >

                                            <div class="about-section">
                                                <h4 class="about-heading">About</h4>
                                                <p class="about-text">{member.about}</p>
                                            </div>

                                            <span class="profile-link">View Profile →</span>
                                        </div>
                                    </a>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No staff members match your search.</p>
                    {/if}
                </div>

                <!-- Students Section -->
                <div class="people-section">
                    <h2 class="section-subheading">Students</h2>
                    {#if filteredStudents.length > 0}
                        <div class="staff-grid">
                            {#each filteredStudents as member (member.slug)}
                                <div class="staff-card">
                                    <a href="/people/{member.slug}" class="card-link">
                                        <div class="card-image">
                                            <img src={member.image} alt={member.name} />
                                        </div>

                                        <div class="card-content">
                                            <h3 class="staff-name">{member.name}</h3>
                                            <p class="staff-title">{member.title}</p>

                                            <div class="divider"></div>

                                            <span
                                                class="staff-email"
                                                role="button"
                                                tabindex="0"
                                                on:click|stopPropagation={() =>
                                                    (window.location.href = `mailto:${member.email}`)}
                                                on:keydown|stopPropagation={(e) =>
                                                    e.key === 'Enter' &&
                                                    (window.location.href = `mailto:${member.email}`)}
                                                >{member.email}</span
                                            >

                                            <div class="about-section">
                                                <h4 class="about-heading">About</h4>
                                                <p class="about-text">{member.about}</p>
                                            </div>

                                            <span class="profile-link">View Profile →</span>
                                        </div>
                                    </a>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No students match your search.</p>
                    {/if}
                </div>

                <!-- Alumni Section -->
                <div class="people-section">
                    <h2 class="section-subheading">Alumni</h2>
                    {#if filteredAlumni.length > 0}
                        <div class="staff-grid">
                            {#each filteredAlumni as member (member.slug)}
                                <div class="staff-card">
                                    <a href="/people/{member.slug}" class="card-link">
                                        <div class="card-image">
                                            <img src={member.image} alt={member.name} />
                                        </div>

                                        <div class="card-content">
                                            <h3 class="staff-name">{member.name}</h3>
                                            <p class="staff-title">{member.title}</p>

                                            <div class="divider"></div>

                                            <span
                                                class="staff-email"
                                                role="button"
                                                tabindex="0"
                                                on:click|stopPropagation={() =>
                                                    (window.location.href = `mailto:${member.email}`)}
                                                on:keydown|stopPropagation={(e) =>
                                                    e.key === 'Enter' &&
                                                    (window.location.href = `mailto:${member.email}`)}
                                                >{member.email}</span
                                            >

                                            <div class="about-section">
                                                <h4 class="about-heading">About</h4>
                                                <p class="about-text">{member.about}</p>
                                            </div>

                                            <span class="profile-link">View Profile →</span>
                                        </div>
                                    </a>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="no-results">No alumni match your search.</p>
                    {/if}
                </div>
            </main>
        </div>
    </div>
</section>

<style lang="scss">
    @import '$lib/styles/globals.scss';

    .section {
        width: 100%;
        padding: 80px 20px;
        background-color: #ffffff;
    }

    .section-container {
        max-width: $max-width;
        margin: 0 auto;
        width: 100%;
    }

    .people-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 40px;
    }

    .search-sidebar {
        position: sticky;
        top: 100px;
        height: fit-content;
    }

    .search-container {
        background-color: $light-bg;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid $border-color;
    }

    .search-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 15px 0;
        color: $text-color;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .search-input {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid $border-color;
        border-radius: 6px;
        font-size: 14px;
        font-family: inherit;
        @include smooth-transition(all);
        background-color: $light-bg;
        color: $text-color;

        &:focus {
            outline: none;
            border-color: $primary-color;
            box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
        }

        &::placeholder {
            color: #999;
        }
    }

    .search-hint {
        font-size: 12px;
        color: #999;
        margin: 12px 0 0 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .people-content {
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

    .people-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .section-subheading {
        font-size: 32px;
        margin: 0;
        color: $text-color;
        padding-bottom: 15px;
        border-bottom: 2px solid $border-color;
    }

    .staff-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 40px;
        width: 100%;
    }

    .staff-card {
        background-color: #ffffff;
        border: 1px solid $border-color;
        border-radius: 8px;
        overflow: hidden;
        @include smooth-transition(all);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        &:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transform: translateY(-4px);
        }
    }

    .card-link {
        display: flex;
        flex-direction: column;
        height: 100%;
        text-decoration: none;
        color: inherit;
    }

    .card-image {
        width: 100%;
        height: 250px;
        overflow: hidden;
        background-color: $light-bg;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            @include smooth-transition(transform);
        }
    }

    .staff-card:hover .card-image img {
        transform: scale(1.05);
    }

    .card-content {
        padding: 30px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .staff-name {
        font-size: 22px;
        margin: 0 0 8px 0;
        color: $text-color;
    }

    .staff-title {
        font-size: 14px;
        color: $primary-color;
        font-weight: 600;
        margin: 0 0 15px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .divider {
        height: 1px;
        background-color: $border-color;
        margin: 15px 0;
    }

    .staff-email {
        font-size: 14px;
        color: $primary-color;
        text-decoration: none;
        @include smooth-transition(all);

        &:hover {
            text-decoration: underline;
        }
    }

    .about-section {
        margin: 15px 0;
        flex: 1;
    }

    .about-heading {
        font-size: 12px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 8px 0;
        font-weight: 600;
    }

    .about-text {
        font-size: 14px;
        line-height: 1.6;
        color: #666;
        margin: 0;
    }

    .profile-link {
        font-size: 14px;
        color: $primary-color;
        text-decoration: none;
        font-weight: 600;
        margin-top: 15px;
        @include smooth-transition(all);
        display: inline-block;
    }

    .staff-card:hover .profile-link {
        color: darken($primary-color, 10%);
        transform: translateX(4px);
    }

    .no-results {
        font-size: 16px;
        color: #999;
        text-align: center;
        padding: 40px 20px;
        background-color: $light-bg;
        border-radius: 8px;
    }

    // Responsive
    @media (max-width: $tablet-breakpoint) {
        .people-layout {
            grid-template-columns: 1fr;
            gap: 30px;
        }

        .search-sidebar {
            position: static;
        }

        .staff-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
        }

        .section-subheading {
            font-size: 24px;
        }

        .people-content {
            gap: 50px;
        }
    }

    @media (max-width: $mobile-breakpoint) {
        .section {
            padding: 60px 20px;
        }

        .staff-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .section-subheading {
            font-size: 20px;
            margin-bottom: 15px;
        }

        .card-content {
            padding: 20px;
        }

        .staff-name {
            font-size: 18px;
        }

        .about-text {
            font-size: 13px;
        }

        .people-content {
            gap: 40px;
        }

        .search-container {
            padding: 15px;
        }

        .search-title {
            font-size: 14px;
        }
    }
</style>
