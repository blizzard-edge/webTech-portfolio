import "./style.css";
import { courses } from "./data";
import { filterCourses, searchCourses, sortCourses } from "./filters";
import { calculateAverageRating, calculateTotalEnrollment } from "./statistics";

const searchInput = document.querySelector<HTMLInputElement>("#searchInput");
const departmentSelect = document.querySelector<HTMLSelectElement>("#departmentSelect");
const ratingSelect = document.querySelector<HTMLSelectElement>("#ratingSelect");
const onlineOnly = document.querySelector<HTMLInputElement>("#onlineOnly");
const sortSelect = document.querySelector<HTMLSelectElement>("#sortSelect");
const descending = document.querySelector<HTMLInputElement>("#descending");
const courseTableBody = document.querySelector<HTMLTableSectionElement>("#courseTableBody");
const courseCount = document.querySelector<HTMLElement>("#courseCount");
const averageRating = document.querySelector<HTMLElement>("#averageRating");
const totalEnrollment = document.querySelector<HTMLElement>("#totalEnrollment");
const emptyMessage = document.querySelector<HTMLElement>("#emptyMessage");

/** TODO: Read controls, transform courses, render, and update statistics. */
export function render(): void {
    if (
    !searchInput ||
    !departmentSelect ||
    !ratingSelect ||
    !onlineOnly ||
    !sortSelect ||
    !descending
  ) {
    return;
  }

  // Start with the supplied course data.
  let displayedCourses = courses;

  // Apply the current search term.
  displayedCourses = searchCourses(
    displayedCourses,
    searchInput.value
  );

  // Apply the selected department, rating, and online filters.
  displayedCourses = filterCourses(
    displayedCourses,
    departmentSelect.value,
    Number(ratingSelect.value),
    onlineOnly.checked
  );
  
  // Apply the selected sort field and direction.
  displayedCourses = sortCourses(
    displayedCourses,
    sortSelect.value as "title" | "rating" | "enrollment",
    descending.checked
  );

  // Display the resulting courses and update statistics for those courses.
  renderCourses(displayedCourses);
  updateStatistics(displayedCourses);
}

function renderCourses(filteredCourses: typeof courses): void {
  if (!courseTableBody || !emptyMessage) return;
  courseTableBody.innerHTML = "";
  for (const course of filteredCourses) {
    const row = document.createElement("tr");
    const values = [course.code, course.title, course.department, String(course.credits), String(course.enrollment), course.rating.toFixed(1), course.online ? "Yes" : "No"];
    for (const value of values) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    }
    courseTableBody.appendChild(row);
  }
  emptyMessage.hidden = filteredCourses.length !== 0;
}

function updateStatistics(filteredCourses: typeof courses): void {
  if (!courseCount || !averageRating || !totalEnrollment) return;
  courseCount.textContent = String(filteredCourses.length);
  averageRating.textContent = calculateAverageRating(filteredCourses).toFixed(2);
  totalEnrollment.textContent = String(calculateTotalEnrollment(filteredCourses));
}

const controls = [searchInput, departmentSelect, ratingSelect, onlineOnly, sortSelect, descending];
for (const control of controls) {
  control?.addEventListener("input", render);
  control?.addEventListener("change", render);
}
render();
