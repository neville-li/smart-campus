const request = require("request");
const rp = require("request-promise");

let options = {
    uri: 'https://api.openweathermap.org/data/2.5/weather?id=4699066&appid=<APPID>', // current weather api call for the city of Houston, replace <APPID> with a valid api key
    json: true, // Automatically parses the JSON string in the response
};
 
rp(options)
    .then(function (res) {
        console.log(res);
        console.log("Status Code: " + res.cod);
        console.log("Success");
    })
    .catch(function (err) {
        // API call failed...
        console.log(err);
        console.log("ERROR");
});