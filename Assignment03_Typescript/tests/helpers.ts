import type { Course } from "../src/models";
export function createCourse(overrides: Partial<Course> = {}): Course {
  return { id: 1, code: "CS101", title: "Introduction to Programming", department: "CS", credits: 3, enrollment: 20, rating: 4, online: false, ...overrides };
}
