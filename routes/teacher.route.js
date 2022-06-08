import { Router } from "express";
import teacherController from "../controllers/teachersController.js";


const routerTeacher = new Router();

routerTeacher.get('/teachers', teacherController.getTeachers);
routerTeacher.post('/syncTeachers', teacherController.syncTeachers);
routerTeacher.post('/addTeachers', teacherController.addTeachers);
routerTeacher.post('/addTeachersByID', teacherController.addTeacherLink);
routerTeacher.post('/deleteTeachers', teacherController.deleteTeacher);
routerTeacher.post('/updateTeachers', teacherController.updateTeacher);

export default routerTeacher;