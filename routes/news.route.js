import { Router } from "express";
import newsController from "../controllers/newsController.js";


const routerNews = new Router();

routerNews.get('/news', newsController.getNews);
routerNews.post('/syncNews', newsController.syncNews);
routerNews.post('/updateNews', newsController.updateNews);
routerNews.post('/deleteNews', newsController.deleteNews);
routerNews.post('/addNews', newsController.addNews);
routerNews.get('/keywords', newsController.getKeyword);
routerNews.post('/addKeyword', newsController.addKeyword);
routerNews.post('/deleteKeyword', newsController.deleteKeyword);

export default routerNews;