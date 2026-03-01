<script lang="ts">
    import SULogo from '$lib/assets/svg/SULogo.svelte';
    import { resolve } from '$app/paths';
</script>

<footer class="footer">
    <div class="footer-container">
        <!-- Left Section: Logo, Address, Contact -->
        <div class="footer-section footer-left">
            <div class="footer-logo">
                <SULogo />
            </div>
            <div class="footer-contact">
                <p class="address">
                    [University Address]<br />
                    [City, State ZIP]
                </p>
                <p class="phone">Phone: [Phone Number]</p>
            </div>
        </div>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Middle Section: CS Department Links -->
        <div class="footer-section footer-middle">
            <h3 class="section-title">CS Division</h3>
            <ul class="footer-links">
                <li><a href="#">Undergraduate</a></li>
                <li><a href="#">Postgraduate</a></li>
                <li><a href="#">Masters</a></li>
                <li><a href="#">Doctors</a></li>
                <li><a href={resolve('/research')}>Research</a></li>
            </ul>
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
                <p>&copy; 2024 [University Name]. All rights reserved.</p>
            </div>
        </div>
    </div>
</footer>

<style lang="scss">
    @import '$lib/styles/globals.scss';

    .footer {
        background-color: $primary-color;
        color: $secondary-color;
        margin-top: auto;
        border-top: 1px solid $secondary-color;
    }

    .footer-container {
        max-width: $max-width;
        margin: 0 auto;
        padding: 40px 20px;
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
        flex: 0 1 250px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .footer-logo {
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;

        :global(svg) {
            width: 100%;
            height: 100%;
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
        flex: 0 1 180px;
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
        font-size: 14px;
        font-weight: 700;
        margin: 0 0 12px 0;
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
            color: $secondary-color;
            text-decoration: none;
            font-size: 13px;
            @include smooth-transition(color);

            &:hover {
                color: #e5d4a0;
                text-decoration: underline;
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
        background-color: rgba($secondary-color, 0.2);
        border-radius: 50%;
        color: $secondary-color;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
        @include smooth-transition(background-color, color);

        &:hover {
            background-color: rgba($secondary-color, 0.4);
            color: #fff;
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
            padding: 30px 15px;
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

        .footer-logo {
            width: 50px;
            height: 50px;
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
