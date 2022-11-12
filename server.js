// setup our requires
const express = require("express");
const app = express();
// const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");

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

    res.render("dashboard", { layout: false });

});

//Router function for 'registration' page
app.get("/registration", function(req,res){
    res.sendFile(path.join(__dirname, "/registration.html"));
});

app.post("registration", function(req,res){

    var userdata = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        city: req.body.city,
        phonetest: /^\d{10}$/.test(req.body.phonenumber),
        Address: req.body.Address1,
        postalcode: req.body.postalcode,
        postaltest: /^[AaBbCcEeGgHiJjKkLlMmNnPpRrSsTtVvXxYy]\d[A-Za-z] \d[A-Za-z]\d$/.test(req.body.postalcode),
        country: req.body.country,
        password: req.body.password,
        passwordtest: /^[0-9a-zA-Z]{6,12}$/.test(req.body.password),
        confirmpassword: req.body.confirmpassword,
    }

    checkpass = function() {
        if (userdata.password == userdata.confirmpassword) {
            return true;
        }
        return false;
    }

    userdata.checkpassword = checkpass;

    if (userdata.fname == "" ||
        userdata.lname == "" ||
        userdata.email == "" ||
        userdata.phonenumber == "" ||
        userdata.Address1 == "" ||
        userdata.city == "" ||
        userdata.postalcode == "" ||
        userdata.country == "" ||
        userdata.password == "" ||
        userdata.confirmpassword == "") {

        res.render("registration", { data: userdata, layout: false });
        return;
    }

    if (!userdata.phonetest) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }
    if (!userdata.postaltest) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }
    if (!userdata.passwordtest) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }
    if (!userdata.checkpassword) {
        res.render("registration", { data: userdata, layout: false });
        return;
    }

    res.render("dashboard", { layout: false });
});

// start the server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);