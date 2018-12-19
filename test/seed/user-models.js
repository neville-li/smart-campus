const {User} = require("./../../server/models/user");

seedUsers = {}

seedUsers["token"] = [];

User.create({
    email: "user@email.com", 
    password: "password"
}).then(user => {
    seedUsers["token"].push(user);
}).catch();


module.exports = {
    seedUsers
}