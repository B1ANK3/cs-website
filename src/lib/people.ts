import type { Component } from 'svelte';

export interface PersonMeta {
    name: string;
    title: string;
    email: string;
    about: string;
    image: string;
    type: 'staff' | 'student' | 'alumni';
    slug?: string;
    redirect?: string;
}

export interface Person extends PersonMeta {
    component: Component;
}

// Dynamically import all .svx files from the people directory
const peopleModules = import.meta.glob('/src/lib/people/*.svx', { eager: true });

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

function loadPeople(modules: Record<string, unknown>): Person[] {
    const people: Person[] = [];

    for (const [, module] of Object.entries(modules)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = module as any;
        const meta = mod.metadata as PersonMeta;

        if (meta) {
            // const filename = path.split('/').pop()?.replace('.svx', '') || '';
            people.push({
                ...meta,
                slug: slugify(meta.name),
                component: mod.default
            });
        }
    }

    return people;
}

export async function getAllPeople(): Promise<Person[]> {
    return loadPeople(peopleModules);
}

export function getPeopleByType(type: 'staff' | 'student' | 'alumni'): Person[] {
    const allPeople = loadPeople(peopleModules);
    return allPeople.filter((person) => person.type === type);
}

export function filterPeopleByName(people: Person[], searchTerm: string): Person[] {
    const term = searchTerm.toLowerCase();
    return people.filter(
        (person) =>
            person.name.toLowerCase().includes(term) || person.title.toLowerCase().includes(term)
    );
}
