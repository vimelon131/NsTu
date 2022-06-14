import { Teacher } from "../models/Teacher.js";
import teacherService from "../services/teacherService.js";
import needle from 'needle';

class teacherController {
    async getTeachers(req,res) {
        try {
            const teachers = await Teacher.find({});
            return res.json(teachers);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncTeachers(req,res) {
        try {
            const pageContent = await needle("get", `https://ciu.nstu.ru/kaf/asu/about/persons`);
            await teacherService.syncTeachers(pageContent);
            const teachers = await Teacher.find({}).exec();
            return res.json(teachers);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async addTeachers(req, res) {
        try {
            const teacher = new Teacher(req.body);
            return res.json(await teacher.save());
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addTeacherLink(req,res) {
        try {
            const {link} = req.body; 
            const pageContent = await needle("get", link);
            await teacherService.addTeacherByLink(pageContent,link);
            const teachers = await Teacher.find({});
            return res.json(teachers);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteTeacher(req,res) {
        try {
            const {_id} = req.body;
            const delTeacher = await Teacher.findOne({_id: _id}).remove();
            return res.json({...delTeacher, _id: _id});
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async updateTeacher(req,res) {
        try {
            const {_id, ...info} = req.body;
            const teacher = await Teacher.updateOne({_id: _id},{ $set: info})
            return res.status(teacher);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
}

export default new teacherController();