import express from "express";
import { getShopDetails } from "../controllers/shopdetail.js";


const router = express.Router();    ;

router.post('/shopdetails',getShopDetails); 

export default router;