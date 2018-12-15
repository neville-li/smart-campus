require("./config/config");
require("./server/db/db-connect");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const {User} = require("./server/models/user");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));


//Home Page
app.get("/", (req, res) => {
    res.send("Hello World");
});


// POST /users for signing up
app.post("/users", (req,res) => {

    User.create(req.body).then(user => {
        res.send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});

// POST /users/login for logging in
app.post("/users/login", (req, res) => {
    User.findByCredentials(req.body).then(user => {
        res.send(user);
    }).catch(e => res.status(400).send(e));
});




app.listen(3000, () => {
    console.log("server started on 3000");
});

module.exports = {app};