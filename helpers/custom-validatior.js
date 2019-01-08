const validator = require("validator");
const _ = require("lodash");
const {User} = require("../server/models/user");

const checkSignUpInfo = (user) => {
    
    return new Promise(async(resolve, reject) => {
        const {firstName, lastName, email, password, retypedPassword} = user;
        let errors = {};

        try{
            const user = await User.findOne({email}).exec();
            if(user) errors.email = "This email address is already taken";
        } catch(err) {}
        
        if(firstName.trim() == "") errors.firstName = "Required";
        if(lastName.trim() == "") errors.lastName = "Required";
        if(!validator.isEmail(email.trim())) errors.email = "This is not a valid email address";
        if(password.length < 6) errors.password = "Password needs to be at least 6 characters long";
        if(password !== retypedPassword) errors.retypedPassword = "Passwords do not match";

    
        _.isEmpty(errors)? resolve() : reject(errors);
    });
}

module.exports = {checkSignUpInfo};