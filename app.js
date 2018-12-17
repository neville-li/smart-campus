require("./config/config");
require("./server/db/db-connect");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const {User} = require("./server/models/user");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

let port = process.env.PORT || 3000;

//Home Page
app.get("/", (req, res) => {
    res.render("index");
});


// POST /users creates a user and save the user's document to the database.
app.post("/users", (req,res) => {
    User.create(req.body).then(user => {
        res.send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

// POST /users/login logs a user in and generates a token
app.post("/users/login", (req, res) => {
    User.findByCredentials(req.body).then(user => {
        res.send(user);
    }).catch(e => res.status(400).send(e));
});

// PATCH /users changes a user's document
app.patch("/users", (req, res) => {
    res.send();
});



app.listen(port, () => {
    console.log(`server started on ${port}`);
});

module.exports = {app};
