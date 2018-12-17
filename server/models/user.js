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
                if(res) resolve(user);
                reject({message: "Invalid credentials"});
            });
        });
    });
};

userSchema.methods.generateToken = function () {
    let token = jwt.sign({_id: this._id.toString()}, this.salt);
    this.push(token);
    return token;
}

let User = mongoose.model("User", userSchema);

module.exports = {User};