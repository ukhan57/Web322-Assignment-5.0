// setup our requires
const express = require("express");
const app = express();
// const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const { read } = require("fs");
const schema = mongoose.Schema;

// MONGO DB
// pogoYc9BoWuK5bia - Password

const registration = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");
const blog = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");
const article = mongoose.createConnection("mongodb+srv://Ukhan:pogoYc9BoWuK5bia@cluster0.qkcbfzy.mongodb.net/DB1?retryWrites=true&w=majority");

const registrationSchema = new schema({
    "fName": String,
    "lName": String,
    "email": String,
    "username": {
        "type": String,
        "unique": true
    },
    "Address": String,
    "city": String,
    "postalCode": String,
    "country": String,
    "password": {
        "type": String,
        "unique": true
    }
});

const blogSchema = new schema({
    "title": String,
    "content": String
});

const articleSchema = new schema({
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

    if (userdata.expression) {
        res.render("login", { data: userdata, layout: false });
        return;
    }

    userInfo.findOne({ username: userdata.user, password: userdata.pass }, ["fname", "lname", "username"]).exec().then((data) => {
        if (data) {
            if (data.id == "6366c66a9afb45a8af4a82c4") {
                res.render("login_Dashboard", { fname: data.fname, lname: data.lname, username: data.username, layout: false });
                return;
            }
            else {
                res.render("loginuser_Dashboard", { fname: data.fname, lname: data.lname, username: data.username, layout: false });
                return;
            }
        } else {
            res.render("login", { error: "Sorry, you entered the wrong username and/or password", layout: false });
            return;
        }
    });
});

// //Router function for 'registration' page
// app.get("/registration", function(req,res){
//     res.sendFile(path.join(__dirname, "/registration.html"));
// });

// app.post("registration", function(req,res){

//     var userdata = {
//         fName: req.body.fname,
//         lName: req.body.lname,
//         email: req.body.email,
//         phonenumber: req.body.phonenumber,
//         city: req.body.city,
//         phonetest: /^\d{10}$/.test(req.body.phonenumber),
//         Address: req.body.Address,
//         postalCode: req.body.postalcode,
//         postaltest: /^[AaBbCcEeGgHiJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z] \d[A-Za-z]\d$/.test(req.body.postalcode),
//         country: req.body.country,
//         password: req.body.password,
//         passwordtest: /^[0-9a-zA-Z]{6,12}$/.test(req.body.password),
//         confirmpassword: req.body.confirmpassword,
//     }

//     var checkpass = function() {
//         if (userdata.password == userdata.confirmpassword) {
//             return true;
//         }
//         return false;
//     }

//     userdata.checkpassword = checkpass;

//     if (userdata.fname == "" ||
//         userdata.lname == "" ||
//         userdata.email == "" ||
//         userdata.phonenumber == "" ||
//         userdata.Address == "" ||
//         userdata.city == "" ||
//         userdata.postalcode == "" ||
//         userdata.country == "" ||
//         userdata.password == "" ||
//         userdata.confirmpassword == "") {

//         res.render("registration", { data: userdata, layout: false });
//         return;
//     }

//     if (!userdata.phonetest) {
//         res.render("registration", { data: userdata, layout: false });
//         return;
//     }
//     if (!userdata.postaltest) {
//         res.render("registration", { data: userdata, layout: false });
//         return;
//     }
//     if (!userdata.passwordtest) {
//         res.render("registration", { data: userdata, layout: false });
//         return;
//     }
//     if (!userdata.checkpassword) {
//         res.render("registration", { data: userdata, layout: false });
//         return;
//     }

    
//     res.render("dashboard", { layout: false });
// });

// start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);