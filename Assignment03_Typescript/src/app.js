import "./style.css";
import { courses } from "./data";
import { filterCourses, searchCourses, sortCourses } from "./filters";
import { calculateAverageRating, calculateTotalEnrollment } from "./statistics";
const searchInput = document.querySelector("#searchInput");
const departmentSelect = document.querySelector("#departmentSelect");
const ratingSelect = document.querySelector("#ratingSelect");
const onlineOnly = document.querySelector("#onlineOnly");
const sortSelect = document.querySelector("#sortSelect");
const descending = document.querySelector("#descending");
const courseTableBody = document.querySelector("#courseTableBody");
const courseCount = document.querySelector("#courseCount");
const averageRating = document.querySelector("#averageRating");
const totalEnrollment = document.querySelector("#totalEnrollment");
const emptyMessage = document.querySelector("#emptyMessage");
/** TODO: Read controls, transform courses, render, and update statistics. */
export function render() {
    if (!searchInput ||
        !departmentSelect ||
        !ratingSelect ||
        !onlineOnly ||
        !sortSelect ||
        !descending) {
        return;
    }
    // Start with the supplied course data.
    let displayedCourses = courses;
    // Apply the current search term.
    displayedCourses = searchCourses(displayedCourses, searchInput.value);
    // Apply the selected department, rating, and online filters.
    displayedCourses = filterCourses(displayedCourses, departmentSelect.value, Number(ratingSelect.value), onlineOnly.checked);
    // Apply the selected sort field and direction.
    displayedCourses = sortCourses(displayedCourses, sortSelect.value, descending.checked);
    // Display the resulting courses and update statistics for those courses.
    renderCourses(displayedCourses);
    updateStatistics(displayedCourses);
}
function renderCourses(filteredCourses) {
    if (!courseTableBody || !emptyMessage)
        return;
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
function updateStatistics(filteredCourses) {
    if (!courseCount || !averageRating || !totalEnrollment)
        return;
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
