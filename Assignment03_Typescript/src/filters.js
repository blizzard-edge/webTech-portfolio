/** TODO: Apply all supplied filters without mutating courses. */
export function filterCourses(courses, department, minimumRating, onlineOnly) {
    return courses.filter((course) => {
        // Apply the department filter when a department is selected.
        if (department !== undefined && department !== "" && course.department !== department) {
            return false;
        }
        // Apply the minimum rating filter when a minimum rating is specified.
        if (minimumRating !== undefined && course.rating < minimumRating) {
            return false;
        }
        // Apply the online-only filter when enabled.
        if (onlineOnly == true && !course.online) {
            return false;
        }
        return true;
    });
}
/** TODO: Search code, title, and department; case-insensitive; trim input. */
export function searchCourses(courses, searchTerm) {
    // Trim whitespace and normalize the search term for case-insensitive matching.
    const search = searchTerm.trim().toLowerCase();
    // A blank search returns all courses without modifying the original array.
    if (search === "") {
        return [...courses];
    }
    return courses.filter((course) => course.code.toLowerCase().includes(search) ||
        course.title.toLowerCase().includes(search) ||
        course.department.toLowerCase().includes(search));
}
/** TODO: Sort title/rating/enrollment; ascending by default; do not mutate input. */
export function sortCourses(courses, field, descending = false) {
    // Create a copy so sorting does not mutate the original course array.
    const sortedCourses = [...courses];
    sortedCourses.sort((a, b) => {
        let comparison;
        // Compare titles alphabetically.
        if (field === "title") {
            comparison = a.title.localeCompare(b.title);
        }
        // Compare ratings.
        else if (field === "rating") {
            comparison = a.rating - b.rating;
        }
        // Compare enrollment.
        else if (field === "enrollment") {
            comparison = a.enrollment - b.enrollment;
        }
        else {
            comparison = 0;
        }
        return descending ? -comparison : comparison;
    });
    return sortedCourses;
}
