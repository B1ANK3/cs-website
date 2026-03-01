<script lang="ts">
    // Contact page for the Computer Science department
</script>

<svelte:head>
    <title>Contact Us - Computer Science Department</title>
    <meta name="description" content="Contact information for the Computer Science department" />
</svelte:head>

<div class="contact-page">
    <div class="contact-container">
        <h1 class="page-title">Contact Us</h1>
        <p class="subtitle">Get in touch with the Computer Science Department</p>

        <div class="contact-grid">
            <!-- Email Addresses Section -->
            <section class="contact-section">
                <h2 class="section-title">Email Addresses</h2>
                <div class="contact-list">
                    <div class="contact-item">
                        <h3>Administrative Enquiries</h3>
                        <a href="mailto:admin@cs.university.edu" class="contact-link">
                            admin@cs.university.edu
                        </a>
                    </div>
                    <div class="contact-item">
                        <h3>Postgraduate Enquiries</h3>
                        <a href="mailto:postgrad@cs.university.edu" class="contact-link">
                            postgrad@cs.university.edu
                        </a>
                    </div>
                    <div class="contact-item">
                        <h3>Undergraduate Enquiries</h3>
                        <a href="mailto:undergrad@cs.university.edu" class="contact-link">
                            undergrad@cs.university.edu
                        </a>
                    </div>
                </div>
            </section>

            <!-- Address Section -->
            <section class="contact-section">
                <h2 class="section-title">Physical Address</h2>
                <div class="contact-item">
                    <p class="address-line">Computer Science Department</p>
                    <p class="address-line">School of Computing</p>
                    <p class="address-line">University Campus</p>
                    <p class="address-line">Building 42, Room 301</p>
                    <p class="address-line">123 University Drive</p>
                    <p class="address-line">City, State 12345</p>
                </div>
            </section>

            <!-- Postal Address Section -->
            <section class="contact-section">
                <h2 class="section-title">Postal Address</h2>
                <div class="contact-item">
                    <p class="address-line">Computer Science Department</p>
                    <p class="address-line">P.O. Box 5678</p>
                    <p class="address-line">University Station</p>
                    <p class="address-line">City, State 12345-5678</p>
                </div>
            </section>

            <!-- Phone & Fax Section -->
            <section class="contact-section">
                <h2 class="section-title">Phone & Fax</h2>
                <div class="contact-list">
                    <div class="contact-item">
                        <h3>Telephone</h3>
                        <a href="tel:+15551234567" class="contact-link"> +1 (555) 123-4567 </a>
                    </div>
                    <div class="contact-item">
                        <h3>Fax</h3>
                        <p class="contact-link">+1 (555) 123-4568</p>
                    </div>
                </div>
            </section>

            <!-- Coordinates Section -->
            <section class="contact-section">
                <h2 class="section-title">Coordinates</h2>
                <div class="contact-item">
                    <p class="coordinate-line">
                        <strong>Latitude:</strong> 40.7128° N
                    </p>
                    <p class="coordinate-line">
                        <strong>Longitude:</strong> 74.0060° W
                    </p>
                    <a
                        href="https://www.google.com/maps?q=40.7128,-74.0060"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="map-link"
                    >
                        View on Google Maps →
                    </a>
                </div>
            </section>

            <!-- QR Code Section -->
            <section class="contact-section qr-section">
                <h2 class="section-title">Quick Access</h2>
                <div class="qr-container">
                    <div class="qr-placeholder">
                        <svg viewBox="0 0 200 200" class="qr-code">
                            <!-- Simple QR code placeholder pattern -->
                            <rect width="200" height="200" fill="white" />
                            <rect x="10" y="10" width="30" height="30" fill="black" />
                            <rect x="160" y="10" width="30" height="30" fill="black" />
                            <rect x="10" y="160" width="30" height="30" fill="black" />
                            <rect x="50" y="30" width="10" height="10" fill="black" />
                            <rect x="70" y="30" width="10" height="10" fill="black" />
                            <rect x="90" y="30" width="10" height="10" fill="black" />
                            <rect x="110" y="30" width="10" height="10" fill="black" />
                            <rect x="130" y="30" width="10" height="10" fill="black" />
                            <rect x="50" y="50" width="10" height="10" fill="black" />
                            <rect x="90" y="50" width="10" height="10" fill="black" />
                            <rect x="130" y="50" width="10" height="10" fill="black" />
                            <rect x="50" y="70" width="10" height="10" fill="black" />
                            <rect x="70" y="70" width="10" height="10" fill="black" />
                            <rect x="110" y="70" width="10" height="10" fill="black" />
                            <rect x="130" y="70" width="10" height="10" fill="black" />
                            <rect x="30" y="90" width="10" height="10" fill="black" />
                            <rect x="70" y="90" width="10" height="10" fill="black" />
                            <rect x="90" y="90" width="10" height="10" fill="black" />
                            <rect x="110" y="90" width="10" height="10" fill="black" />
                            <rect x="50" y="110" width="10" height="10" fill="black" />
                            <rect x="90" y="110" width="10" height="10" fill="black" />
                            <rect x="130" y="110" width="10" height="10" fill="black" />
                            <rect x="70" y="130" width="10" height="10" fill="black" />
                            <rect x="110" y="130" width="10" height="10" fill="black" />
                            <rect x="30" y="150" width="10" height="10" fill="black" />
                            <rect x="70" y="150" width="10" height="10" fill="black" />
                            <rect x="90" y="150" width="10" height="10" fill="black" />
                            <rect x="130" y="150" width="10" height="10" fill="black" />
                        </svg>
                    </div>
                    <p class="qr-description">Scan to visit our homepage</p>
                    <p class="qr-note">Replace this SVG with an actual QR code</p>
                </div>
            </section>
        </div>

        <!-- Office Hours Section -->
        <section class="office-hours">
            <h2 class="section-title">Office Hours</h2>
            <div class="hours-grid">
                <div class="hours-item">
                    <strong>Monday - Friday:</strong> 9:00 AM - 5:00 PM
                </div>
                <div class="hours-item">
                    <strong>Saturday - Sunday:</strong> Closed
                </div>
            </div>
        </section>
    </div>
