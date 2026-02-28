<script lang="ts">
    import { onMount } from 'svelte';
    import ArrowBack from '$lib/assets/svg/ArrowBack.svelte';
    import ArrowForward from '$lib/assets/svg/ArrowForward.svelte';

    let slides = [
        { title: 'News Slide 1', color: '#D22730' },
        { title: 'News Slide 2', color: '#82CCAE' },
        { title: 'Events Slide 1', color: '#A60A3D' },
        { title: 'Events Slide 2', color: '#dc4405' },
        { title: 'Events Slide 2', color: '#643335' }
    ];

    let slideCount = slides.length;
    let slideIndex = 0;
    let autoScrollInterval: ReturnType<typeof setInterval> | null = null;
    let carouselListEl: HTMLElement | null = null;

    const sliderSpeed = 6000;

    const raiseLeft = () => {
        slideIndex = (slideIndex + slideCount - 1) % slideCount;
        updateZIndex();
    };

    const raiseRight = () => {
        slideIndex = (slideIndex + 1) % slideCount;
        updateZIndex();
    };

    const updateZIndex = () => {
        if (!carouselListEl) return;

        const items = carouselListEl.querySelectorAll('li');
        items.forEach((item, i) => {
            if (i === slideIndex) {
                (item as HTMLElement).style.zIndex = '6';
            } else {
                (item as HTMLElement).style.zIndex = '2';
            }
        });
    };

    const moveRight = () => {
        raiseRight();
        if (carouselListEl) {
            const firstChild = carouselListEl.firstElementChild;
            if (firstChild) {
                carouselListEl.appendChild(firstChild);
            }
        }
    };

    const moveLeft = () => {
        raiseLeft();
        if (carouselListEl) {
            const lastChild = carouselListEl.lastElementChild;
            if (lastChild) {
                carouselListEl.insertBefore(lastChild, carouselListEl.firstElementChild);
            }
        }
    };

    const moveRightTimer = () => {
        moveRight();
        autoScrollInterval = setTimeout(() => {
            moveRightTimer();
        }, sliderSpeed);
    };

    const startAutoScroll = () => {
        autoScrollInterval = setTimeout(() => {
            moveRightTimer();
        }, sliderSpeed);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearTimeout(autoScrollInterval);
            autoScrollInterval = null;
        }
    };

    const handleMouseEnter = () => {
        stopAutoScroll();
    };

    const handleMouseLeave = () => {
        startAutoScroll();
    };
    // TODO: Fix this carousel logic. Bad animations and wrong logic for wrapping.
    onMount(() => {
        carouselListEl = document.querySelector('.carousel-list') as HTMLElement;
        slideIndex = slideCount - 1;
        raiseRight();
        startAutoScroll();

        return () => {
            stopAutoScroll();
        };
    });
</script>

