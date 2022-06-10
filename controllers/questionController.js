import questionService from "../services/questionService.js";
import { Question } from "../models/Queistion.js";

class questionController {
    async getQuestions(req, res) {
        try {
            const questions = await Question.find({});
            return res.json(questions);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addQuestion(req, res) {
        try {
            const date = req.body.date ? req.body.date : Date.now();
            const ques = Question({...req.body, date: date});
            await ques.save();
            return res.json(ques);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e);
        }
    }
    async updateQuestion(req,res) {
        try {
            const {_id, ...info} = req.body;
            const upd = await Question.updateOne({_id: _id},{ $set: info});
            return res.status(upd);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteQuestion(req,res) {
        try {
            const {_id} = req.body;
            const delQuestion = await Question.findOne({_id: _id}).remove();
            return res.status(delQuestion);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
}

export default new questionController();