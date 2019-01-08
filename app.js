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
const customValidator = require("./helpers/custom-validatior");

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

//Redirect to login page or a personal main page if logged in
app.get("/", authenticate, (req, res) => {
    if (req.session.userId) return res.redirect("user");  
    res.redirect("/login");
});

//Render login page
app.get("/login", (req, res) => {
    const {errors, toggleForm, savedInfo} = req.session;
    req.session.errors = null;
    req.session.toggleForm = undefined;
    req.session.savedInfo = null;
    res.render("login",{errors, toggleForm, savedInfo});
});

//submit login form and redirect to /user if correct credentials provided
app.post("/login", async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body);
        const token = await user.generateToken();
        req.session.token = token;
        res.redirect("/user");
    } catch(error) {
        req.session.errors = error;
        req.session.savedInfo = req.body;
        res.redirect("/login");
    }
});

//Log out and redirect back to home page
app.delete("/login", (req, res) => {
    req.session.destroy(err => {
        res.redirect("/login");
    });
});

//personal main page 
app.get("/user", authenticate, async(req, res) => {
    try {
        const {showSettings, errors} = req.session;
        req.session.showSettings = undefined;
        req.session.errors = undefined;
        const user = await User.findById(req.session.userId).exec();
        res.render("index",{user, showSettings, errors});
    } catch(err) {
        req.session.destroy(err => res.redirect("/"));
    }
});

// POST /users creates a user and save the user's document to the database.
app.post("/user", async(req, res) => {
    try {
        await customValidator.checkSignUpInfo(req.body);
        const user = await User.create(req.body);
        const token = await user.generateToken();
        req.session.token = token;
        res.redirect("/user");
    } catch(error) {
        req.session.errors = error;
        req.session.toggleForm = true;
        req.session.savedInfo = req.body;
        res.redirect("/login");
    }
});

// PATCH /users changes a user's document
app.patch("/user", authenticate, async(req, res) => {
    try {
        const user = await User.findById(req.session.userId).exec();
        await user.updateSettings(req.body);
        res.redirect("/user");
    } catch(err) {
        req.session.showSettings = true;
        req.session.errors = err.errors;
        res.redirect("/user");
    }
});


app.listen(port, () => {
    console.log(`server started on ${port}`);
});

module.exports = {app};
