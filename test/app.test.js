const {expect} = require("chai");
const request = require("supertest");

const {app} = require("./../app");
const {User} = require("./../server/models/user");
const {seedUsers} = require("./seed/users");

describe("/app.js", () => {
    it("should return status 200", (done) => {
        request(app)
        .get("/")
        .expect(200, done);
    });
});


describe("POST /users", () => {
    before(() => User.deleteMany({}));
    after(() => User.deleteMany({}));

    it("should return a 200 and the user", (done) => {
    
        request(app)
        .post("/users")
        .send(seedUsers.postUsers[0])
        .expect(res => {
            var {email, password, salt} = res.body;
            var sdEmail = seedUsers.postUsers[0].email;
            var sdPassword = seedUsers.postUsers[0].password;

            expect(email).to.equal(sdEmail);
            expect(password).to.not.equal(sdPassword);
            expect(salt).to.exist;
        })
        .expect(200, done);
    });

    it("should return a 400 if missing an email", (done) => {
        request(app)
        .post("/users")
        .send(seedUsers.postUsers[1])
        .expect(400, done);
    })
    
    it("should return a 400 if an email is taken", (done) => {
        request(app)
        .post("/users")
        .send(seedUsers.postUsers[2])
        .expect(400, done);    
    });
});

describe("POST users/login", () => {
    // wipes the database and creates a valid user
    before(() => {
        User.deleteMany({});
        User.create(seedUsers.postUsersLogin[0]);
    });
    
    after(() => User.deleteMany({}));

    // Login with a valid email
    it("should return 200 and the user for logging in successfully", (done) => {
        request(app)
        .post("/users/login")
        .send(seedUsers.postUsersLogin[0])
        .expect(res => {
            let {email, password} = res.body;
            let sdEmail = seedUsers.postUsersLogin[0].email;
            let sdPassword = seedUsers.postUsersLogin[0].password;

            expect(email).to.equal(sdEmail);
            expect(password).to.not.equal(sdPassword);
        })
        .expect(200, done);
    });

     //login with an unregistered email
    it("should return 400 if user not found", (done) => {       
        request(app)
        .post("/users/login")
        .send(seedUsers.postUsersLogin[1])
        .expect(res => {
            expect(res.body.message).to.equal("Invalid credentials")
        })
        .expect(400,done);
    });
});