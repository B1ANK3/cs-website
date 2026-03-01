<script lang="ts">
    import SULogo from '$lib/assets/svg/SULogo.svelte';
    import Search from '$lib/assets/svg/Search.svelte';
    import { resolve } from '$app/paths';

    let searchQuery = $state('');
    let mobileMenuOpen = $state(false);

    const handleSearch = (e: Event) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const query = new FormData(form).get('search');
        form.reset();
        console.log('Search query:', query);
        // Add search functionality here
    };

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
            <a href={resolve('/people')} class="nav-item">People</a>
            <a href={resolve('/research')} class="nav-item">Research</a>
            <a href={resolve('/contact')} class="nav-item">Contact</a>

            <!-- Search -->
            <form onsubmit={handleSearch} class="search-form">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    class="search-input"
                    bind:value={searchQuery}
                />
                <button type="submit" class="search-btn" aria-label="Search">
                    <Search />
                </button>
            </form>
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
            <a href={resolve('/people')} class="mobile-nav-item" onclick={closeMobileMenu}>People</a
            >
            <a href={resolve('/research')} class="mobile-nav-item" onclick={closeMobileMenu}
                >Research</a
            >
            <a href={resolve('/contact')} class="mobile-nav-item" onclick={closeMobileMenu}
                >Contact</a
            >
            <form onsubmit={handleSearch} class="mobile-search-form">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    class="mobile-search-input"
                    bind:value={searchQuery}
                />
                <button type="submit" class="mobile-search-btn" aria-label="Search">
                    <Search />
                </button>
            </form>
        </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    {#if mobileMenuOpen}
        <div class="mobile-menu-overlay" onclick={closeMobileMenu}></div>
    {/if}
</div>

<style lang="scss">
    @import '$lib/styles/globals.scss';

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

    .logo-img {
        height: 100%;
        width: auto;
        @include smooth-transition(transform);
    }

    .nav-links {
        @include flex-center;
        gap: 30px;
        flex: 1;
        justify-content: flex-end;
    }

    .nav-item {
        text-decoration: none;
        color: $secondary-color;
        font-weight: 500;
        font-size: 15px;
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

    .search-form {
        @include flex-center;
        border: 1px solid $border-color;
        border-radius: 20px;
        padding: 0 12px;
        background-color: $light-bg;
        @include smooth-transition;

        &:focus-within {
            @include focus-ring;
        }
    }

    .search-input {
        border: none;
        background: transparent;
        padding: 8px 10px;
        font-size: 14px;
        width: 150px;
        outline: none;
        color: $text-color;

        &::placeholder {
            color: #999;
        }
    }

    .search-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        @include flex-center;
        @include smooth-transition(transform);

        &:hover {
            transform: scale(1.1);
        }
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
        color: $secondary-color;
        font-weight: 500;
        font-size: 16px;
        padding: 16px 20px;
        @include smooth-transition(background-color);
        border-left: 4px solid transparent;

        &:hover {
            background-color: rgba(0, 0, 0, 0.1);
            border-left-color: $secondary-color;
        }
    }

    .mobile-search-form {
        @include flex-center;
        margin: 20px;
        border: 1px solid $border-color;
        border-radius: 20px;
        padding: 0 12px;
        background-color: $light-bg;
        @include smooth-transition;
    }

    .mobile-search-input {
        border: none;
        background: transparent;
        padding: 8px 10px;
        font-size: 14px;
        width: 100%;
        outline: none;
        color: $text-color;

        &::placeholder {
            color: #999;
        }
    }

    .mobile-search-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        padding: 0;
        @include flex-center;
        @include smooth-transition(transform);

        &:hover {
            transform: scale(1.1);
        }
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

        .logo-img {
            height: $logo-size-mobile;
        }
    }
</style>
