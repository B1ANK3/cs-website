import { getAllEvents, filterEventsByTag, sortEvents } from '$lib/events';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const allEvents = await getAllEvents();
    const undergradEvents = filterEventsByTag(allEvents, '#undergrad');
    const sortedEvents = sortEvents(undergradEvents, 'date', 'asc');

    return {
        undergradEvents: sortedEvents
    };
};
