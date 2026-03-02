import type { Component } from 'svelte';

export interface EventMeta {
    title: string;
    description: string;
    mainImage: string;
    date: string; // ISO date string
    time?: string; // e.g., "2:00 PM - 4:00 PM"
    endDate?: string; // ISO date string for multi-day events
    location: string;
    summary?: string;
    pinned?: boolean;
    hosts?: string[]; // Array of people hosting
    speakers?: string[]; // Array of speakers
    organizers?: string[]; // Array of organizers
    attendees?: string[]; // Array of attendees
    tags?: string[]; // Array of tags (e.g., ['#undergrad', '#research'])
    slug?: string;
    calendarLink?: string; // iCal or Google Calendar link
}

export interface Event extends EventMeta {
    component: Component;
}

// Dynamically import all .svx files from the events directory
const eventModules = import.meta.glob('/src/lib/events/*.svx', { eager: true });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export async function getAllEvents(): Promise<Event[]> {
    const events: Event[] = [];

    for (const [, module] of Object.entries(eventModules)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = module as any; // What type is this
        const meta = mod.metadata as EventMeta;

        if (meta) {
            // const filename = path.split('/').pop()?.replace('.svx', '') || '';
            events.push({
                ...meta,
                slug: meta.slug || slugify(meta.title),
                component: mod.default
            });
        }
    }

    return events;
}

export function sortEvents(
    events: Event[],
    sortBy: 'date' | 'title' = 'date',
    order: 'asc' | 'desc' = 'asc'
): Event[] {
    // Separate pinned and non-pinned events
    const pinned = events.filter((e) => e.pinned);
    const unpinned = events.filter((e) => !e.pinned);

    // Sort each group
    const sortGroup = (group: Event[]) => {
        return [...group].sort((a, b) => {
            let aVal: string | Date;
            let bVal: string | Date;

            if (sortBy === 'date') {
                aVal = new Date(a.date);
                bVal = new Date(b.date);
            } else {
                aVal = a.title;
                bVal = b.title;
            }

            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return order === 'asc' ? comparison : -comparison;
        });
    };

    // Combine with pinned events first
    return [...sortGroup(pinned), ...sortGroup(unpinned)];
}

export function filterEvents(events: Event[], searchQuery: string): Event[] {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter(
        (event) =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.toLowerCase().includes(query) ||
            event.hosts?.some((h) => h.toLowerCase().includes(query)) ||
            event.speakers?.some((s) => s.toLowerCase().includes(query))
    );
}

export function filterEventsByTag(events: Event[], tag: string): Event[] {
    if (!tag.trim()) return events;

    const normalizedTag = tag.toLowerCase().startsWith('#')
        ? tag.toLowerCase()
        : `#${tag.toLowerCase()}`;
    return events.filter((event) => event.tags?.some((t) => t.toLowerCase() === normalizedTag));
}

export function getEventBySlug(events: Event[], slug: string): Event | undefined {
    return events.find((event) => event.slug === slug);
}

export function getUpcomingEvents(events: Event[], days: number = 30): Event[] {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return events.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= futureDate;
    });
}

export function getPastEvents(events: Event[]): Event[] {
    const now = new Date();
    return events.filter((event) => new Date(event.date) < now);
}

// Helper function to format date for display
export function formatEventDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Helper function to get month for display on cards
export function getEventMonth(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

// Helper function to get day for display on cards
export function getEventDay(date: string): string {
    const d = new Date(date);
    return d.getDate().toString().padStart(2, '0');
}

// Helper function to generate Google Calendar link
export function generateGoogleCalendarLink(event: Event): string {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
        `${event.description}\n\nLocation: ${event.location}\n${
            event.speakers ? `Speakers: ${event.speakers.join(', ')}\n` : ''
        }${event.hosts ? `Hosts: ${event.hosts.join(', ')}` : ''}`
    );
    const location = encodeURIComponent(event.location);
    const startDate = event.date.replace(/-/g, '');
    const endDate = event.endDate ? event.endDate.replace(/-/g, '') : startDate;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
}

// Helper function to generate iCal link
export function generateICalLink(event: Event): string {
    // const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CS Sun Website//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${event.date.replace(/-/g, '')}
DTEND:${event.endDate ? event.endDate.replace(/-/g, '') : event.date.replace(/-/g, '')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icalData)}`;
}
