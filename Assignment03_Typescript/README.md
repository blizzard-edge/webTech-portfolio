# TypeScript Data Explorer

## 1. Assignment Overview

In this assignment, you will complete the core functionality of a partially implemented <b>TypeScript web application. </b>

The application displays a collection of university courses and allows the user to:

- Search courses
- Filter courses
- Sort courses
- View course statistics
- Interact with the application through the browser

The purpose of the assignment is to practice **TypeScript programming in a realistic web-development setting**. You are not simply writing isolated examples; your functions will work together as part of a small application.

---

# 2. Learning Objectives

After completing this assignment, you should be able to:

- Define TypeScript interfaces and types.
- Use generic functions.
- Use typed function parameters and return values.
- Work with arrays of objects.
- Use optional parameters.
- Use union types.
- Process data using appropriate array operations.
- Handle empty and boundary cases.
- Preserve the original data when required.
- Work with ES modules.
- Connect TypeScript to HTML elements.
- Respond to browser events.
- Debug an existing TypeScript function.
- Test your code using automated tests.

---

# 3. Required Software

You need:

- Node.js 20 or later
- npm
- Git
- A GitHub account
- A modern web browser
- A code editor such as VS Code

Check your versions:

```bash
node --version
npm --version
```

---

# 4. Getting Started

After accepting the GitHub Classroom assignment, clone your repository:

```bash
git clone YOUR-REPOSITORY-URL
cd YOUR-REPOSITORY-NAME
```

Install the project dependencies:

```bash
npm ci
```

If `npm ci` reports that `package-lock.json` is missing, make sure you are working in the repository provided by GitHub Classroom50 and that the file was committed to the repository.

---

# 5. Commands You Should Know

### Type-check your code

```bash
npm run typecheck
```

This checks your TypeScript without creating the production build.

### Run the tests

```bash
npm test
```

### Build the application

```bash
npm run build
```

### Start the development server

```bash
npm run dev
```

The terminal will provide a local URL. Open that URL in your browser.

Before submitting, run all three:

```bash
npm run typecheck
npm test
npm run build
```

---

# 6. Repository Structure

You will work primarily in:

```text
src/
├── app.ts
├── data.ts
├── filters.ts
├── formatter.ts
├── models.ts
├── statistics.ts
├── style.css
└── utils.ts
```

Tests are located in:

```text
tests/
```

The GitHub Actions workflow is located in:

```text
.github/
└── workflows/
    └── autograding.yml
```

You normally should not need to modify the workflow.

---

# 7. Assignment Tasks

## TODO 1 — Define the Course Model

### File

```text
src/models.ts
```

### Function/type

```typescript
Course
```

### What you need to do

Complete the `Course` interface.

Every course has the following properties:

| Property | Description |
|---|---|
| `id` | Unique numeric identifier |
| `code` | Course code such as `CS101` |
| `title` | Course title |
| `department` | Department such as `CS` or `MATH` |
| `credits` | Number of course credits |
| `enrollment` | Number of enrolled students |
| `rating` | Course rating |
| `online` | Whether the course is online |

Use appropriate TypeScript types.

### Requirements

- Do not use `any`.
- Do not make required properties optional.
- Do not remove any of the listed properties.

---

# TODO 2 — Implement the Generic `groupBy()` Function

### File

```text
src/utils.ts
```

### Function

```typescript
groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]>
```

### Goal

Group objects according to the value of a selected property.

For example, if courses are grouped by department, all courses belonging to `CS` should appear together, all `MATH` courses together, and so on.

### Important requirements

Your function must:

- Work with `Course` objects.
- Work with other object types as well.
- Use the supplied generic function signature.
- Return an object whose properties represent the groups.
- Preserve the order of objects within each group.
- Handle an empty input array.
- Not modify the input array.

### Important

Do not change the function into a Course-specific function.

The purpose of this task is to demonstrate that you understand **TypeScript generics**.

---

# TODO 3 — Calculate Average Rating

### File

```text
src/statistics.ts
```

### Function

```typescript
calculateAverageRating(courses: Course[]): number
```

### Requirements

Return the average rating of all supplied courses.

For example, ratings:

```text
4.0
4.5
5.0
```

