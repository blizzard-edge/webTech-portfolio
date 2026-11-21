import { describe, expect, test } from "vitest";
import { groupBy, getCourseById } from "../src/utils";
import { createCourse } from "./helpers";

describe("utilities", () => {
  test("groupBy",()=>{const courses=[createCourse({id:1,department:"CS"}),createCourse({id:2,department:"MATH"}),createCourse({id:3,department:"CS"})];const grouped=groupBy(courses,"department");expect(grouped.CS.map(c=>c.id)).toEqual([1,3]);expect(grouped.MATH.map(c=>c.id)).toEqual([2]);});
  test("generic groupBy",()=>{const people=[{name:"A",role:"student"},{name:"B",role:"faculty"},{name:"C",role:"student"}];const grouped=groupBy(people,"role");expect(grouped.student).toHaveLength(2);expect(grouped.faculty).toHaveLength(1);});
  test("course by id",()=>{const courses=[createCourse({id:10}),createCourse({id:20})];expect(getCourseById(courses,20)?.id).toBe(20);});
  test("missing id",()=>expect(getCourseById([createCourse({id:10})],99)).toBeUndefined());
});
