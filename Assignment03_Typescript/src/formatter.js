/* PROVIDED — no implementation required for the reduced assignment. */
export function formatCourse(course) {
    return `${course.code} - ${course.title} | Department: ${course.department} | Credits: ${course.credits} | Enrollment: ${course.enrollment} | Rating: ${course.rating} | ${course.online ? "Online" : "In person"}`;
}
