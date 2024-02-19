import express from "express";
import mongoose from "mongoose";
import shopRoutes from "./routers/shopDetail.js";
import cors from "cors";
import twilio from "twilio";
import MessagingResponse from "twilio/lib/twiml/MessagingResponse.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import shopDetail from "./models/shopDetail.js";


const app=express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
dotenv.config();

mongoose.connect('mongodb://localhost/shop-details')
.then(()=>console.log('connected to database'))
.catch((err)=>console.log(`Error: ${err}`));

app.use('/api',shopRoutes);

app.get("/",(req, res)=>
  res.send("Hello World"))

const accountSid = process.env.MY_ACCOUNT_SID;
const authToken = process.env.MY_ACCOUNT_AUTH_TOKEN;
const client = twilio(accountSid,authToken)
app.post('/sms', async(req, res) => {
    const twiml = new MessagingResponse();
    
    const { Body,From} = req.body;
    if (!Body) {
        console.error('No message body received');
        res.status(400).send('Bad Request');
        return;}
    const [address, shopType] = Body.split(',');
    try {
        let shops=[];
        const regex = new RegExp('.*' + address + '.*', 'i');
        shops = await shopDetail.find({city: {$regex:regex}, shopType: {$regex:shopType,$options:'i'}});
        console.log(shops);
        let responseMessage = "Shops matching your criteria:\n";
        shops.forEach(shop => {
            responseMessage += `${shop.openingHours}: ${shop.mobileNo}:${shop.address}\n`;
            console.log(responseMessage)
        });
        await client.messages.create({
            body: responseMessage,
            from:  '+14344044467',
            to: From
        });

        // Send a response to Twilio
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
        return;
      }
      
      catch(err)
      {
        console.log(err);
        twiml.message('An Error occured while processing you request');
  
        res.status(500).type('text/xml').send(twiml.toString());
        return;
      }
    
  });




app.listen(8800,()=>{
    console.log("connected to server")
})