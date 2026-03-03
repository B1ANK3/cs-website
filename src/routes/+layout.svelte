<script lang="ts">
    import 'uno.css';
    import favicon from '$lib/assets/favicon.svg';
    import Footer from '$lib/components/Footer.svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import { afterNavigate } from '$app/navigation';

    let { children } = $props();

    let mainContent: HTMLElement;
    const scrollPositions = new Map<string, number>();

    afterNavigate(({ from, to, type }) => {
        if (!mainContent) return;

        // Save scroll position when leaving a page
        if (from) {
            scrollPositions.set(from.url.pathname, mainContent.scrollTop);
        }

        // On back/forward navigation (popstate), restore the previous scroll position
        if (type === 'popstate' && to) {
            const savedPosition = scrollPositions.get(to.url.pathname);
            if (savedPosition !== undefined) {
                setTimeout(() => {
                    mainContent.scrollTop = savedPosition;
                }, 0);
            } else {
                mainContent.scrollTop = 0;
            }
        } else {
            // On normal navigation (link click), scroll to top
            mainContent.scrollTop = 0;
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<main class="main-content" bind:this={mainContent}>
    {@render children()}
    <!-- TODO: Fix footer on scroll bad pages -->
    <Footer />
</main>

<style lang="scss">
    @use '$lib/styles/globals' as *;
    :global(body) {
        margin: 0;
        padding: 0;
        font-family: $font-family;
        overflow: hidden;
    }

    :global(html) {
        overflow: hidden;
    }

    .main-content {
        width: 100%;
        padding: 0;
        margin: 0;
        height: calc(100vh - $navbar-height - $navbar-border-height);
        overflow-y: auto;
        overflow-x: hidden;
    }

    @media (max-width: $mobile-breakpoint) {
        .main-content {
            height: calc(100vh - $navbar-height-mobile - $navbar-border-height);
        }
    }
</style>
