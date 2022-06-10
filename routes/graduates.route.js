import { Router } from "express";
import graduatesController from "../controllers/graduatesController.js";


const routerGraduates = new Router();

routerGraduates.get('/graduates', graduatesController.getGraduates);
routerGraduates.post('/syncGraduates', graduatesController.syncGraduates);
routerGraduates.post('/addGraduates', graduatesController.addGraduates);
routerGraduates.post('/deleteGraduates', graduatesController.deleteGraduates);
routerGraduates.post('/updateGraduates', graduatesController.updateGraduates);

export default routerGraduates;