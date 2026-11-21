import type { Course } from "./models";

/* PROVIDED — no implementation required for the reduced assignment. */
export function formatCourse(course: Course): string {
  return `${course.code} - ${course.title} | Department: ${course.department} | Credits: ${course.credits} | Enrollment: ${course.enrollment} | Rating: ${course.rating} | ${course.online ? "Online" : "In person"}`;
}