<!-- Hero Section with Carousel -->
<section class="hero-section">
    <!-- Animated Logo -->
    <!-- <div class="animated-logo" style="opacity: {Math.max(0, 1 - scrollY / 300)}">
        <img src={favicon} alt="Logo" />
    </div> -->

    <!-- Image Carousel Banner -->
    <div
        class="carousel-wrapper"
        role="region"
        aria-label="Carousel"
        onmouseenter={handleMouseEnter}
        onmouseleave={handleMouseLeave}
    >
        <button
            class="carousel-btn carousel-btn-left"
            onclick={() => moveLeft()}
            aria-label="Previous image"
        >
            <ArrowBack />
        </button>

        <div class="carousel" id="carousel">
            <ul class="carousel-list">
                {#each slides as slide}
                    <li class="carousel-item" style="background-color: {slide.color}">
                        <div class="slide-content">
                            <h2>{slide.title}</h2>
                            <p>Carousel content coming soon</p>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <button
            class="carousel-btn carousel-btn-right"
            onclick={() => moveRight()}
            aria-label="Next image"
        >
            <ArrowForward />
        </button>
    </div>
</section>

<!-- Welcome Section with Split Layout -->
<section class="welcome-section">
    <div class="content-wrapper">
        <!-- Left Side: Welcome Content -->
        <div class="welcome-content">
            <h1 class="welcome-heading">Welcome</h1>
            <p class="welcome-paragraph">
                The Department of Computer Science was founded in 1972. We have now merged with
                Mathematics and Applied Mathematics to form the Computer Science Division in the
                Department of Mathematical Sciences.
            </p>
            <p class="welcome-paragraph">
                We currently have 11 full members of academic staff whose research activities span a
                range of subject areas, including Automata Theory, Broadband and Mobile Networks,
                Software Engineering, Program Testing and Verification, Robotics, Natural Language
                Processing, and Machine Learning.
            </p>
        </div>

        <!-- Right Side: 2D Renderer Placeholder -->
        <div class="renderer-container">
            <div class="placeholder">
                <p>2D Renderer - Coming Soon</p>
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    @import '$lib/styles/globals.scss';
    .hero-section {
        position: relative;
        height: calc(100vh - #{$navbar-height});
        width: 100%;
        @include flex-center;
        overflow: hidden;
        scroll-snap-align: start;
    }

    .animated-logo {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 50;
        @include smooth-transition(opacity);

        img {
            width: 80px;
            height: auto;
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
        }
    }

    .carousel-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
    }

    .carousel {
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        &::-webkit-scrollbar {
            height: 0;
        }

        &::-webkit-scrollbar-track {
            background: transparent;
        }

        &::-webkit-scrollbar-thumb {
            background: transparent;
        }
    }

    .carousel-list {
        display: flex;
        gap: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        position: relative;
    }

    .carousel-item {
        min-width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        @include flex-center;
        z-index: 2;
        transition:
            z-index 0.3s ease-in-out,
            opacity 0.3s ease-in-out;
        opacity: 0;

        &[style*='z-index: 6'] {
            opacity: 1;
        }

        .slide-content {
            text-align: center;
            color: white;

            h2 {
                font-size: 48px;
                margin: 0 0 20px 0;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            p {
                font-size: 18px;
                margin: 0;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
            }
        }
    }

    .carousel-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        @include smooth-transition(all);
        z-index: 40;
        @include flex-center;
        color: $text-color;

        &:hover {
            background-color: rgba(255, 255, 255, 1);
            transform: translateY(-50%) scale(1.1);
        }

        &:active {
            transform: translateY(-50%) scale(0.95);
        }
    }

    .carousel-btn-left {
        left: 20px;
    }

    .carousel-btn-right {
        right: 20px;
    }

    // Welcome Section
    .welcome-section {
        position: relative;
        height: calc(100vh - #{$navbar-height});
        width: 100%;
        padding: 60px 20px;
        background-color: #ffffff;
        scroll-snap-align: start;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: hidden;
    }

    .content-wrapper {
        max-width: 90%;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 4fr;
        gap: 60px;
        align-items: start;
        box-sizing: border-box;
    }

    .renderer-container {
        width: 100%;
        height: 100%;
        background-color: $light-bg;
        border: 2px dashed $border-color;
        border-radius: 8px;
        @include flex-center;

        .placeholder {
            text-align: center;
            color: #999;

            p {
                font-size: 16px;
                margin: 0;
            }
        }
    }

    .welcome-content {
        padding: 40px 0;
    }

    .welcome-heading {
        font-size: 48px;
        margin: 0 0 30px 0;
        color: $text-color;
    }

    .welcome-paragraph {
        font-size: 16px;
        line-height: 1.8;
        color: #666;
        margin: 0 0 20px 0;

        &:last-child {
            margin-bottom: 0;
        }
    }

    // Mobile Responsive
    @media (max-width: $mobile-breakpoint) {
        .hero-section {
            height: 60vh;
        }

        .carousel-wrapper {
            padding: 0;
        }

        .carousel-btn {
            width: 40px;
            height: 40px;
            font-size: 18px;

            &-left {
                left: 10px;
            }

            &-right {
                right: 10px;
            }
        }

        .animated-logo {
            width: 60px;

            img {
                width: 60px;
            }
        }

        .welcome-section {
            min-height: auto;
            padding: 40px 20px;
        }

        .content-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
        }

        .renderer-container {
            min-height: 300px;
        }

        .welcome-heading {
            font-size: 32px;
            margin-bottom: 20px;
        }

        .welcome-paragraph {
            font-size: 14px;
        }
    }
</style>
