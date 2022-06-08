import { Speciality } from "../models/Speciality.js";
import specService from "../services/specService.js";

class specsController {
    async getSpecs(req,res) {
        try {
            const specs = await Speciality.find({});
            return res.json(specs);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addSpecs(req,res) {
        try {
            const spec = new Speciality(req.body);
            return res.json(await spec.save());
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async updateSpecs(req,res) {
        try {
            const {_id, ...info} = req.body;
            const spec = await Speciality.updateOne({_id: _id},{ $set: info})
            return res.status(spec);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncSpecs(req, res) {
        try {
            await specService.syncSpecs();
            const specs = Speciality.find({});
            return res.status(specs);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteSpecs(req,res) {
        try {
            const {_id} = req.body;
            const delSpec = await Speciality.findOne({_id: _id}).remove();
            return res.status(delSpec);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
}

export default new specsController();