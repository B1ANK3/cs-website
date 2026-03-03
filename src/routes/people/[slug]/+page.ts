import { getAllPeople } from '$lib/people';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const allPeople = await getAllPeople();
    const person = allPeople.find((p) => p.slug === params.slug);

    if (!person) {
        error(404, 'Person not found');
    }

    // Handle redirect if specified in frontmatter
    if (person.redirect) {
        redirect(302, person.redirect);
    }

    return {
        person
    };
};
