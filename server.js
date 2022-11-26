// setup our requires
const express = require("express");
const app = express();
// const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const { read } = require("fs");
const { log } = require("util");
const schema = mongoose.Schema;

// MONGO DB
// pogoYc9BoWuK5bia - Password

const registration = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");
const blog = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");
const article = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");

const registrationSchema = new schema({
    "fName": String,
    "lName": String,
    "username": {
        "type": String,
        "unique": true
    },
    "email": {
        "type": String,
        "unique": true,
    },
    "Address": String,
    "postalCode": String,
    "country": String,
    "password": String
});

const blogSchema = new schema({
    "title": String,
    "content": String,
    "date": String,
    "image": String
});

const articleSchema = new schema({
    "title":String,
    "read": String
});

const userInfo = registration.model("registration", registrationSchema);
const blogContent = blog.model("blogDB", blogSchema);
const articleContent = article.model("articleDB", articleSchema);

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// Register handlebars as the rendering engine for views
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.use(bodyParser.urlencoded({ extended: true}));

//Router function for '/' page
app.get("/", function(req,res){
    res.render("index", {layout : false});
});

app.get("/blog", function(req,res){
    blogContent.find().exec().then((data) => {
        let log = new Array;
        data.forEach(element => {
            log.push({
                title: element.title,
                date: element.date,
                content: element.content,
                image: element.image
            });
        });
        res.render("blog", {title: log, layout:false});
    });
});

app.get("/admin", function(req,res){
    res.render("admin", {layout:false});
});

app.post("/admin", function(req,res){
    let articelData = new blogContent({
        title: req.body.title,
        content: req.body.content,
        date: req.body.data,
        image: req.body.img
    }).save((e, data) => {
        if(e) {
            console.log(e);
        } else {
            console.log(data);
        }
    });
    res.redirect("/");
});

app.post("/read_more", function(req,res){
    blogContent.findOne({title: req.body.title}).exec().then((data) => {
        res.render("read_more", {image: data.image, read: data.content, title: data.title, date: data.date, layout:false});
    });
});

app.post("/update", (req, res) => {
    blogContent.updateOne({
        _id: req.body.ids
    }, {
        $set: {
            title: req.body.title,
            date: req.body.dat,
            content: req.body.content,
            image: req.body.img
        }
    }).exec();
    res.redirect("/");
});

app.get("/login", function(req,res){
    res.sendFile(path.join(__dirname, "/login.html"));
});

//Router function for 'login' page
app.post("/login", function(req,res){
    var userdata = {
        user: req.body.username,
        pass: req.body.password,
        expression: /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(req.body.username)
    }

    if (userdata.user == "" || userdata.pass == "") {

        res.render("login", { data: userdata, layout: false });
        return;
    }

    else if (userdata.expression) {
        res.render("login", { data: userdata, layout: false });
        return;
    }
    else 
    {
        userInfo.findOne({username: userdata.user, password: userdata.pass}, ["fName", "lName", "username"]).exec().then((data) =>{
            if(data = "63815d4ca97e8e85fb46dc8e"){
                res.render("Admin_Dashboard", {fName: data.fName, lName: data.lName, username: data.username, layout: false});
                return;
            }
            else {
                res.render("User_Dashboard", {data: userdata, layout:false});
                return;
            }
             
        });
    }
    
});

//Router function for 'registration' page
app.get("/registration", function(req,res){
    res.sendFile(path.join(__dirname, "/registration.html"));
});

app.post("/registration", function(req,res){

    var userdata = {
        fName: req.body.fName,
        lName: req.body.lName,
        username: req.body.username,
        email: req.body.email,
        Address: req.body.Address,
        postalCode: req.body.postalCode,
        postaltest: /^[AaBbCcEeGgHiJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z] \d[A-Za-z]\d$/.test(req.body.postalCode),
        country: req.body.country,
        password: req.body.password,
        passwordtest: /^[0-9a-zA-Z]{6,12}$/.test(req.body.password),
        confirmpassword: req.body.confirmpassword,
    }

    var checkpass = function() {
        if (userdata.password == userdata.confirmpassword) {
            return true;
        }
        return false;
    }

    userdata.checkpassword = checkpass;

    if (userdata.fName == "" ||
        userdata.lName == "" ||
        userdata.username == "" ||
        userdata.email == "" ||
        userdata.Address == "" ||
        userdata.postalCode == "" ||
        userdata.country == "" ||
        userdata.password == "" ||
        userdata.confirmpassword == "") 

    {
        res.render("registration", { data: userdata, layout: false });
        return;
    }

    else if (!userdata.postaltest) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }
    else if (!userdata.passwordtest) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }
    else if (!userdata.checkpassword) {
        res.render("registration", { data: userdata, layout: false });
        return;
    } else {
        res.render("dashboard", {layout:false});
    }

    var accinfo = new userInfo({
        fName: userdata.fName,
        lName: userdata.lName,
        username: userdata.username,
        email:userdata.email,
        Address: userdata.Address,
        postalCode: userdata.postalCode,
        country: userdata.country,
        password: userdata.password
    }).save((e,data)=>{
        if(e){
            console.log(e);
        } else {
            console.log(data);
        }
    });    
    res.render("dashboard", {layout:false});
});

//Router function for page not found
app.get("/error", function(req,res){
    res.sendFile(path.join(__dirname, "/error.html"));
});

//Router to using images in .html giles
app.use(express.static("img"));

// start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);