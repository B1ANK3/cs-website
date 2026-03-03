import { asset } from '$app/paths';

export interface UndergraduateProgrammeMeta {
    title: string;
    summary: string;
    frontImage: string;
}

export const programmeData: UndergraduateProgrammeMeta = {
    title: 'Programme Structure & Pathways',
    summary:
        'Our 4-year Bachelor of Science in Computer Science offers flexible specialization tracks, industry placements, and research opportunities. Learn about degree requirements, credit structures, and career pathways available to undergraduate students.',
    frontImage: asset('/images/academics/programme-structure.jpg')
};
