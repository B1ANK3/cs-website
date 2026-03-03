import { getAllCourses, sortCoursesByCode } from '$lib/courses';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const courses = await getAllCourses();

    return {
        courses: sortCoursesByCode(courses)
    };
};

export const prerender = true;