/** TODO: Implement a generic grouping function. */
export function groupBy(items, key) {
    const result = {};
    for (const item of items) {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
    }
    return result;
}
/** TODO: Fix this implementation and explain the original bug in a comment. */
export function getCourseById(courses, id) {
    // The original implementation compared course.id to id + 1,
    // which shifted the requested ID and could return the wrong course
    // or undefined. Comparing directly to id returns the course whose
    // ID actually matches the supplied ID.
    return courses.find((course) => course.id === id);
}
