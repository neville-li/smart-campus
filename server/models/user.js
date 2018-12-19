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
    },
    tokens: {
        type: Array
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
                err? reject({message: "Invalid credentials"}) :resolve(user);
            });
        });
    });
};

userSchema.statics.findByToken = function (token) {
    return this.findOne({tokens: token}).then(user => {
        if(!user) return Promise.reject({message: "Access Denied"});
        return Promise.resolve(user);
    })
};

userSchema.methods.generateToken = function () {
    let id = this._id.toString();
    let token = jwt.sign({_id: id}, this.salt);
   
    return new Promise ((resolve, reject) => {
        User.updateOne({_id: id}, {$push: {tokens: token}}, (err, user) => {
            err? reject() : resolve(token);
        });
    });
}

let User = mongoose.model("User", userSchema);

module.exports = {User};