</div>

<style lang="scss">
    .contact-page {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 2rem 1rem;
    }

    .contact-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .page-title {
        font-size: 2.5rem;
        font-weight: 700;
        text-align: center;
        color: #1a202c;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        text-align: center;
        color: #718096;
        font-size: 1.125rem;
        margin-bottom: 3rem;
    }

    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }

    .contact-section {
        background: #f7fafc;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid #4299e1;
        transition:
            transform 0.2s,
            box-shadow 0.2s;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
    }

    .qr-section {
        border-left-color: #48bb78;
    }

    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e2e8f0;
    }

    .contact-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .contact-item {
        h3 {
            font-size: 1rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 0.5rem;
        }

        p {
            margin: 0.25rem 0;
            color: #4a5568;
            line-height: 1.6;
        }
    }

    .contact-link {
        color: #3182ce;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
            color: #2c5282;
            text-decoration: underline;
        }
    }

    .address-line {
        margin: 0.25rem 0;
        color: #4a5568;
        line-height: 1.6;
    }

    .coordinate-line {
        margin: 0.5rem 0;
        color: #4a5568;
        line-height: 1.6;

        strong {
            color: #2d3748;
        }
    }

    .map-link {
        display: inline-block;
        margin-top: 1rem;
        color: #3182ce;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s;

        &:hover {
            color: #2c5282;
            text-decoration: underline;
        }
    }

    .qr-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .qr-placeholder {
        width: 200px;
        height: 200px;
        margin-bottom: 1rem;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
    }

    .qr-code {
        width: 100%;
        height: 100%;
        display: block;
    }

    .qr-description {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 0.5rem;
    }

    .qr-note {
        font-size: 0.875rem;
        color: #a0aec0;
        font-style: italic;
    }

    .office-hours {
        background: #edf2f7;
        padding: 2rem;
        border-radius: 8px;
    }

    .hours-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }

    .hours-item {
        background: white;
        padding: 1rem;
        border-radius: 6px;
        color: #4a5568;
        text-align: center;

        strong {
            color: #2d3748;
        }
    }

    @media (max-width: 768px) {
        .page-title {
            font-size: 2rem;
        }

        .contact-grid {
            grid-template-columns: 1fr;
        }

        .contact-container {
            padding: 1rem;
        }
    }
</style>
