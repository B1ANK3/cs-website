import { getAllEvents, getEventBySlug } from '$lib/events';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

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

export const entries: EntryGenerator = async () => {
    const events = await getAllEvents();
    // FIXME: Is this stable enough?
    return events.map((event) => ({ event: event.slug! }));
};

export const prerender = true;
