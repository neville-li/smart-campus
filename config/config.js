var env = process.env.NODE_ENV || "development";

if (env === "development" || env === "test") {
    var config = require("./config.json");
    process.env.PORT = config[env].PORT;
    process.env.MONGODB_URI = config[env].MONGODB_URI;
}

