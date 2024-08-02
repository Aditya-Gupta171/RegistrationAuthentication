const express = require("express");
const mongoose = require("mongoose");
const bodyparser=require("body-parser");
const dotenv = require("dotenv");


const app=express();
dotenv.config();

const port=process.env.PORT || 3000;

//mongodb conncection  onlilne step
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster1.uqkphgd.mongodb.net/registrationFormDB`)
.then(() => console.log('connected to mongoDb Atlas'))
.catch(err =>console.error('error connecting to MongoDb Atlas:',err));


////////creting schema
const registrationSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})
//model of registrtaion schema 
const Registration=mongoose.model("Registration",registrationSchema);
app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json());


app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register",async (req,res)=>{
    try {
        const {name, email, password} =req.body;
        const existingUser = await Registration.findOne({email:email});
        //checking if there is existing user.
        if(!existingUser){
            const registrationData=new Registration({
                name,
                email,
                password
            });
           await registrationData.save();
           res.redirect("/success");
        }
        else{
            console.log("user already exist");
            res.redirect("/error"); 
        }
    } catch(error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
})      

app.get("/error",(req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})


app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})