import { Router } from "express";
import { students, courses } from "../db/db";
import { zCoursePostBody, zCoursePutBody } from "../schemas/courseSchema";
const router = Router();
// READ all
router.get("/", (req, res) => {
    const result = students.map((std) => {
        const coursesDetails = courses.filter((cou) => std.courses?.includes(cou.courseId));
        return {
            studentId: std.studentId,
            firstName: std.firstName,
            lastName: std.lastName,
            program: std.program,
            programId: std.programId,
            courses: coursesDetails
        };
    });
    return res.json(result);
});
// CREATE //ต้องไปเพิ่ม setting postman header / boby -> row -> type json 
router.post("/", async (req, res, next) => {
    try {
        const body = await req.body;
        // console.log(req.body,body);
        // เอา data ที่เป็น any type ไป validate โดยใช้ zod schema
        const result = zCoursePostBody.safeParse(body); // check zod
        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error
            });
        }
        //check duplicate course id
        const foundDupe = courses.find((couses) => couses.courseId === req.body.courseId);
        if (foundDupe) {
            return res.status(400).json({ ok: false, message: "Course Id already exists" });
        }
        const newCouse = courses.push(body);
        return res.json(newCouse);
        // return res.json({ ok: true, message: "successfuly" });
    }
    catch (err) {
        next(err);
    }
});
router.put("/", async (req, res, next) => {
    try {
        const body = await req.body;
        // console.log(req.body,body);
        const parseResult = zCoursePutBody.safeParse(body);
        if (parseResult.success === false) {
            return res.status(400).json({
                ok: false,
                message: parseResult.error.issues[0].message,
            });
        }
        const foundIndex = courses.findIndex((std) => std.courseId === body.courseId);
        if (foundIndex === -1) {
            return res.status(400).json({
                ok: false,
                message: "Course Id does not exist",
            });
        }
        courses[foundIndex] = { ...courses[foundIndex], ...body };
        return res.json({ ok: true, course: courses[foundIndex] });
    }
    catch (err) {
        next(err);
    }
});
export default router;
