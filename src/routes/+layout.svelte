<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import logo from '$lib/assets/logo.svg';

    let { children } = $props();
    let searchQuery = $state('');

    const handleSearch = (e: Event) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const query = new FormData(form).get('search');
        console.log('Search query:', query);
        // Add search functionality here
    };
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="navbar">
    <div class="navbar-container">
        <!-- Logo -->
        <a href="/" class="logo">
            <img src={logo} alt="Logo" class="logo-img" />
        </a>

        <!-- Navigation Links -->
        <nav class="nav-links">
            <a href="/" class="nav-item">Home</a>
            <a href="/news" class="nav-item">News</a>
            <a href="/events" class="nav-item">Events</a>
            <a href="/people" class="nav-item">People</a>
            <a href="/research" class="nav-item">Research</a>
            <a href="/contact" class="nav-item">Contact</a>

            <!-- Search -->
            <form onsubmit={handleSearch} class="search-form">
                <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    class="search-input"
                    bind:value={searchQuery}
                />
                <button type="submit" class="search-btn">🔍</button>
            </form>
        </nav>
    </div>
</div>

<main class="main-content">
    {@render children()}
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

    .navbar {
        background-color: #ffffff;
        box-shadow: 0 2px 8px $shadow-color;
        position: sticky;
        top: 0;
        z-index: 100;
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

        &:hover .logo-img {
            transform: scale(1.05);
        }
    }

    .logo-img {
        height: $logo-size;
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
        color: $text-color;
        font-weight: 500;
        font-size: 15px;
        @include smooth-transition(color);
        position: relative;

        &:hover {
            color: $primary-color;

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
            background-color: $primary-color;
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

    .main-content {
        width: 100%;
        padding: 0;
        margin: 0;
        height: calc(100vh - $navbar-height);
        overflow-y: auto;
        overflow-x: hidden;
    }

    @media (max-width: $mobile-breakpoint) {
        .navbar-container {
            height: $navbar-height-mobile;
            padding: 0 15px;
        }

        .main-content {
            height: calc(100vh - $navbar-height-mobile);
        }

        .nav-links {
            gap: 15px;
        }

        .nav-item {
            font-size: 13px;
        }

        .search-input {
            width: 100px;
            font-size: 12px;
        }

        .logo-img {
            height: $logo-size-mobile;
        }
    }
</style>
