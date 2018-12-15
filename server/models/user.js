const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

userSchema.statics.create = (email, password, preferredTemperature) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
   
    return new User({
        email,
        password: hash,
        salt,
        preferredTemperature,
    }).save();
};

let User = mongoose.model("User", userSchema);

module.exports = {User};