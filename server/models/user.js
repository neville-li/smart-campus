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

userSchema.statics.create = (body) => {
    let {email, password, preferredTemperature} = body;
    
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
   
    return new User({
        email,
        password: hash,
        salt,
        preferredTemperature,
    }).save();
};

userSchema.statics.findByCredentials = function (body){
    let {email, password} = body;
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

let User = mongoose.model("User", userSchema);

module.exports = {User};