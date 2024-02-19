import ShopDetail from "../models/shopDetail.js";
import { validationResult } from "express-validator";

export const getShopDetails =async (req, res) => {
  
    const shopDetail = new ShopDetail(req.body);
    const result=validationResult(shopDetail);
      if (!result.isEmpty()) {                  // error is true
        res.status(400).send(err);  //bad request
          
      } 
      try{
        await shopDetail.save();
        res.status(200).send("Shop Details Saved");
      }
    
  catch (err) {
    console.log(err);
    res.status(500).send("Server Error"); //server error
  }
};
