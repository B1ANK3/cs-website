<script lang="ts">
    import 'uno.css';
    import favicon from '$lib/assets/favicon.svg';
    import Footer from '$lib/components/Footer.svelte';
    import Navbar from '$lib/components/Navbar.svelte';

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<main class="main-content">
    {@render children()}
    <!-- TODO: Fix footer on scroll bad pages -->
    <Footer />
</main>

<style lang="scss">
    @import '$lib/styles/globals.scss';
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
