<script lang="ts">
    import { page } from '$app/state';
    import { resolve } from '$app/paths';
    import { goto } from '$app/navigation';

    const status = $derived(page.status || 500);
    const message = $derived(page.error?.message || 'An unexpected error occurred');

    function goHome() {
        goto(resolve('/'));
    }

    function goBack() {
        window.history.back();
    }

    // Get error title based on status code
    function getErrorTitle(status: number): string {
        const titles: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Page Not Found',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable'
        };
        return titles[status] || 'Error';
    }

    // Get error description based on status code
    function getErrorDescription(status: number): string {
        const descriptions: Record<number, string> = {
            400: "We couldn't understand your request. Please check and try again.",
            401: 'You need to be logged in to access this resource.',
            403: "You don't have permission to access this resource.",
            404: "The page you're looking for doesn't exist or has been moved.",
            500: "Something went wrong on our end. We're working to fix it.",
            502: "We're having trouble connecting to our servers. Please try again later.",
            503: "We're temporarily down for maintenance. Please check back soon."
        };
        return descriptions[status] || 'An unexpected error occurred.';
    }
</script>

<svelte:head>
    <title>{status} - {getErrorTitle(status)}</title>
</svelte:head>

<div class="error-page">
    <div class="error-container">
        <!-- Error Code -->
        <div class="error-code-wrapper">
            <h1 class="error-code">{status}</h1>
            <div class="error-code-shadow">{status}</div>
        </div>

        <!-- Error Content -->
        <div class="error-content">
            <h2 class="error-title">{getErrorTitle(status)}</h2>

            <p class="error-description">
                {getErrorDescription(status)}
            </p>

            {#if message && message !== getErrorDescription(status)}
                <div class="error-message">
                    <p class="message-label">Error Details:</p>
                    <p class="message-text">{message}</p>
                </div>
            {/if}

            <!-- Action Buttons -->
            <div class="error-actions">
                <button class="btn btn-primary" onclick={goHome}>
                    <span class="btn-icon">🏠</span>
                    Go Home
                </button>
                <button class="btn btn-secondary" onclick={goBack}>
                    <span class="btn-icon">←</span>
                    Go Back
                </button>
            </div>

            <!-- Help Links -->
            <div class="help-links">
                <p class="help-text">Need help?</p>
                <a href="/faq" class="help-link">Visit FAQ</a>
                <span class="separator">•</span>
                <a href="/contact" class="help-link">Contact Us</a>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @use 'sass:color';
    @import '$lib/styles/globals.scss';

    .error-page {
        min-height: 100vh;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, $light-bg 0%, #e8e8e8 100%);
        padding: 40px 20px;
    }

    .error-container {
        max-width: 800px;
        width: 100%;
        text-align: center;
    }

    .error-code-wrapper {
        position: relative;
        margin-bottom: 40px;
    }

    .error-code {
        font-size: clamp(120px, 20vw, 200px);
        font-weight: 700;
        color: $primary-color;
        margin: 0;
        line-height: 1;
        position: relative;
        z-index: 2;
        text-shadow: 4px 4px 0px rgba($accent-color, 0.2);
        animation: float 3s ease-in-out infinite;
    }

    .error-code-shadow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: clamp(120px, 20vw, 200px);
        font-weight: 700;
        color: rgba($secondary-color, 0.1);
        z-index: 1;
        line-height: 1;
        user-select: none;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }

    .error-content {
        background: white;
        padding: 50px 40px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border-top: 4px solid $accent-color;

        @media (max-width: $mobile-breakpoint) {
            padding: 40px 30px;
        }
    }

    .error-title {
        font-size: 2.5rem;
        color: $primary-color;
        margin: 0 0 20px 0;
        font-weight: 600;

        @media (max-width: $mobile-breakpoint) {
            font-size: 2rem;
        }
    }

    .error-description {
        font-size: 1.2rem;
        color: $light-text-color;
        margin: 0 0 30px 0;
        line-height: 1.6;

        @media (max-width: $mobile-breakpoint) {
            font-size: 1.1rem;
        }
    }

    .error-message {
        background: $light-bg;
        padding: 20px;
        border-radius: 8px;
        margin: 30px 0;
        border-left: 4px solid $accent-color;
        text-align: left;

        .message-label {
            font-weight: 600;
            color: $primary-color;
            margin: 0 0 10px 0;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .message-text {
            color: $text-color;
            margin: 0;
            font-size: 1rem;
            line-height: 1.6;
            font-family: 'Courier New', monospace;
        }
    }

    .error-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        flex-wrap: wrap;
        margin: 40px 0 30px 0;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 30px;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-family: $font-family;

        &:active {
            transform: translateY(1px);
        }

        @media (max-width: $mobile-breakpoint) {
            padding: 12px 24px;
            font-size: 0.95rem;
        }
    }

    .btn-icon {
        font-size: 1.2rem;
        line-height: 1;
    }

    .btn-primary {
        background: $accent-color;
        color: white;

        &:hover {
            background: color.adjust($accent-color, $lightness: -10%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba($accent-color, 0.3);
        }
    }

    .btn-secondary {
        background: $secondary-color;
        color: white;

        &:hover {
            background: color.adjust($secondary-color, $lightness: -10%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba($secondary-color, 0.3);
        }
    }

    .help-links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        padding-top: 20px;
        border-top: 1px solid $border-color;
    }

    .help-text {
        color: $light-text-color;
        margin: 0;
        font-size: 0.95rem;
    }

    .help-link {
        color: $accent-color;
        text-decoration: none;
        font-weight: 500;
        font-size: 0.95rem;
        transition: color 0.2s ease;

        &:hover {
            color: color.adjust($accent-color, $lightness: -15%);
            text-decoration: underline;
        }
    }

    .separator {
        color: $border-color;
        user-select: none;
    }
</style>
