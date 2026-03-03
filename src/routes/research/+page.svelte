<script lang="ts">
    import type { PageProps } from './$types';
    import { getGroupColor } from '$lib/research';

    const { data }: PageProps = $props();

    // Match research group members with people data
    function getMemberProfile(memberName: string) {
        return data.allPeople.find((person) => person.name === memberName);
    }

    function getInitials(name: string): string {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }
</script>

<svelte:head>
    <title>Research - CS Department</title>
    <meta
        name="description"
        content="Explore our research groups and areas of focus in Computer Science."
    />
</svelte:head>

<div class="research-page">
    <div class="research-container">
        <!-- Header -->
        <header class="research-header">
            <h1>Research Groups</h1>
            <p class="research-subtitle">Exploring cutting-edge topics in Computer Science</p>
            <p class="research-intro">
                Our department features world-class research groups focused on advancing technology
                and solving real-world problems. Learn about our research areas, meet our
                researchers, and discover how we're shaping the future of computing.
            </p>
        </header>

        <!-- Research Groups -->
        <div class="research-groups">
            {#each data.researchGroups as group, index (group.slug)}
                {@const color = getGroupColor(index)}
                <article
                    class="research-group"
                    style="--group-bg: {color.bg}; --group-border: {color.border};"
                >
                    <!-- Group Header -->
                    <div class="group-header">
                        <div class="header-content">
                            <h2 class="group-name">{group.name}</h2>
                            <p class="group-description">
                                {group.summary}
                            </p>
                        </div>
                        <div class="header-accent"></div>
                    </div>

                    <!-- Group Content -->
                    <div class="group-content">
                        <!-- Summary -->
                        <section class="group-section">
                            <h3>Overview</h3>
                            <p class="group-summary">
                                {group.description}
                            </p>
                        </section>

                        <!-- Members -->
                        <section class="group-section">
                            <h3>Research Members</h3>
                            <div class="members-grid">
                                {#each group.members as memberName (memberName)}
                                    {@const profile = getMemberProfile(memberName)}
                                    <a
                                        href={profile ? `/people/${profile.slug}` : '#'}
                                        class="member-card"
                                        class:no-profile={!profile}
                                    >
                                        <div class="member-image">
                                            {#if profile?.image}
                                                <img
                                                    src={profile.image}
                                                    alt={profile.name}
                                                    loading="lazy"
                                                />
                                            {:else}
                                                <div class="member-placeholder">
                                                    {getInitials(memberName)}
                                                </div>
                                            {/if}
                                        </div>
                                        <div class="member-info">
                                            <p class="member-name">
                                                {memberName}
                                            </p>
                                            {#if profile?.title}
                                                <p class="member-title">
                                                    {profile.title}
                                                </p>
                                            {/if}
                                        </div>
                                    </a>
                                {/each}
                            </div>
                        </section>

                        <!-- Links -->
                        {#if group.links && group.links.length > 0}
                            <section class="group-section">
                                <h3>More Information</h3>
                                <div class="links-list">
                                    {#each group.links as link (link.title)}
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="info-link"
                                        >
                                            <span class="link-icon">»</span>
                                            <span class="link-text">
                                                {link.title}
                                            </span>
                                            <span class="link-url">
                                                {link.url}
                                            </span>
                                        </a>
                                    {/each}
                                </div>
                            </section>
                        {/if}
                    </div>
                </article>
            {/each}
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .research-page {
        min-height: 100vh;
        background: $light-bg;
        padding-bottom: 40px;
    }

    .research-container {
        max-width: $max-width;
        margin: 0 auto;
        padding: 40px 20px;
    }

    /* Header */
    .research-header {
        margin-bottom: 60px;
        text-align: center;

        @media (max-width: $mobile-breakpoint) {
            margin-bottom: 40px;
        }

        h1 {
            font-size: 2.8rem;
            color: $primary-color;
            margin: 0 0 15px 0;
            font-weight: 700;

            @media (max-width: $mobile-breakpoint) {
                font-size: 2.2rem;
            }
        }
    }

    .research-subtitle {
        font-size: 1.3rem;
        color: $text-color;
        margin: 0 0 25px 0;
        font-weight: 500;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1.1rem;
        }
    }

    .research-intro {
        font-size: 1.05rem;
        color: $light-text-color;
        line-height: 1.8;
        max-width: 700px;
        margin: 0 auto;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1rem;
        }
    }

    /* Research Groups */
    .research-groups {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .research-group {
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;

        &:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            // transform: translateY(-2px);
        }
    }

    /* Group Header */
    .group-header {
        position: relative;
        padding: 40px;
        background: var(--group-bg);
        border-left: 5px solid var(--group-border);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        @media (max-width: $mobile-breakpoint) {
            padding: 30px;
            flex-direction: column;
        }
    }

    .header-content {
        flex: 1;
        min-width: 0;
    }

    .group-name {
        font-size: 2rem;
        font-weight: 700;
        color: $primary-color;
        margin: 0 0 15px 0;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1.6rem;
        }
    }

    .group-description {
        font-size: 1.1rem;
        color: $light-text-color;
        margin: 0;
        line-height: 1.6;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1rem;
        }
    }

    .header-accent {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background: radial-gradient(
            circle,
            var(--group-border) 0%,
            var(--group-border) 40%,
            transparent 70%
        );
        opacity: 0.15;
        flex-shrink: 0;

        @media (max-width: $mobile-breakpoint) {
            width: 80px;
            height: 80px;
            margin-top: 20px;
        }
    }

    /* Group Content */
    .group-content {
        padding: 40px;
        display: flex;
        flex-direction: column;
        gap: 35px;

        @media (max-width: $mobile-breakpoint) {
            padding: 30px;
            gap: 25px;
        }
    }

    .group-section {
        h3 {
            font-size: 1.4rem;
            color: $primary-color;
            margin: 0 0 20px 0;
            font-weight: 600;
            border-bottom: 2px solid $border-color;
            padding-bottom: 12px;

            @media (max-width: $mobile-breakpoint) {
                font-size: 1.2rem;
            }
        }

        p {
            color: $text-color;
            line-height: 1.8;
            margin: 0;
            font-size: 1rem;

            @media (max-width: $mobile-breakpoint) {
                font-size: 0.95rem;
            }
        }
    }

    /* Members Grid */
    .members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 25px;

        @media (max-width: $mobile-breakpoint) {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 20px;
        }
    }

    .member-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        transition: all 0.3s ease;
        border-radius: 8px;
        padding: 12px;

        &:hover:not(.no-profile) {
            background: var(--group-bg);
            // transform: translateY(-4px);
        }

        &.no-profile {
            cursor: default;
            opacity: 0.7;
        }
    }

    .member-image {
        width: 100px;
        height: 100px;
        margin-bottom: 12px;
        border-radius: 8px;
        overflow: hidden;
        background: $border-color;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;

        .member-card:not(.no-profile):hover & {
            border-color: var(--group-border);
            box-shadow: 0 4px 12px rgba(var(--group-border, 0, 0, 0), 0.2);
        }

        @media (max-width: $mobile-breakpoint) {
            width: 90px;
            height: 90px;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .member-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            135deg,
            var(--group-border) 0%,
            rgba(var(--group-border), 0.6) 100%
        );
        color: white;
        font-weight: 700;
        font-size: 1.4rem;
    }

    .member-info {
        text-align: center;
        width: 100%;
        min-width: 0;
    }

    .member-name {
        font-weight: 600;
        color: $primary-color;
        margin: 0 0 4px 0;
        font-size: 0.95rem;
        word-break: break-word;

        .member-card:not(.no-profile):hover & {
            color: var(--group-border);
        }
    }

    .member-title {
        font-size: 0.8rem;
        color: $light-text-color;
        margin: 0;
        line-height: 1.4;
    }

    /* Links List */
    .links-list {
        display: flex;
        flex-direction: column;
        gap: 0.67rem;
    }

    .info-link {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        background: var(--group-bg);
        border: 1px solid $text-color-inverted;
        border-radius: 6px;
        color: $text-color;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.2s ease;

        &:hover {
            border: 1px solid var(--group-border);
        }
    }

    .link-icon {
        font-size: 1.1rem;
        flex-shrink: 0;
    }

    .link-text {
        flex: 1;
    }

    .link-url {
        font-size: 0.8rem;
        color: $light-text-color;
        margin-left: auto;
    }
</style>
