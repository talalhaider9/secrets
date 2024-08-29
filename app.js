//jshint esversion:6
require('dotenv').config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const { setThePassword } = require("whatwg-url");     //I dont know much about this this line was automatically written whr n i installed mongoose-encryption
const encrypt = require("mongoose-encryption");



const app = express();

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema =new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use (bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
    .then(result=>{
        console.log("Registration Successful");
        res.render("secrets");
    })
    .catch(err=>{
        console.log(err);
        
    });
    

});

app.post("/login", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(result=>{
        if(result.password === password){
            console.log("Log In Successful");
            
            res.render("secrets");
        }
    })
    .catch(err=>{
        console.log(err);
        
    });
})

app.listen("3000", (req, res)=>{
    console.log("server started on port 3000");
    
});