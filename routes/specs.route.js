import { Router } from "express";
import specsController from "../controllers/specsConstroller.js";


const routerSpec = new Router();

routerSpec.get('/specs', specsController.getSpecs);
routerSpec.post('/syncSpecs', specsController.syncSpecs);
routerSpec.post('/updateSpecs', specsController.updateSpecs);
routerSpec.post('/addSpecs', specsController.addSpecs);
routerSpec.post('/deleteSpecs', specsController.deleteSpecs);
export default routerSpec;