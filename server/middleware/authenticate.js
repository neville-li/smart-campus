const jwt = require("jsonwebtoken");
const {User} = require("./../models/user");

//This function validates user token and store the user id in the session data
const authenticate = function(req, res, next) {
    
    if(!req.session.token) return res.redirect("/login");

    jwt.verify(req.session.token, "jwtSecret", (err, decoded) => {
        if(err) return res.redirect("/login");
        req.session.userId = decoded.id;
        next();
    });
};

module.exports = {authenticate};