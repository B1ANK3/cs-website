import { asset } from '$app/paths';

export interface UndergraduateModuleMeta {
    title: string;
    summary: string;
    frontImage: string;
}

export const modulesData: UndergraduateModuleMeta = {
    title: 'Core & Elective Modules',
    summary:
        'Explore our comprehensive curriculum offering foundational courses in algorithms, data structures, software engineering, and specialized electives in AI, cybersecurity, web development, and more. Build a strong technical foundation while pursuing your areas of interest.',
    frontImage: asset('/images/academics/modules-overview.jpg')
};
