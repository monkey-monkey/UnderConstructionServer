var express = require("express");
var fs = require("fs-extra");
var path = require("path");

var app = express();
app.listen(8080);
app.use(express.static(path.join(__dirname, "./assets")));

var caPath = path.join(__dirname, "../../MonkeyWebConfig/ca_bundle.crt");
var keyPath = path.join(__dirname, "../../MonkeyWebConfig/private.key");
var certPath = path.join(__dirname, "../../MonkeyWebConfig/certificate.crt");

if (fs.existsSync(caPath) && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    var credentials = {
        ca: fs.readFileSync(caPath),
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath)
    };
    require("https").createServer(credentials, app).listen(443);
    // Automatically redirect to https
    require("http").createServer(express().use(function (req, res) {
        res.redirect("https://" + req.hostname + req.url);
    })).listen(80);
}