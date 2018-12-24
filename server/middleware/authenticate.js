const jwt = require("jsonwebtoken");
const {User} = require("./../models/user");

let authenticate = function(req, res, next) {
    if(!req.session.token) return res.render("login");

    jwt.verify(req.session.token, "jwtSecret", (err, decoded) => {
        if(err) return res.render("login");

        User.findById(decoded.id, (err, user) => {
            req.session.user = user;
            next();
        });
    });
};

module.exports = {authenticate};