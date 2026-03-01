import { getAllEvents, getEventBySlug } from '$lib/events';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const events = await getAllEvents();
    const event = getEventBySlug(events, params.event);

    if (!event) {
        error(404, 'Event not found');
    }

    return {
        event
    };
};
