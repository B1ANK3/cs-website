import { getAllEvents, sortEvents } from '$lib/events';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const events = await getAllEvents();
    const sortedEvents = sortEvents(events, 'date', 'asc');

    return {
        events: sortedEvents
    };
};

export const prerender = true;