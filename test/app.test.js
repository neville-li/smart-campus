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

    it("should return a 200 and the user", (done) => {
    
        request(app)
        .post("/users")
        .send(seedUsers[0])
        .expect(res => {
            var {email, password, salt} = res.body;
            expect(email).to.equal(seedUsers[0].email);
            expect(password).to.not.equal(seedUsers[0].password);
            expect(salt).to.exist;
        })
        .expect(200, done);
    });

    it("should return a 400 if missing an email", (done) => {
        request(app)
        .post("/users")
        .send(seedUsers[1])
        .expect(400, done);
    })
    
    it("should return a 400 if an email is taken", (done) => {
        request(app)
        .post("/users")
        .send(seedUsers[2])
        .expect(400, done);    
    });
});