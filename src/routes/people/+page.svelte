<script lang="ts">
    // Sample staff data - replace with actual data
    const staff = [
        {
            id: 1,
            name: 'Dr. John Smith',
            title: 'Professor of Computer Science',
            email: 'john.smith@university.edu',
            about: 'Specializes in machine learning and artificial intelligence with over 15 years of experience.',
            image: 'https://via.placeholder.com/200?text=Dr.+John+Smith',
            research: '#'
        },
        {
            id: 2,
            name: 'Dr. Sarah Johnson',
            title: 'Associate Professor',
            email: 'sarah.johnson@university.edu',
            about: 'Expert in software engineering and program verification. Currently leading research on automated testing.',
            image: 'https://via.placeholder.com/200?text=Dr.+Sarah+Johnson',
            research: '#'
        },
        {
            id: 3,
            name: 'Prof. Michael Chen',
            title: 'Senior Lecturer',
            email: 'michael.chen@university.edu',
            about: 'Focuses on natural language processing and computational linguistics with multiple publications.',
            image: 'https://via.placeholder.com/200?text=Prof.+Michael+Chen',
            research: '#'
        },
        {
            id: 4,
            name: 'Dr. Emily Rodriguez',
            title: 'Lecturer',
            email: 'emily.rodriguez@university.edu',
            about: 'Passionate about robotics and autonomous systems. Mentors several doctoral students.',
            image: 'https://via.placeholder.com/200?text=Dr.+Emily+Rodriguez',
            research: '#'
        },
        {
            id: 5,
            name: 'Dr. James Wilson',
            title: 'Research Fellow',
            email: 'james.wilson@university.edu',
            about: 'Specialist in broadband and mobile networks. Active contributor to network optimization research.',
            image: 'https://via.placeholder.com/200?text=Dr.+James+Wilson',
            research: '#'
        },
        {
            id: 6,
            name: 'Prof. Lisa Anderson',
            title: 'Senior Researcher',
            email: 'lisa.anderson@university.edu',
            about: 'Expert in automata theory and formal languages. Published over 30 peer-reviewed papers.',
            image: 'https://via.placeholder.com/200?text=Prof.+Lisa+Anderson',
            research: '#'
        }
    ];
</script>

<!-- Meet the Staff Section -->
<section class="section">
    <div class="section-container">
        <h1 class="section-heading">Meet the Staff</h1>

        <div class="staff-grid">
            {#each staff as member (member.id)}
                <div class="staff-card">
                    <div class="card-image">
                        <img src={member.image} alt={member.name} />
                    </div>

                    <div class="card-content">
                        <h2 class="staff-name">{member.name}</h2>
                        <p class="staff-title">{member.title}</p>

                        <div class="divider"></div>

                        <a href="mailto:{member.email}" class="staff-email">{member.email}</a>

                        <div class="about-section">
                            <h3 class="about-heading">About</h3>
                            <p class="about-text">{member.about}</p>
                        </div>

                        <a href={member.research} class="research-link">View Research →</a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
	@import '$lib/styles/globals.scss';
    .section {
        width: 100%;
        padding: 80px 20px;
        background-color: #ffffff;
    }

    .section-container {
        max-width: $max-width;
        margin: 0 auto;
        width: 100%;
    }

    .section-heading {
        font-size: 48px;
        margin: 0 0 50px 0;
        color: $text-color;
        text-align: center;
    }

    .staff-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 40px;
        width: 100%;
    }

    .staff-card {
        background-color: #ffffff;
        border: 1px solid $border-color;
        border-radius: 8px;
        overflow: hidden;
        @include smooth-transition(all);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

        &:hover {
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            transform: translateY(-4px);
        }
    }

    .card-image {
        width: 100%;
        height: 250px;
        overflow: hidden;
        background-color: $light-bg;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .card-content {
        padding: 30px;
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .staff-name {
        font-size: 22px;
        margin: 0 0 8px 0;
        color: $text-color;
    }

    .staff-title {
        font-size: 14px;
        color: $primary-color;
        font-weight: 600;
        margin: 0 0 15px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .divider {
        height: 1px;
        background-color: $border-color;
        margin: 15px 0;
    }

    .staff-email {
        font-size: 14px;
        color: $primary-color;
        text-decoration: none;
        @include smooth-transition(all);

        &:hover {
            text-decoration: underline;
        }
    }

    .about-section {
        margin: 15px 0;
        flex: 1;
    }

    .about-heading {
        font-size: 12px;
        color: #999;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0 0 8px 0;
        font-weight: 600;
    }

    .about-text {
        font-size: 14px;
        line-height: 1.6;
        color: #666;
        margin: 0;
    }

    .research-link {
        font-size: 14px;
        color: $primary-color;
        text-decoration: none;
        font-weight: 600;
        margin-top: 15px;
        @include smooth-transition(all);
        display: inline-block;

        &:hover {
            color: darken($primary-color, 10%);
            transform: translateX(4px);
        }
    }

    // Responsive
    @media (max-width: $tablet-breakpoint) {
        .staff-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 30px;
        }

        .section-heading {
            font-size: 36px;
            margin-bottom: 40px;
        }
    }

    @media (max-width: $mobile-breakpoint) {
        .section {
            padding: 60px 20px;
        }

        .staff-grid {
            grid-template-columns: 1fr;
            gap: 20px;
        }

        .section-heading {
            font-size: 28px;
            margin-bottom: 30px;
        }

        .card-content {
            padding: 20px;
        }

        .staff-name {
            font-size: 18px;
        }

        .about-text {
            font-size: 13px;
        }
    }
</style>