should produce:

```text
4.5
```

The result must be rounded to **two decimal places**.

For an empty array:

```text
[]
```

return:

```text
0
```

### Consider

Your implementation should not assume that the array always contains at least one course.

---

# TODO 4 — Calculate Total Enrollment

### File

```text
src/statistics.ts
```

### Function

```typescript
calculateTotalEnrollment(courses: Course[]): number
```

### Requirements

Return the total number of enrolled students across all supplied courses.

For example:

```text
20 + 35 + 40 = 95
```

For an empty array, return:

```text
0
```

The original course objects must not be modified.

---

# TODO 5 — Find the Most Popular Course

### File

```text
src/statistics.ts
```

### Function

```typescript
findMostPopularCourse(
  courses: Course[]
): Course | undefined
```

### Definition

For this assignment, the most popular course is the course with the **largest enrollment**.

### Requirements

- Return the course with the highest enrollment.
- Return `undefined` if the array is empty.
- Return the original course object rather than creating a replacement course.
- Correctly handle a course with a very small or very large enrollment.

If multiple courses have the same highest enrollment, your implementation should behave consistently with the order of the supplied data.

---

# TODO 6 — Filter Courses

### File

```text
src/filters.ts
```

### Function

```typescript
filterCourses(
  courses: Course[],
  department?: string,
  minimumRating?: number,
  onlineOnly?: boolean
): Course[]
```

### Supported filters

The function supports three filters.

### Department

If a department is supplied, return only courses belonging to that department.

Example:

```text
CS
```

should exclude `MATH`, `CYBR`, and `ENGL`.

### Minimum rating

If a minimum rating is supplied, return courses whose rating is **greater than or equal to** that value.

For example, a minimum rating of `4.5` should include:

```text
4.5
4.6
4.7
...
```

but not:

```text
4.49
4.4
```

### Online only

If `onlineOnly` is `true`, return only courses whose `online` property is `true`.

If it is `false` or not supplied, do not remove courses merely because they are not online.

### Combining filters

The filters must work together.

For example:

```text
Department = CS
Minimum rating = 4.5
Online only = true
```

means a course must satisfy **all three conditions**.

### Important

Do not modify the original `courses` array.

---

# TODO 7 — Search Courses

### File

```text
src/filters.ts
```

### Function

```typescript
searchCourses(
  courses: Course[],
  searchTerm: string
): Course[]
```

### Search fields

The search must examine:

- Course code
- Course title
- Department

### Case-insensitivity

These searches should produce equivalent results:

```text
typescript
TypeScript
TYPESCRIPT
TyPeScRiPt
```

### Whitespace

Leading and trailing whitespace should be ignored.

For example:

```text
"   web   "
```

should behave like:

```text
"web"
```

### Blank search

A blank or whitespace-only search should not cause the application to fail.

It should behave as a request to show all courses.

### Important

Do not modify the original course collection.

---

# TODO 8 — Sort Courses

### File

```text
src/filters.ts
```

### Function

```typescript
sortCourses(
  courses: Course[],
  field: "title" | "rating" | "enrollment",
  descending?: boolean
): Course[]
```

### Supported fields

You must support:

```text
title
rating
enrollment
```

### Default behavior

If `descending` is not supplied, sorting should be ascending.

Examples:

- Titles: alphabetical order
- Ratings: lowest to highest
- Enrollment: smallest to largest

### Descending behavior

When:

```text
descending = true
```

the order should be reversed.

### Important requirement — immutability

The function must return a **new array**.

It must not change the order of the original `courses` array.

This is an important part of the assignment and may be tested automatically.

---

# PROVIDED — Course Formatting

### File

```text
src/formatter.ts
```

The `formatCourse()` function is already implemented in this reduced version.

You do not need to implement it.

However, you should read the implementation because it demonstrates how a TypeScript object can be converted into display text.

---

# PROVIDED — Department Statistics

### File

```text
src/statistics.ts
```

The `calculateDepartmentStatistics()` function is already implemented.

You do not need to implement this function.

However, it calls your:

```text
calculateAverageRating()
calculateTotalEnrollment()
```

functions.

Therefore, your implementation of those functions must be correct for department statistics to work.

