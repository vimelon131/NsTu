import graduateService from "../services/graduateService.js";
import { Graduate } from "../models/Graduates.js";
import { v4 as uuidv4 } from 'uuid';
import config from 'config';

class graduatesController {
    async getGraduates(req, res) {
        try {
            const graduates = await Graduate.find({});
            return res.json(graduates);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async syncGraduates(req, res) {
        try {
            await graduateService.syncGraduates();
            const graduate = await Graduate.find({});
            return res.json(graduate);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e);
        }
    }
    async addGraduates(req,res) {
        try {
            const {...info} = req.body;
            if (req.files?.file) {
                const file = req.files.file
                const avatartName = uuidv4() + '.jpg'
                file.mv(config.get("staticPath")+ "\\" + avatartName);
                info.img = avatartName;
            } 
            const graduate = new Graduate({...info});
            return res.json(await graduate.save());
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async updateGraduates(req,res) {
        try {
            const {_id, ...info} = req.body;
            if (req.files?.file) {
                const file = req.files.file
                const avatartName = uuidv4() + '.jpg'
                file.mv(config.get("staticPath")+ "\\" + avatartName);
                info.img = avatartName;
            } 
            const upd = await Graduate.updateOne({_id: _id},{ $set: {...info}});
            return res.status(upd);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteGraduates(req,res) {
        try {
            const {_id} = req.body;
            const delNews = await Graduate.findOne({_id: _id}).remove();
            return res.status(delNews);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
}

export default new graduatesController();