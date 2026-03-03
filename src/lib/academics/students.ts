import { resolve } from '$app/paths';

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
            //@ts-expect-error - i hate you
            { label: 'Course Requirements', href: resolve('/faq#course-requirements') },
            //@ts-expect-error - i hate you
            { label: 'Internships', href: resolve('/faq#internships') },
            //@ts-expect-error - i hate you
            { label: 'Getting Started', href: resolve('/faq#getting-started') },
            //@ts-expect-error - i hate you
            { label: 'Research Opportunities', href: resolve('/faq#research-opportunities') }
        ]
    },
    {
        title: 'Useful Links & Resources',
        description:
            'Access important resources and links for student support and academic success.',
        links: [
            //@ts-expect-error - i hate you
            { label: 'Tutoring & Support', href: resolve('/faq#tutoring-support') },
            //@ts-expect-error - i hate you
            { label: 'Clubs & Organizations', href: resolve('/faq#clubs-organizations') },
            { label: 'Faculty & Staff', href: resolve('/people') },
            { label: 'Research Groups', href: resolve('/research') }
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
        name: 'Browse Courses',
        slug: 'browse-courses',
        description:
            'Explore our comprehensive course catalog across all academic levels and specializations.',
        href: resolve('/courses')
    },
    {
        name: 'Undergraduate',
        slug: 'undergraduate',
        description:
            "Bachelor's degree program in Computer Science with flexible specialization options.",
        href: resolve('/academics/undergraduate')
    },
    {
        name: 'Honours',
        slug: 'honours',
        description:
            'Intensive one-year bridging program combining advanced coursework with research.',
        href: resolve('/academics/honours')
    },
    {
        name: 'Postgraduate',
        slug: 'postgraduate',
        description: 'Graduate diploma and extended study programs for advanced learners.',
        href: resolve('/academics/postgraduate')
    },
    {
        name: "Master's",
        slug: 'masters',
        description: "Rigorous master's programs in specialized areas of computer science.",
        href: resolve('/academics/masters')
    },
    {
        name: 'PhD',
        slug: 'phd',
        description: 'Doctoral research programs advancing the boundaries of computer science.',
        href: resolve('/academics/phd')
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
        image: '',
        testimonial:
            'Our CS division provides world-class education combining cutting-edge research with practical applications. Students leave here ready to lead the next generation of technology innovation.'
    },
    {
        name: 'Prof. Michael Chen',
        title: 'Director of Graduate Studies',
        image: '',
        testimonial:
            "The collaborative environment here fosters groundbreaking research. We are proud of our graduate students' contributions to the field and their career achievements."
    },
    {
        name: 'Dr. Lisa Anderson',
        title: 'Director of Undergraduate Programs',
        image: '',
        testimonial:
            'We prepare undergraduate students not just for technical excellence, but for responsible leadership in computing. Our holistic approach ensures they thrive in any career path.'
    }
];
