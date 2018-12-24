require("./config/config");
require("./server/db/db-connect");

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo")(session);

const {User} = require("./server/models/user");
const {authenticate} = require("./server/middleware/authenticate");

app.use(methodOverride("_method"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "sessionSecret",
    resave: true,
    saveUninitialized: false,
    path: "/",
    store: new MongoStore({
        url: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 15 * 60 * 1000 // 15min
    }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let port = process.env.PORT || 3000;

//Home Page or redirect user to personal main page if logged in
//Login Page is hidden in the authenticate middleware
app.get("/", authenticate,(req, res) => {
    res.redirect("user");  
});


//personal main page 
app.get("/user", authenticate, (req, res) => {
    let user = req.session.user;
    res.render("index",{user});
});

// POST /users creates a user and save the user's document to the database.
app.post("/user", (req,res) => {
    User.create(req.body).then(user => {
        res.redirect("/");
    }).catch(e => {
        res.status(400).send(e);
    });
});

// POST /users/login logs a user in and generates a token
app.post("/user/login", (req, res) => {
    User.findByCredentials(req.body).then(user => {
        user.generateToken().then(token => {
           req.session.token = token;
           res.redirect("/user");
        }).catch(e => res.status(400).send(e)); 
    }).catch(e => res.status(400).send(e));
});

// PATCH /users changes a user's document
app.patch("/user", authenticate, (req, res) => {
    req.session.user.updateSettings(req.body)
    .then(user => res.redirect("/user"))
    .catch(e => res.redirect("/user"));
});

app.delete("/user", (req, res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
});


app.listen(port, () => {
    console.log(`server started on ${port}`);
});

module.exports = {app};