---

# TODO 9 — Debug `getCourseById()`

### File

```text
src/utils.ts
```

### Function

```typescript
getCourseById(
  courses: Course[],
  id: number
): Course | undefined
```

The starter implementation contains a bug.

Your job is to identify and fix it.

### Requirements

- Return the course whose ID matches the supplied ID.
- Return `undefined` when there is no matching course.
- Do not change the function signature.
- Do not replace it with unrelated application logic.

### Required explanation

After fixing the function, add a short code comment explaining:

1. What the original bug was.
2. Why it caused incorrect results.
3. Why your correction works.

This explanation is part of the assignment.

---

# TODO 10 — Integrate the Web Application

### File

```text
src/app.ts
```

### Function

```typescript
render(): void
```

This is the largest integration task.

The application already contains HTML controls for:

- Search
- Department
- Minimum rating
- Online only
- Sort field
- Descending order

Your `render()` function must read the current values of those controls and produce the correct displayed course collection.

### Required processing

The application should:

1. Start with the supplied course data.
2. Apply the search.
3. Apply the selected filters.
4. Apply sorting.
5. Render the resulting courses.
6. Update the statistics.

### Table

The course table should display the courses that remain after the current search/filter/sort settings are applied.

### Statistics

The statistics section should represent the **currently displayed courses**, not always the complete course dataset.

It should update:

- Number of courses
- Average rating
- Total enrollment

### Empty results

If no courses match the current criteria, the supplied empty-state message should be displayed.

### Important

Do not remove the existing event listeners or HTML controls.

---

# 8. What You May Change

You may:

- Implement the TODO sections.
- Add small helper functions.
- Add comments that explain your reasoning.
- Improve variable names within your own implementation.
- Add tests for your own code.

---

# 9. What You Should Not Change

Do not:

- Remove required function signatures.
- Replace TypeScript with JavaScript.
- Disable strict TypeScript checking.
- Use `any` to bypass errors.
- Modify the automated tests simply to make them pass.
- Modify the GitHub Actions workflow to bypass grading.
- Hard-code expected test results.
- Replace the project with another framework.
- Remove required HTML controls.
- Submit an unrelated application.

---

# 10. Automated Testing

The repository contains tests that check the required behavior.

Run:

```bash
npm test
```


# 11. GitHub Actions

The repository contains:

```text
.github/workflows/autograding.yml
```

GitHub Actions will run when you push your work.

The workflow checks:

```text
npm ci
npm run typecheck
npm test
npm run build
```

You can see the results under the **Actions** tab of your GitHub repository.

Do not modify the workflow to bypass tests.

---

# 12. AI Tools and Academic Integrity

AI tools such as ChatGPT, Claude, GitHub Copilot, and similar tools may be used as learning assistants according to the instructor's course policy.

However, **you are responsible for every line of code you submit**.

You should be able to explain:

- your TypeScript types;
- your generic function;
- your filtering logic;
- your search behavior;
- your sorting behavior;
- your handling of empty input;
- why you preserved the original array when required;
- how the browser controls connect to your functions.

Using AI to learn is different from submitting code that you cannot explain.

---

# 13. Recommended Development Order

A recommended order is:

```text
1. Course interface
2. groupBy()
3. calculateAverageRating()
4. calculateTotalEnrollment()
5. findMostPopularCourse()
6. filterCourses()
7. searchCourses()
8. sortCourses()
9. getCourseById()
10. render()
```

<b>Run the tests frequently instead of waiting until everything is completed.</b>

---

# 14. Final Submission Checklist

Before submitting, run:

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Then verify:

- [ ] No TypeScript errors.
- [ ] Tests pass.
- [ ] Application builds successfully.
- [ ] Search works.
- [ ] Filters work.
- [ ] Sorting works.
- [ ] Statistics update.
- [ ] Empty results are handled.
- [ ] Original arrays are not unnecessarily modified.
- [ ] No `any` was added to bypass type checking.
- [ ] `getCourseById()` includes the required explanation.
- [ ] You can explain your implementation.

Finally:

```bash
git add .
git commit -m "Complete TypeScript Data Explorer"
git push
```

Your GitHub Classroom50 repository is your submission.
