import { getAllResearchGroups } from '$lib/research';
import { getAllPeople } from '$lib/people';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const researchGroups = await getAllResearchGroups();
    const allPeople = await getAllPeople();

    return {
        researchGroups,
        allPeople
    };
};
