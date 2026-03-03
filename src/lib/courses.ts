import { resolve } from '$app/paths';
import type { Component } from 'svelte';

export type CourseType = 'core' | 'elective';
export type Programme = 'undergraduate' | 'postgraduate' | 'masters' | 'phd';
export type Stream =
    | 'AI & Machine Learning'
    | 'Cybersecurity'
    | 'Web & Mobile Development'
    | 'Data Science';
export type Semester = 'Fall' | 'Spring' | 'Summer' | 'Fall & Spring';

export interface CourseMeta {
    code: string;
    title: string;
    type: CourseType;
    programme: Programme;
    link: string;
    description: string;
    stream?: Stream;
    professor?: string;
    semester?: Semester;
}

export interface Course extends CourseMeta {
    component: Component;
}

// Dynamically import all .svx files from the courses directory
const courseModules = import.meta.glob('/src/lib/courses/*.svx', { eager: true });

export async function getAllCourses(): Promise<Course[]> {
    const courses: Course[] = [];

    for (const [, module] of Object.entries(courseModules)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = module as any;
        const meta = mod.metadata as CourseMeta;

        if (meta) {
            courses.push({
                ...meta,
                // @ts-expect-error - Resolve can't infer type
                link: resolve(meta.link),
                component: mod.default
            });
        }
    }

    return courses;
}

export function filterCoursesByType(courses: Course[], type: CourseType): Course[] {
    return courses.filter((course) => course.type === type);
}

export function filterCoursesByProgramme(courses: Course[], programme: Programme): Course[] {
    return courses.filter((course) => course.programme === programme);
}

export function filterCoursesByStream(courses: Course[], stream: Stream): Course[] {
    return courses.filter((course) => course.stream === stream);
}

export function getCourseByCode(courses: Course[], code: string): Course | undefined {
    return courses.find((course) => course.code.toLowerCase() === code.toLowerCase());
}

export function getCoreCourses(courses: Course[]): Course[] {
    return filterCoursesByType(courses, 'core');
}

export function getElectiveCourses(courses: Course[]): Course[] {
    return filterCoursesByType(courses, 'elective');
}

export function getCoursesByStream(courses: Course[]): Record<string, Course[]> {
    const electiveCourses = getElectiveCourses(courses);
    const grouped: Record<string, Course[]> = {};

    for (const course of electiveCourses) {
        if (course.stream) {
            if (!grouped[course.stream]) {
                grouped[course.stream] = [];
            }
            grouped[course.stream].push(course);
        }
    }

    return grouped;
}

export function sortCoursesByCode(courses: Course[], order: 'asc' | 'desc' = 'asc'): Course[] {
    return [...courses].sort((a, b) => {
        const comparison = a.code.localeCompare(b.code);
        return order === 'asc' ? comparison : -comparison;
    });
}

export function searchCourses(courses: Course[], searchQuery: string): Course[] {
    if (!searchQuery.trim()) return courses;

    const query = searchQuery.toLowerCase();
    return courses.filter(
        (course) =>
            course.code.toLowerCase().includes(query) ||
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.stream?.toLowerCase().includes(query)
    );
}
