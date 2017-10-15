var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var request = require("request");
var cheerio = require("cheerio");

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_whb218m9:d61iad37fpsla6tpuaosh1o5sv@ds127429.mlab.com:27429/heroku_whb218m9");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

require("./routes/api-routes.js")(app);

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port: "+port);
});