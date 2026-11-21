import { describe, expect, test } from "vitest";
import { calculateAverageRating, calculateTotalEnrollment, findMostPopularCourse } from "../src/statistics";
import { createCourse } from "./helpers";

describe("statistics", () => {
  test("average", () => expect(calculateAverageRating([createCourse({rating:4}), createCourse({id:2,rating:5})])).toBe(4.5));
  test("empty average", () => expect(calculateAverageRating([])).toBe(0));
  test("rounding", () => expect(calculateAverageRating([createCourse({rating:4.1}),createCourse({id:2,rating:4.2}),createCourse({id:3,rating:4.8})])).toBe(4.37));
  test("total enrollment", () => expect(calculateTotalEnrollment([createCourse({enrollment:20}),createCourse({id:2,enrollment:35})])).toBe(55));
  test("most popular", () => {
    const popular=createCourse({id:3,enrollment:99});
    expect(findMostPopularCourse([createCourse(),popular,createCourse({id:4,enrollment:50})])).toEqual(popular);
  });
  test("empty popular", () => expect(findMostPopularCourse([])).toBeUndefined());
});
