export interface HonoursInfo {
    title: string;
    description: string;
    keyPoints: string[];
}

export const honoursInfo: HonoursInfo = {
    title: 'Honours Programme',
    description:
        "The Honours degree in Computer Science is an intensive one-year program designed to bridge undergraduate and postgraduate study. It combines advanced coursework with a substantial research project, preparing students for either industry leadership roles or further research at master's or PhD level.",
    keyPoints: [
        'One-year intensive program following your undergraduate degree',
        'Combination of advanced coursework and research methodology',
        'Individual research project supervised by faculty',
        "Preparation for master's or PhD programs",
        'Development of critical research and analytical skills',
        'Smaller cohort with close faculty interaction'
    ]
};

export interface UsefulLink {
    title: string;
    description: string;
    url: string;
}

export const honoursLinks: UsefulLink[] = [
    {
        title: 'Honours Programme Handbook',
        description: 'Complete guide to course structure, requirements, and expectations',
        url: '/academics/honours/handbook'
    },
    {
        title: 'Research Project Guidelines',
        description: 'Information about project selection, supervision, and assessment',
        url: '/academics/honours/research-guidelines'
    },
    {
        title: 'Current Research Topics',
        description: 'Browse available research projects and supervisor interests',
        url: '/research'
    },
    {
        title: 'Postgraduate Student Support',
        description: 'Resources, counseling, and academic support services',
        url: '/faq/tutoring-support'
    },
    {
        title: 'Funding & Scholarships',
        description: 'Explore available funding opportunities for honours students',
        url: '/academics/honours/funding'
    }
];
