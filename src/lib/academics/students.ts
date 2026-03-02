export interface StudentResource {
    title: string;
    description: string;
    links: Array<{
        label: string;
        href: string;
    }>;
    icon?: string;
}

export const studentResources: StudentResource[] = [
    {
        title: 'FAQ & Course Guidance',
        description:
            'Find answers to common questions about courses, requirements, and academic planning.',
        links: [
            { label: 'Course Requirements', href: '/faq#course-requirements' },
            { label: 'Getting Started', href: '/faq#getting-started' },
            { label: 'Internships', href: '/faq#internships' },
            { label: 'Research Opportunities', href: '/faq#research-opportunities' }
        ]
    },
    {
        title: 'Useful Links & Resources',
        description:
            'Access important resources and links for student support and academic success.',
        links: [
            { label: 'Tutoring & Support', href: '/faq#tutoring-support' },
            { label: 'Clubs & Organizations', href: '/faq#clubs-organizations' },
            { label: 'Faculty & Staff', href: '/people' },
            { label: 'Research Groups', href: '/research' }
        ]
    }
];

export interface AcademicArea {
    name: string;
    slug: string;
    description: string;
    href: string;
}

export const academicAreas: AcademicArea[] = [
    {
        name: 'Undergraduate',
        slug: 'undergraduate',
        description:
            "Bachelor's degree program in Computer Science with flexible specialization options.",
        href: '/academics/undergraduate'
    },
    {
        name: 'Honours',
        slug: 'honours',
        description:
            'Intensive one-year bridging program combining advanced coursework with research.',
        href: '/academics/honours'
    },
    {
        name: 'Postgraduate',
        slug: 'postgraduate',
        description: 'Graduate diploma and extended study programs for advanced learners.',
        href: '/academics/postgraduate'
    },
    {
        name: "Master's",
        slug: 'masters',
        description: "Rigorous master's programs in specialized areas of computer science.",
        href: '/academics/masters'
    },
    {
        name: 'PhD',
        slug: 'phd',
        description: 'Doctoral research programs advancing the boundaries of computer science.',
        href: '/academics/phd'
    }
];

export interface ProfessorTestimonial {
    name: string;
    title: string;
    image: string;
    testimonial: string;
}

export const professorTestimonials: ProfessorTestimonial[] = [
    {
        name: 'Dr. Sarah Johnson',
        title: 'Department Chair, AI & Machine Learning',
        image: '/images/professors/sarah-johnson.jpg',
        testimonial:
            'Our CS division provides world-class education combining cutting-edge research with practical applications. Students leave here ready to lead the next generation of technology innovation.'
    },
    {
        name: 'Prof. Michael Chen',
        title: 'Director of Graduate Studies',
        image: '/images/professors/michael-chen.jpg',
        testimonial:
            "The collaborative environment here fosters groundbreaking research. We are proud of our graduate students' contributions to the field and their career achievements."
    },
    {
        name: 'Dr. Lisa Anderson',
        title: 'Director of Undergraduate Programs',
        image: '/images/professors/lisa-anderson.jpg',
        testimonial:
            'We prepare undergraduate students not just for technical excellence, but for responsible leadership in computing. Our holistic approach ensures they thrive in any career path.'
    }
];
