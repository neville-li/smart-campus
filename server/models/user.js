const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: email => validator.isEmail(email),
            message: props => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
    },
    preferredTemperature: {
        type: Number,
        validate: {
            validator: temp => (temp >= 65 && temp <= 85),
            message: props => `Temperature must be within 65\u00B0F 85\u00B0F`
        }
    },
    location: {
        type: String
    }
});

userSchema.statics.create = (user) => {
    const {firstName, lastName, email, password, retypePassword} = user;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if(password !== retypePassword){
        return Promise.reject({message: "Does not match with password"});
    } 
    
    return new User({
        firstName,
        lastName,
        email,
        password: hash
    }).save();
};

userSchema.statics.findByCredentials = function (credentials){
    let {email, password} = credentials;
    return this.findOne({email}).then(user => {
        if(!user) return Promise.reject({message: "Incorrect email or password"});

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) reject(err);
                res? resolve(user):reject({message: "Incorrect email or password"});
            });
        });
    });
};

userSchema.statics.findByToken = function (token) {
    return this.findOne({tokens: token}).then(user => {
        if(!user) return Promise.reject({message: "Access Denied"});
        return Promise.resolve(user);
    });
};

userSchema.methods.updateSettings = function (newSettings) {
    let user = this;
    let keys = Object.keys(newSettings);

    for(key of keys){
        user[key] = newSettings[key];
    }
   return user.save().then(user => {
       return Promise.resolve(user);
   }).catch(err => {
       return Promise.reject(err);
   });
}

userSchema.methods.generateToken = function () {
    let id = this._id;
    return new Promise ((resolve, reject) => {
        jwt.sign({id}, "jwtSecret", (err ,token) => {
            err? reject(err) : resolve(token);
         });
    });
}

let User = mongoose.model("User", userSchema);

module.exports = {User};