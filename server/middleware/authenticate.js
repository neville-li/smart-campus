const jwt = require("jsonwebtoken");
const {User} = require("./../models/user");

//This function validates user token and store the user id in the session data
let authenticate = function(req, res, next) {
    if(!req.session.token) next();

    jwt.verify(req.session.token, "jwtSecret", (err, decoded) => {
        if(err) next();  
        req.session.userId = decoded.id;
        next();
    });
};

module.exports = {authenticate};