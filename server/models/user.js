const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
var uniqueValidator = require('mongoose-unique-validator');

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: [true, "Required"]
    },
    lastName: {
        type: String,
        trim: true,
        required: [true, "Required"]
    },
    email: {
        type: String,
        trim: true,
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
            validator: temp => ((temp >= 65 && temp <= 85) || temp == undefined),
            message: props => `Temperature must be within the range of 65\u00B0F - 85\u00B0F`
        }
    },
    location: {
        type: String
    }
});
userSchema.plugin(uniqueValidator, {message: "{PATH} is already taken"});

userSchema.statics.create = (user) => {
    const {firstName, lastName, email, password} = user;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    return new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hash
    }).save();
};

userSchema.statics.findByCredentials = function (credentials){
    const {email, password} = credentials;
    const err = {invalidCredentials: "Incorrect email or password"};

    return this.findOne({email}).then(user => {
        if(!user) return Promise.reject(err);

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) reject(err);
                res? resolve(user):reject(err);
            });
        });
    });
};

userSchema.statics.findByToken = function (token) {
    return this.findOne({tokens: token}).then(user => {
        if(!user) return Promise.reject({message: "Token validation Error"});
        return Promise.resolve(user);
    });
};

userSchema.methods.updateSettings = function (newSettings) {
    let user = this;
    const keys = Object.keys(newSettings);

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
    const id = this._id;
    return new Promise ((resolve, reject) => {
        jwt.sign({id}, "jwtSecret", (err ,token) => {
            err? reject(err) : resolve(token);
         });
    });
}

let User = mongoose.model("User", userSchema);

module.exports = {User};