<script lang="ts">
    import SUSlogan from '$lib/assets/svg/SUSlogan.svelte';
    import { resolve } from '$app/paths';
</script>

<footer class="footer">
    <div class="footer-container">
        <!-- Left Section: Logo only -->
        <div class="footer-section footer-left">
            <div class="footer-logo">
                <SUSlogan />
            </div>
        </div>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Middle Section: Contact + CS Division Links -->
        <div class="footer-section footer-middle">
            <div class="footer-contact">
                <p class="address">
                    Computer Science, Stellenbosch University <br />
                    Decanting Facility, Hammanshand Road <br />
                    7600 Stellenbosch, SOUTH AFRICA
                </p>
                <p class="phone">Phone: +27 21 808 4232</p>
            </div>
            <div>
                <h3 class="section-title">CS Division</h3>
                <ul class="footer-links">
                    <li><a href={resolve('/academics/undergraduate')}>Undergraduate</a></li>
                    <li><a href={resolve('/academics/postgraduate')}>Postgraduate</a></li>
                    <li><a href={resolve('/academics/masters')}>Masters</a></li>
                    <li><a href={resolve('/academics/phd')}>PhD</a></li>
                    <li><a href={resolve('/research')}>Research</a></li>
                </ul>
            </div>
        </div>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Right Section: Socials and Helpful Links -->
        <div class="footer-section footer-right">
            <div class="socials">
                <div class="social-icons">
                    <a href="#" aria-label="Facebook" class="social-icon">f</a>
                    <a href="#" aria-label="Twitter" class="social-icon">𝕏</a>
                    <a href="#" aria-label="Instagram" class="social-icon">📷</a>
                    <a href="#" aria-label="LinkedIn" class="social-icon">in</a>
                </div>
            </div>

            <div class="helpful-links">
                <ul class="footer-links">
                    <li><a href="#">Sitemap</a></li>
                    <li><a href="mailto:help@university.edu">Report Issues</a></li>
                    <li><a href={resolve('/faq')}>FAQ</a></li>
                    <li><a href="#">Accessibility</a></li>
                </ul>
            </div>

            <div class="copyright">
                <p>
                    &copy; 2026 Computer Science, Stellebosch University <br /> All rights reserved.
                </p>
            </div>
        </div>
    </div>
</footer>

<style lang="scss">
    @use '$lib/styles/globals' as *;

    .footer {
        background-color: $primary-color;
        background-image: url('/images/su_footer_bg.png');
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        color: $text-color-inverted;
        margin-top: auto;
        border-top: 1px solid $secondary-color;
    }

    .footer-container {
        max-width: $max-width;
        margin: 0 auto;
        padding: 2rem 1rem;
        display: flex;
        gap: 30px;
        align-items: flex-start;
        justify-content: space-between;
    }

    .footer-section {
        flex: 1;
        padding: 0 20px;
    }

    .footer-left {
        flex: 0 0 14rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .footer-logo {
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        :global(svg) {
            width: 100%;
            height: auto;
        }
    }

    .footer-contact {
        font-size: 13px;
        line-height: 1.6;

        p {
            margin: 0;
            padding: 0;
        }

        .address {
            margin-bottom: 10px;
        }

        .phone {
            font-weight: 500;
        }
    }

    .footer-middle {
        flex: 0 1 320px;
        display: flex;
        flex-direction: column;
        gap: 18px;
    }

    .footer-right {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 25px;
    }

    .footer-divider {
        width: 1px;
        background-color: $secondary-color;
        opacity: 0.5;
        // TODO: Adjust height based on content
        min-height: 200px;
    }

    .section-title {
        font-size: 1rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .footer-links {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        gap: 20px;

        li {
            margin: 0;
        }

        a {
            color: $text-color-inverted;
            text-decoration: none;
            font-size: 0.8rem;
            @include smooth-transition(color);

            &:hover {
                color: $secondary-color;
            }
        }
    }

    .socials {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
    }

    .social-icons {
        display: flex;
        gap: 12px;
    }

    .social-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba($text-color-inverted, 0.2);
        border-radius: 50%;
        color: $text-color-inverted;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        @include smooth-transition(background-color, color);

        &:hover {
            background-color: rgba($secondary-color, 0.4);
            color: $secondary-color;
            font-weight: 700;
        }
    }

    .helpful-links {
        display: flex;
        flex-direction: row;
        gap: 0;
        flex: 1;
    }

    .copyright {
        padding-top: 15px;
        border-top: 1px solid rgba($secondary-color, 0.3);
        font-size: 12px;
        opacity: 0.8;

        p {
            margin: 0;
        }
    }

    @media (max-width: $mobile-breakpoint) {
        .footer-container {
            flex-direction: column;
            gap: 20px;
            padding: 0 1.875rem;
        }

        .footer-divider {
            display: none;
        }

        .footer-left,
        .footer-middle,
        .footer-right {
            flex: 1 !important;
            padding: 0;
        }

        .footer-right {
            flex-direction: column;
            gap: 20px;
        }

        .footer-contact {
            font-size: 12px;
        }

        .section-title {
            font-size: 13px;
        }

        .footer-links {
            flex-direction: column;
            gap: 8px;

            a {
                font-size: 12px;
            }
        }

        .socials {
            flex-direction: column;
            gap: 10px;
        }

        .helpful-links {
            flex-direction: column;
        }

        .social-icons {
            gap: 10px;
        }

        .social-icon {
            width: 28px;
            height: 28px;
            font-size: 12px;
        }
    }
</style>
