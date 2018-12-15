const {User} = require("./../../server/models/user");

let seedUsers = [];

seedUsers.push({
    "email": "user0@example.com",
    "password": "user0Password"
});

seedUsers.push({
    //Missing a email
    "password": "user1Password"
});

seedUsers.push({
    //Register with a taken email
    "email": "user0@example.com",
    "password": "user1Password"
});

module.exports = {seedUsers};