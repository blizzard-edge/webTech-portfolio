import { describe, expect, test } from "vitest";
import { filterCourses, searchCourses, sortCourses } from "../src/filters";
import { createCourse } from "./helpers";

describe("filters", () => {
  const courses=[
    createCourse({id:1,code:"CS101",title:"Intro Programming",department:"CS",rating:4,online:false,enrollment:20}),
    createCourse({id:2,code:"CS205",title:"Web Development",department:"CS",rating:4.7,online:true,enrollment:35}),
    createCourse({id:3,code:"MATH240",title:"Statistics",department:"MATH",rating:4.2,online:true,enrollment:40})
  ];
  test("department",()=>expect(filterCourses(courses,"CS").map(c=>c.id)).toEqual([1,2]));
  test("minimum rating",()=>expect(filterCourses(courses,undefined,4.5).map(c=>c.id)).toEqual([2]));
  test("online",()=>expect(filterCourses(courses,undefined,undefined,true).map(c=>c.id)).toEqual([2,3]));
  test("combined",()=>expect(filterCourses(courses,"CS",4.5,true).map(c=>c.id)).toEqual([2]));
  test("search",()=>{expect(searchCourses(courses,"web").map(c=>c.id)).toEqual([2]);expect(searchCourses(courses,"MATH").map(c=>c.id)).toEqual([3]);expect(searchCourses(courses,"cs205").map(c=>c.id)).toEqual([2]);});
  test("trim",()=>expect(searchCourses(courses,"  web  ").map(c=>c.id)).toEqual([2]));
  test("sort title",()=>expect(sortCourses(courses,"title").map(c=>c.title)).toEqual(["Intro Programming","Statistics","Web Development"]));
  test("sort rating descending",()=>expect(sortCourses(courses,"rating",true).map(c=>c.id)).toEqual([2,3,1]));
  test("sort enrollment ascending",()=>expect(sortCourses(courses,"enrollment").map(c=>c.id)).toEqual([1,2,3]));
});
