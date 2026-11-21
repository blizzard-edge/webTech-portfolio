import type { Course } from "./models";

export const courses: Course[] = [
  { id: 1, code: "CS101", title: "Introduction to Programming", department: "CS", credits: 3, enrollment: 42, rating: 4.2, online: false },
  { id: 2, code: "CS205", title: "Web Development", department: "CS", credits: 3, enrollment: 35, rating: 4.7, online: true },
  { id: 3, code: "CS315", title: "TypeScript Engineering", department: "CS", credits: 3, enrollment: 28, rating: 4.9, online: true },
  { id: 4, code: "CYBR220", title: "Network Security", department: "CYBR", credits: 3, enrollment: 31, rating: 4.4, online: false },
  { id: 5, code: "CYBR330", title: "Secure Web Applications", department: "CYBR", credits: 3, enrollment: 24, rating: 4.8, online: true },
  { id: 6, code: "MATH110", title: "College Algebra", department: "MATH", credits: 3, enrollment: 61, rating: 3.9, online: true },
  { id: 7, code: "MATH240", title: "Statistics", department: "MATH", credits: 3, enrollment: 47, rating: 4.1, online: false },
  { id: 8, code: "ENGL210", title: "Technical Writing", department: "ENGL", credits: 3, enrollment: 29, rating: 4.3, online: true }
];
