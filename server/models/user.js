const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    salt: {
        type: String,
        require:true
    },
    preferredTemperature : {
        type: Number
    }
});

userSchema.statics.create = (user) => {
    let {email, password, preferredTemperature} = user;
    
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
   
    return new User({
        email,
        password: hash,
        salt,
        preferredTemperature,
    }).save();
};

userSchema.statics.findByCredentials = function (credentials){
    let {email, password} = credentials;
    return this.findOne({email}).then(user => {
        if(!user) return Promise.reject({message: "Invalid credentials"});

        return new Promise ((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) reject(err);
                res? resolve(user):reject({message: "Invalid credentials"});
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
    let id = this._id.toString();
    return new Promise ((resolve, reject) => {
        jwt.sign({id}, "jwtSecret", (err ,token) => {
            err? reject(err) : resolve(token);
         });
    });
}

let User = mongoose.model("User", userSchema);

module.exports = {User};