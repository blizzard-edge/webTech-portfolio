import { describe, expect, test } from "vitest";
import { formatCourse } from "../src/formatter";
import { createCourse } from "./helpers";

test("provided formatter includes required information",()=>{const c=createCourse({code:"CS999",title:"Advanced Web Systems",department:"CS",credits:4,enrollment:37,rating:4.8,online:true});const r=formatCourse(c);expect(r).toContain("CS999");expect(r).toContain("Advanced Web Systems");expect(r).toContain("CS");expect(r).toContain("4");expect(r).toContain("37");expect(r).toContain("4.8");expect(r.toLowerCase()).toContain("online");});
