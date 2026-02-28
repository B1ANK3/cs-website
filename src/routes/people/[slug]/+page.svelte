<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    const { person } = data;
</script>

<svelte:head>
    <title>{person.name}</title>
</svelte:head>

<div class="profile-container">
    <div class="profile-header">
        <a href="/people" class="back-link">← Back to People</a>
    </div>

    <div class="profile-content">
        <div class="profile-image-section">
            <img src={person.image} alt={person.name} class="profile-image" />
        </div>

        <div class="profile-info">
            <h1 class="profile-name">{person.name}</h1>
            <p class="profile-title">{person.title}</p>

            <span
                class="profile-email"
                role="button"
                tabindex="0"
                on:click={() => (window.location.href = `mailto:${person.email}`)}
                on:keydown={(e) =>
                    e.key === 'Enter' && (window.location.href = `mailto:${person.email}`)}
            >
                {person.email}
            </span>

            <div class="profile-divider"></div>

            <div class="profile-body">
                <svelte:component this={person.component} />
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import '$lib/styles/globals.scss';

    .profile-container {
        max-width: 900px;
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
        grid-template-columns: 300px 1fr;
        gap: 40px;
        background-color: #ffffff;
        border: 1px solid $border-color;
        border-radius: 8px;
        padding: 40px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .profile-image-section {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .profile-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .profile-info {
        display: flex;
        flex-direction: column;
    }

    .profile-name {
        font-size: 36px;
        margin: 0 0 8px 0;
        color: $text-color;
    }

    .profile-title {
        font-size: 18px;
        color: $primary-color;
        font-weight: 600;
        margin: 0 0 15px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .profile-email {
        color: $primary-color;
        text-decoration: none;
        font-weight: 500;
        margin-bottom: 15px;
        cursor: pointer;
        @include smooth-transition(all);

        &:hover {
            text-decoration: underline;
        }
    }

    .profile-divider {
        height: 1px;
        background-color: $border-color;
        margin: 20px 0;
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
        .profile-content {
            grid-template-columns: 1fr;
            padding: 30px;
            gap: 30px;
        }

        .profile-name {
            font-size: 28px;
        }

        .profile-image-section {
            max-width: 250px;
            margin: 0 auto;
        }
    }

    @media (max-width: $mobile-breakpoint) {
        .profile-container {
            padding: 20px;
        }

        .profile-content {
            padding: 20px;
        }

        .profile-name {
            font-size: 24px;
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
