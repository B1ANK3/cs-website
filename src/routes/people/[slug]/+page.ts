import { getAllPeople } from '$lib/people';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
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
}
