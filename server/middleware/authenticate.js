const jwt = require("jsonwebtoken");
const {User} = require("./../models/user");

//This function validates user token and returns a user object

let authenticate = function(req, res, next) {
    if(!req.session.token) return res.render("login");

    jwt.verify(req.session.token, "jwtSecret", (err, decoded) => {
        if(err) return res.render("login");

        User.findById(decoded.id, (err, user) => {
            if(err) return res.render("login");


            // filter password and salt properties when passing user information to session data
            req.session.user = {};           
            for(let key in user){
                if(key !== "password" && key !== "salt") {
                    req.session.user[key] = user[key];
                }
            }
            next();
        });
    });
};


// let authenticate = function(req, res, next) {
//     if(!req.session.token) return next();

//     jwt.verify(req.session.token, "jwtSecret", (err, decoded) => {
//         if(err) return next();

//         User.findById(decoded.id, (err, user) => {
//             if(err) return next();

//             // filter password and salt properties when passing user information to session data
//             req.session.user = {};           
//             for(let key in user){
//                 if(key !== "password" || key !== "salt") {
//                     req.session.user[key] = user[key];
//                 }
//             }
//             req.session.user["isAuthenticated"] = true;
//             next();
//         });
//     });
// };

module.exports = {authenticate};