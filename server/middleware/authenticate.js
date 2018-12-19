const {User} = require("./../models/user");

let authenticate = function(req, res, next) {
    User.findByToken(req.session.token).then(user => {
        req.session.user = user;
        next();
    }).catch(e => {
        req.session = null;
        res.redirect("/");
    });
}

module.exports = {authenticate}