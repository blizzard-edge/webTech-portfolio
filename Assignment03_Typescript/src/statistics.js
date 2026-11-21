/** TODO: Average rating, rounded to two decimal places. Empty = 0. */
export function calculateAverageRating(courses) {
    if (courses.length === 0) {
        return 0;
    }
    // Add all ratings and divide by the number of courses.
    const totalRating = courses.reduce((sum, course) => sum + course.rating, 0);
    // Round the average to two decimal places.
    return Math.round((totalRating / courses.length) * 100) / 100;
}
/** TODO: Total enrollment. Empty = 0. */
export function calculateTotalEnrollment(courses) {
    // Sum enrollment without modifying the original course collection.
    return courses.reduce((sum, course) => sum + course.enrollment, 0);
}
/** TODO: Course with largest enrollment. Empty = undefined. */
export function findMostPopularCourse(courses) {
    if (courses.length === 0) {
        return undefined;
    }
    let mostPopularCourse = courses[0];
    // Only replace the current course when a strictly larger enrollment is found,
    // so ties remain resolved according to the original input order.
    for (const course of courses) {
        if (course.enrollment > mostPopularCourse.enrollment) {
            mostPopularCourse = course;
        }
    }
    return mostPopularCourse;
}
/** PROVIDED: Uses your statistics functions. */
export function calculateDepartmentStatistics(courses) {
    const departments = new Set(courses.map(course => course.department));
    const result = {};
    for (const department of departments) {
        const departmentCourses = courses.filter(course => course.department === department);
        result[department] = {
            count: departmentCourses.length,
            averageRating: calculateAverageRating(departmentCourses),
            totalEnrollment: calculateTotalEnrollment(departmentCourses)
        };
    }
    return result;
}
