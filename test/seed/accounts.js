const {User} = require("../../server/models/user");

let seedAccounts = {};

// Seeds for POST /users

seedAccounts["postUsers"] = [];

seedAccounts.postUsers.push({
    "email": "user0@example.com",
    "password": "user0Password"
});

seedAccounts.postUsers.push({
    //Missing a email
    "password": "user1Password"
});

seedAccounts.postUsers.push({
    //Register with a taken email
    "email": "user0@example.com",
    "password": "user1Password"
});



//Seeds for POST /users/login

seedAccounts["postUsersLogin"] = [];

seedAccounts.postUsersLogin.push({
    // this document is added before the test begins
    "email": "user0@example.com",
    "password": "user0Password"  
});

seedAccounts.postUsersLogin.push({

    "email": "notFound@example.com",
    "password": "user0Password"  
});

module.exports = {seedAccounts};