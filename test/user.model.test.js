const {User} = require("./../server/models/user");
const {expect} = require("chai");
const {seedUsers} = require("./seed/user-models");


describe("User model methods", () => {
    it("should return a token in the form of a string", (done) => {
        let user = seedUsers["token"][0];
        console.log(user);
        let token = user.generateToken();
        console.log(token);
        expect(token).to.be.a("string");
        done();
    });
});