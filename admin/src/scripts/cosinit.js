var cossdk = require("./cos-js-sdk-v4.js");
var cos = new cossdk.CosCloud({
    appid: '',
    bucket: '',
    region: ''
});
module.exports = cos
