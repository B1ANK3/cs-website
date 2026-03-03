<script lang="ts">
    import type { PageProps } from './$types';
    import { asset, resolve } from '$app/paths';

    const { data }: PageProps = $props();

    // Don't know if this is even needed cause eveything is static
    const { person } = $derived(data);
    const PersonComponent = $derived(person.component);
</script>

<svelte:head>
    <title>{person.name}</title>
</svelte:head>

<div class="profile-container">
    <div class="profile-header">
        <a href={resolve('/people')} class="back-link">← Back to People</a>
    </div>

    <div class="profile-content">
        <div class="profile-sidebar">
            {#if person.image}
                <img src={asset(person.image)} alt={person.name} class="profile-image" />
            {/if}

            <div class="profile-metadata">
                <h1 class="profile-name">{person.name}</h1>
                {#if person.title}
                    <p class="profile-title">{person.title}</p>
                {/if}
                {#if person.email}
                    <span
                        class="profile-email"
                        role="button"
                        tabindex="0"
                        onclick={() => (window.location.href = `mailto:${person.email}`)}
                        onkeydown={(e) =>
                            e.key === 'Enter' && (window.location.href = `mailto:${person.email}`)}
                    >
                        {person.email}
                    </span>
                {/if}
                {#if person.about}
                    <div class="profile-about">
                        <h3>Research Interests</h3>
                        <p>{person.about}</p>
                    </div>
                {/if}
                {#if person.type}
                    <div class="profile-type">
                        <span class="type-badge">{person.type}</span>
                    </div>
                {/if}
            </div>
        </div>

        <div class="profile-main">
            <div class="profile-body">
                <PersonComponent />
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .profile-container {
        max-width: 75%;
        margin: 0 auto;
        padding: 40px 20px;
        min-height: 100vh;
    }

    .profile-header {
        margin-bottom: 30px;
    }

    .back-link {
        display: inline-block;
        color: $primary-color;
        text-decoration: none;
        font-weight: 600;
        @include smooth-transition(all);

        &:hover {
            transform: translateX(-4px);
        }
    }

    .profile-content {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 40px;
        background-color: #ffffff;
        border: 1px solid $border-color;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        align-items: start;
    }

    .profile-sidebar {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .profile-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .profile-metadata {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .profile-name {
        font-size: 28px;
        margin: 0;
        color: $text-color;
        line-height: 1.2;
    }

    .profile-title {
        font-size: 16px;
        color: $primary-color;
        font-weight: 600;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .profile-email {
        color: $primary-color;
        text-decoration: none;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
        @include smooth-transition(all);

        &:hover {
            text-decoration: underline;
        }
    }

    .profile-about {
        margin-top: 8px;

        h3 {
            font-size: 14px;
            font-weight: 600;
            color: $text-color;
            margin: 0 0 8px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        p {
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            margin: 0;
        }
    }

    .profile-type {
        margin-top: 4px;
    }

    .type-badge {
        display: inline-block;
        padding: 4px 12px;
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        text-transform: capitalize;
    }

    .profile-main {
        min-width: 0;
    }

    .profile-body {
        font-size: 16px;
        line-height: 1.8;
        color: #666;

        :global(h2) {
            font-size: 24px;
            color: $text-color;
            margin: 30px 0 15px 0;
            font-weight: 600;

            &:first-child {
                margin-top: 0;
            }
        }

        :global(h3) {
            font-size: 18px;
            color: $text-color;
            margin: 20px 0 10px 0;
            font-weight: 600;
        }

        :global(p) {
            margin: 10px 0;
        }

        :global(ul),
        :global(ol) {
            margin: 15px 0;
            padding-left: 20px;
        }

        :global(li) {
            margin: 8px 0;
        }

        :global(strong) {
            color: $text-color;
            font-weight: 600;
        }
    }

    @media (max-width: $tablet-breakpoint) {
        .profile-container {
            max-width: 90%;
        }

        .profile-content {
            grid-template-columns: 1fr;
            padding: 30px;
            gap: 30px;
        }

        .profile-sidebar {
            max-width: 400px;
            margin: 0 auto;
        }

        .profile-name {
            font-size: 24px;
        }
    }

    @media (max-width: $mobile-breakpoint) {
        .profile-container {
            max-width: 100%;
            padding: 20px;
        }

        .profile-content {
            padding: 20px;
        }

        .profile-name {
            font-size: 22px;
        }

        .profile-title {
            font-size: 14px;
        }

        .profile-body {
            font-size: 14px;

            :global(h2) {
                font-size: 20px;
            }

            :global(h3) {
                font-size: 16px;
            }
        }
    }
</style>
