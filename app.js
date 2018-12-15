require("./config/config");
require("./server/db/db-connect");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const {User} = require("./server/models/user");

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/users", (req,res) => {
    let {email, password} = req.body;
    User.create(email, password).then(user => {
        res.send(user);
    }).catch(e => {
        res.status(400).send(e);
    });
});


app.listen(3000, () => {
    console.log("server started on 3000");
});

module.exports = {app};