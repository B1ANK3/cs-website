import { error } from '@sveltejs/kit';
import { getAllCourses, getCourseByCode } from '$lib/courses';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
    const path = params.path;

    // Extract the course code from the path (e.g., "cs101" from "/courses/cs101")
    const courseCode = path.toLowerCase();

    const allCourses = await getAllCourses();
    const course = getCourseByCode(allCourses, courseCode);

    if (!course) {
        throw error(404, `Course ${courseCode.toUpperCase()} not found`);
    }

    return {
        course
    };
};
