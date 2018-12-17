const {User} = require("./../../server/models/user");

let seedUsers = {};

// Seeds for POST /users

seedUsers["postUsers"] = [];

seedUsers.postUsers.push({
    "email": "user0@example.com",
    "password": "user0Password"
});

seedUsers.postUsers.push({
    //Missing a email
    "password": "user1Password"
});

seedUsers.postUsers.push({
    //Register with a taken email
    "email": "user0@example.com",
    "password": "user1Password"
});



//Seeds for POST /users/login

seedUsers["postUsersLogin"] = [];

seedUsers.postUsersLogin.push({
    // this document is added before the test begins
    "email": "user0@example.com",
    "password": "user0Password"  
});

seedUsers.postUsersLogin.push({

    "email": "notFound@example.com",
    "password": "user0Password"  
});

module.exports = {seedUsers};