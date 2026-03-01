import type { Component } from 'svelte';

export interface ResearchLink {
    title: string;
    url: string;
}

export interface ResearchMeta {
    name: string;
    slug: string;
    description: string;
    summary: string;
    realWorldApplications: string[];
    members: string[];
    links: ResearchLink[];
}

export interface ResearchGroup extends ResearchMeta {
    component: Component;
    colorIndex?: number;
}

// Dynamically import all .svx files from the research directory
const researchModules = import.meta.glob('/src/lib/research/*.svx', { eager: true });

function loadResearchGroups(modules: Record<string, any>): ResearchGroup[] {
    const groups: ResearchGroup[] = [];

    for (const [_, module] of Object.entries(modules)) {
        const mod = module as any;
        const meta = mod.metadata as ResearchMeta;

        if (meta) {
            groups.push({
                ...meta,
                component: mod.default,
                colorIndex: groups.length
            });
        }
    }

    return groups;
}

export async function getAllResearchGroups(): Promise<ResearchGroup[]> {
    return loadResearchGroups(researchModules);
}

export function getResearchGroupBySlug(
    slug: string,
    groups: ResearchGroup[]
): ResearchGroup | undefined {
    return groups.find((group) => group.slug === slug);
}

export function searchResearchGroups(groups: ResearchGroup[], query: string): ResearchGroup[] {
    const lowerQuery = query.toLowerCase();
    return groups.filter(
        (group) =>
            group.name.toLowerCase().includes(lowerQuery) ||
            group.description.toLowerCase().includes(lowerQuery) ||
            group.realWorldApplications.some((app) => app.toLowerCase().includes(lowerQuery))
    );
}

// Color palette for research groups - cycling through different accent colors
export const groupColors = [
    { bg: 'rgba(210, 39, 48, 0.08)', border: '#d22730', name: 'red' },
    { bg: 'rgba(202, 162, 88, 0.08)', border: '#caa258', name: 'gold' },
    { bg: 'rgba(97, 34, 59, 0.08)', border: '#61223b', name: 'purple' },
    { bg: 'rgba(84, 153, 139, 0.12)', border: '#549b8b', name: 'teal' }
];

export function getGroupColor(index: number) {
    return groupColors[index % groupColors.length];
}
