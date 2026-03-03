<script lang="ts">
    import { onMount } from 'svelte';
    import ArrowBack from '$lib/assets/svg/ArrowBack.svelte';
    import ArrowForward from '$lib/assets/svg/ArrowForward.svelte';
    import IsometricRenderer from '$lib/components/IsometricRenderer.svelte';
    import { getPeopleByType } from '$lib/people';

    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    let slides = $derived(data.slides || []);
    let articles = $derived(data.articles || []);
    let events = $derived(data.events || []);
    let staff = $derived(getPeopleByType('staff'));
    let staffNames = $derived(staff.map((person) => person.name));
    let slideCount = $derived(slides.length);
    let slideIndex = $state(0);
    let autoScrollInterval: ReturnType<typeof setTimeout> | null = null;

    const sliderSpeed = 6000;

    const raiseLeft = () => {
        if (slideCount === 0) return;
        slideIndex = (slideIndex + slideCount - 1) % slideCount;
    };

    const raiseRight = () => {
        if (slideCount === 0) return;
        slideIndex = (slideIndex + 1) % slideCount;
    };

    const moveRight = () => {
        raiseRight();
    };

    const moveLeft = () => {
        raiseLeft();
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
        if (slideCount > 0) {
            slideIndex = 0;
        }
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
            {#if slideCount === 0}
                <div class="empty-carousel">No featured updates available right now.</div>
            {:else}
                <ul class="carousel-list" style="transform: translateX(-{slideIndex * 100}%);">
                    {#each slides as slide (slide.id)}
                        <li class="carousel-item">
                            <a href={slide.link} class="slide-link">
                                <img src={slide.mainImage} alt={slide.title} class="slide-image" />
                                <div class="slide-overlay"></div>
                                <div class="slide-content">
                                    <span class="slide-type"
                                        >{slide.type === 'event' ? 'Event' : 'News'}</span
                                    >
                                    <h2>{slide.title}</h2>
                                    <p>{slide.summary}</p>
                                </div>
                                <span class="learn-more">Learn more</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
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

        <!-- Right Side: Isometric Scene Renderer -->
        <div class="renderer-container">
            <IsometricRenderer {articles} {events} names={staffNames} />
        </div>
    </div>
</section>

<style lang="scss">
    @use '$lib/styles/globals' as *;
    .hero-section {
        position: relative;
        height: calc(100vh - $navbar-height - $navbar-border-height);
        width: 100%;
        @include flex-center;
        overflow: hidden;
        scroll-snap-align: start;
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
        transition: transform 0.55s ease;
    }

    .carousel-item {
        min-width: 100%;
        height: 100%;
        width: 100%;
        position: relative;

        .slide-link {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
            text-decoration: none;
            color: inherit;
        }

        .slide-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .slide-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 10%, rgba(0, 0, 0, 0.25) 60%);
        }

        .slide-content {
            position: absolute;
            left: 40px;
            bottom: 40px;
            right: 180px;
            text-align: left;
            color: white;

            .slide-type {
                display: inline-block;
                background: rgba(210, 39, 48, 0.9);
                font-size: 12px;
                padding: 6px 10px;
                border-radius: 999px;
                margin-bottom: 12px;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                font-weight: 600;
            }

            h2 {
                font-size: 48px;
                margin: 0 0 14px 0;
                text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }

            p {
                font-size: 18px;
                margin: 0;
                text-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
                line-height: 1.5;
                max-width: 760px;
            }
        }

        .learn-more {
            position: absolute;
            right: 40px;
            bottom: 40px;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.85);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 14px;
            font-weight: 600;
            background: rgba(0, 0, 0, 0.25);
            transition: all 0.2s ease;
        }

        .slide-link:hover .learn-more {
            background: rgba(210, 39, 48, 0.9);
            border-color: rgba(210, 39, 48, 0.9);
        }
    }

    .empty-carousel {
        width: 100%;
        height: 100%;
        @include flex-center;
        color: $text-color-inverted;
        background: #61223b;
        font-size: 20px;
        text-align: center;
        padding: 2rem;
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
        min-height: auto;
        width: 100%;
        padding: 60px 20px;
        background-color: #ffffff;
        scroll-snap-align: start;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: visible;
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
        min-height: 540px;
        background-color: #f5f5f5;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .welcome-content {
        padding: 40px 0;
    }

    .welcome-heading {
        color: $primary-color;
        font-size: 48px;
        margin: 0 0 30px 0;
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

        .carousel-item {
            .slide-content {
                left: 20px;
                right: 20px;
                bottom: 20px;

                h2 {
                    font-size: 28px;
                    margin-bottom: 10px;
                }

                p {
                    font-size: 14px;
                }
            }

            .learn-more {
                display: none;
            }
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
            color: $primary-color;
            font-size: 32px;
            margin-bottom: 20px;
        }

        .welcome-paragraph {
            font-size: 14px;
        }
    }
</style>
