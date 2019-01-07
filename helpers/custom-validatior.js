const validator = require("validator");
const _ = require("lodash");
const {User} = require("../server/models/user");

const checkSignUpInfo = (user) => {
    
    return new Promise((resolve, reject) => {
        const {firstName, lastName, email, password, retypedPassword} = user;
        let errors = {};
        
        if(firstName.trim() == "") errors.firstName = "This field cannot be empty";
        if(lastName.trim() == "") errors.lastName = "This field cannot be empty";
        if(!validator.isEmail(email.trim())) errors.email = "This is not a valid email address";
        if(User.find({email}, (err, user) => {
            if(user) errors.email = "This email address is already taken";
        }))
        if(password.length < 6) errors.password = "Password needs to be at least 6 characters long";
        if(password !== retypedPassword) errors.retypedPassword = "Passwords do not match";

    
        _.isEmpty(errors)? resolve() : reject(errors);
    });
}

module.exports = {checkSignUpInfo};