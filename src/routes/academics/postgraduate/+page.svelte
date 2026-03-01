<script lang="ts">
    import { prospectiveFAQs } from '$lib/academics/postgraduate/postgraduate';
    import { onMount } from 'svelte';
    import { resolve } from '$app/paths';

    let openFAQIndex: number | null = null;

    const toggleFAQ = (index: number) => {
        openFAQIndex = openFAQIndex === index ? null : index;
    };

    onMount(() => {
        // Open first FAQ by default
        openFAQIndex = 0;
    });
</script>

<div class="postgraduate-page">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1>Postgraduate Studies</h1>
            <p class="lead">
                Advance your career and research skills through our postgraduate programs. From
                honours to PhD, we offer pathways for ambitious students ready to make their mark in
                computer science.
            </p>
        </div>
    </section>

    <!-- FAQ Section for Prospective Students -->
    <section class="faq-section">
        <div class="container">
            <div class="section-header">
                <h2>Information for Prospective Students</h2>
                <p class="section-subtitle">
                    Common questions about postgraduate study, including masters and PhD programs
                </p>
            </div>

            <div class="faq-container">
                {#each prospectiveFAQs as faq, index (faq.question)}
                    <div class="faq-item" class:open={openFAQIndex === index}>
                        <button class="faq-question" onclick={() => toggleFAQ(index)}>
                            <span class="question-text">{faq.question}</span>
                            <span class="faq-icon">{openFAQIndex === index ? '−' : '+'}</span>
                        </button>
                        {#if openFAQIndex === index}
                            <div class="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <div class="reference-links">
                <p>For more specific information, visit:</p>
                <div class="reference-cards">
                    <a href={resolve('/academics/honours')} class="reference-card">
                        <h3>Honours Programme</h3>
                        <p>1-year intensive bridging program</p>
                    </a>
                    <a href={resolve('/academics/masters')} class="reference-card">
                        <h3>Master's Programmes</h3>
                        <p>1-2 year coursework and research programs</p>
                    </a>
                    <a href={resolve('/academics/phd')} class="reference-card">
                        <h3>PhD Programmes</h3>
                        <p>3-4 year intensive research degrees</p>
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>

<style lang="scss">
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 2rem;
    }

    /* Hero Section */
    .hero-section {
        background: #61223b;
        color: white;
        padding: 5rem 0;
        text-align: center;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #d22730;
        }

        h1 {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            font-weight: 700;
        }

        .lead {
            font-size: 1.2rem;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
            opacity: 0.95;
        }
    }

    /* FAQ Section */
    .faq-section {
        padding: 5rem 0;
        background: white;

        .section-header {
            text-align: center;
            margin-bottom: 3rem;

            h2 {
                font-size: 2.5rem;
                color: #333;
                margin-bottom: 1rem;
            }

            .section-subtitle {
                font-size: 1.1rem;
                color: #666;
                max-width: 700px;
                margin: 0 auto;
            }
        }

        .faq-container {
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .faq-item {
            background: white;
            border: 2px solid #e5e5e5;
            border-radius: 8px;
            overflow: hidden;
            transition: all 0.3s ease;

            &.open {
                border-color: #d22730;
                box-shadow: 0 4px 12px rgba(210, 39, 48, 0.1);
            }

            &:hover {
                border-color: #d22730;
            }
        }

        .faq-question {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            background: white;
            border: none;
            cursor: pointer;
            text-align: left;
            gap: 1rem;
            transition: background 0.2s ease;

            &:hover {
                background: #f8f9fa;
            }

            .question-text {
                font-size: 1.1rem;
                font-weight: 600;
                color: #333;
            }

            .faq-icon {
                font-size: 1.5rem;
                color: #d22730;
                font-weight: 300;
                flex-shrink: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        .faq-answer {
            padding: 0 2rem 1.5rem 2rem;
            animation: slideDown 0.3s ease;

            p {
                color: #666;
                line-height: 1.7;
                margin: 0;
            }
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .reference-links {
            margin-top: 4rem;
            text-align: center;

            p {
                font-size: 1.1rem;
                color: #666;
                margin-bottom: 2rem;
            }

            .reference-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 1.5rem;
                max-width: 1000px;
                margin: 0 auto;
            }

            .reference-card {
                background: #f8f9fa;
                padding: 2rem;
                border-radius: 12px;
                text-decoration: none;
                border: 2px solid transparent;
                transition: all 0.3s ease;

                &:hover {
                    border-color: #d22730;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transform: translateY(-4px);
                }

                h3 {
                    font-size: 1.3rem;
                    color: #61223b;
                    margin-bottom: 0.5rem;
                }

                p {
                    color: #666;
                    margin: 0;
                    font-size: 0.95rem;
                }
            }
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .hero-section {
            padding: 3rem 0;

            h1 {
                font-size: 2.5rem;
            }

            .lead {
                font-size: 1rem;
            }
        }

        .faq-section {
            padding: 3rem 0;

            .section-header h2 {
                font-size: 2rem;
            }

            .faq-question {
                padding: 1rem 1.5rem;

                .question-text {
                    font-size: 1rem;
                }
            }

            .faq-answer {
                padding: 0 1.5rem 1rem 1.5rem;
            }

            .reference-links {
                .reference-cards {
                    grid-template-columns: 1fr;
                }
            }
        }
    }
</style>
