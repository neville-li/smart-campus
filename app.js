require("./config/config");
require("./server/db/db-connect");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const {User} = require("./server/models/user");
const {authenticate} = require("./server/middleware/authenticate");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    path: "/",
    cookie: {
        maxAge: 15 * 60 * 1000 // 15min
    }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let port = process.env.PORT || 3000;

//Home Page
app.get("/", (req, res) => {
    console.log(req.sessionID);
    res.render("login");  
});

app.get("/user", authenticate, (req, res) => {
    let user = req.session.user;
    res.render("index",{user, path: __dirname});
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
        }); 
    }).catch(e => res.status(400).send(e));
});

// PATCH /users changes a user's document
app.patch("/user", authenticate, (req, res) => {
    // User.update{{}}
});



app.listen(port, () => {
    console.log(`server started on ${port}`);
});

module.exports = {app};
