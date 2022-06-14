import { News } from "../models/News.js";
import newsService from "../services/newsService.js";
import { Keyword } from "../models/Keywords.js";



class newsController {
    async getNews(req,res) {
        try {
            const {limit, page} = req.body;
            const news = await News.find({});
            return res.json(news);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addNews(req,res) {
        try {
            const {title, date, content, category} = req.body;
            const news = new News({title, date, content, category});

            return res.json(await news.save());
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async updateNews(req,res) {
        try {
            const {_id, title, date, category, content} = req.body;
            const upd = await News.updateOne({_id: _id},{ $set: {title, date, category, content}});
            return res.json(upd);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

    async syncNews(req, res) {
        try {
            const keys = await Keyword.find({}).exec();
            const keyWords = [];
            keys.map(el => {
                keyWords.push(el.name.toLowerCase());
            })
            await newsService.syncNews(keyWords);
            const news = await News.find({}).exec();
            return res.json(news);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteNews(req,res) {
        try {
            const {_id} = req.body;
            const delNews = await News.findOne({_id: _id}).remove();
            return res.json({...delNews, _id: _id});
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async getKeyword(req,res) {
        try {
            const key = await Keyword.find({});
            return res.json(key);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async addKeyword(req,res) {
        try {
            const {keyword} = req.body;
            const keyW = new Keyword({name: keyword});
            const key = await keyW.save();
            return res.json(key);
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }
    async deleteKeyword(req,res) {
        try {
            const {_id} = req.body;
            const keyword = await Keyword.findOne({_id:_id}).remove();
            return res.json({_id: _id, keyword});
        } catch(e) {
            console.log(e);
            return res.status(400).json(e)
        }
    }

}

export default new newsController();