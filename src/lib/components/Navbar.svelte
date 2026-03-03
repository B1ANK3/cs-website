<script lang="ts">
    import SULogo from '$lib/assets/svg/SULogo.svelte';
    import SearchBar from '$lib/components/SearchBar.svelte';
    import { resolve } from '$app/paths';

    let mobileMenuOpen = $state(false);

    const toggleMobileMenu = () => {
        mobileMenuOpen = !mobileMenuOpen;
    };

    const closeMobileMenu = () => {
        mobileMenuOpen = false;
    };
</script>

<!-- TODO: Fix the gap at the top of the curtain menu -->
<div class="navbar">
    <div class="navbar-container">
        <!-- Logo -->
        <a href={resolve('/')} class="logo">
            <SULogo />
            <!-- class="logo-img" -->
        </a>

        <!-- Navigation Links (Desktop) -->
        <nav class="nav-links">
            <a href={resolve('/')} class="nav-item">Home</a>
            <a href={resolve('/news')} class="nav-item">News</a>
            <a href={resolve('/events')} class="nav-item">Events</a>
            <a href={resolve('/academics')} class="nav-item">Academics</a>
            <a href={resolve('/people')} class="nav-item">People</a>
            <a href={resolve('/research')} class="nav-item">Research</a>
            <a href={resolve('/contact')} class="nav-item">Contact</a>

            <!-- Search -->
            <div class="search-wrapper">
                <SearchBar />
            </div>
        </nav>

        <!-- Hamburger Menu Button (Mobile) -->
        <button
            class="hamburger-btn"
            aria-label="Toggle menu"
            onclick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
        >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
    </div>

    <!-- Mobile Menu Curtain -->
    <nav class="mobile-menu" class:open={mobileMenuOpen}>
        <div class="mobile-menu-scroll">
            <a href={resolve('/')} class="mobile-nav-item" onclick={closeMobileMenu}>Home</a>
            <a href={resolve('/news')} class="mobile-nav-item" onclick={closeMobileMenu}>News</a>
            <a href={resolve('/events')} class="mobile-nav-item" onclick={closeMobileMenu}>Events</a
            >
            <a href={resolve('/academics')} class="mobile-nav-item" onclick={closeMobileMenu}
                >Academics</a
            >
            <a href={resolve('/people')} class="mobile-nav-item" onclick={closeMobileMenu}>People</a
            >
            <a href={resolve('/research')} class="mobile-nav-item" onclick={closeMobileMenu}
                >Research</a
            >
            <a href={resolve('/contact')} class="mobile-nav-item" onclick={closeMobileMenu}
                >Contact</a
            >
            <div class="mobile-search-wrapper">
                <SearchBar />
            </div>
        </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <button
            class="mobile-menu-overlay"
            onclick={closeMobileMenu}
            onkeydown={(e) => e.key === 'Enter' && closeMobileMenu()}
            aria-label="Close menu"
        ></button>
    {/if}
</div>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .navbar {
        background-color: $primary-color;
        box-shadow: 0 2px 8px $shadow-color;
        position: sticky;
        top: 0;
        z-index: 100;
        border-bottom: $navbar-border-height solid $accent-color;
    }

    .navbar-container {
        max-width: $max-width;
        margin: 0 auto;
        padding: 0 20px;
        height: $navbar-height;
        @include flex-center;
        justify-content: space-between;
    }

    .logo {
        @include flex-center;
        text-decoration: none;
        flex-shrink: 0;
        height: $logo-size;
        max-height: 100%;

        &:hover :global(svg) {
            transform: scale(1.05);
        }
    }

    .nav-links {
        @include flex-center;
        gap: 1rem;
        flex: 1;
        justify-content: flex-end;
    }

    .nav-item {
        text-decoration: none;
        color: $text-color-inverted;
        font-weight: 500;
        font-size: 1.1em;
        @include smooth-transition(color);
        position: relative;

        &:hover {
            color: $secondary-color;

            &::after {
                width: 100%;
            }
        }

        &::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: $secondary-color;
            @include smooth-transition(width, 0.3s);
        }
    }

    .search-wrapper {
        width: fit-content;
    }

    // ============================================
    // Hamburger Menu (Mobile)
    // ============================================

    .hamburger-btn {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        gap: 6px;
        padding: 8px;
        z-index: 1001;
    }

    .hamburger-line {
        width: 24px;
        height: 3px;
        background-color: $secondary-color;
        border-radius: 2px;
        @include smooth-transition(all);
    }

    // ============================================
    // Mobile Menu Curtain
    // ============================================

    .mobile-menu {
        display: none;
        position: fixed;
        top: $navbar-height;
        right: -100%;
        width: 100%;
        max-width: 300px;
        height: calc(100vh - $navbar-height - $navbar-border-height);
        background-color: $primary-color;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
        z-index: 999;
        @include smooth-transition(right, 0.3s);
        overflow-y: auto;

        &.open {
            right: 0;
        }
    }

    .mobile-menu-scroll {
        display: flex;
        flex-direction: column;
        padding: 20px 0;
        gap: 0;
    }

    .mobile-nav-item {
        text-decoration: none;
        color: $text-color-inverted;
        font-weight: 500;
        font-size: 1.2em;
        padding: 16px 20px;
        @include smooth-transition(background-color);
        border-left: 4px solid transparent;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            border-left-color: $secondary-color;
            color: $secondary-color;
        }
    }

    .mobile-search-wrapper {
        margin: 20px;
    }

    .mobile-menu-overlay {
        display: none;
        position: fixed;
        top: $navbar-height;
        left: 0;
        width: 100%;
        height: calc(100vh - $navbar-height - $navbar-border-height);
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 998;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    // ============================================
    // Mobile Responsive
    // ============================================

    @media (max-width: $mobile-breakpoint) {
        .navbar-container {
            height: $navbar-height-mobile;
            padding: 0 15px;
        }

        .nav-links {
            display: none;
        }

        .hamburger-btn {
            display: flex;
        }

        .mobile-menu {
            display: block;
        }

        .mobile-menu-overlay {
            display: block;
        }
    }
</style>
