//Entry Point for the web app
let express = require("express");
let a = 21;

let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
let path = require('path');
//Allowing JS and CSS to run somoothly and setting up a public directory for the css
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine','ejs');
//Connecting to database
mongoose.createConnection("mongodb://localhost/ScoreKeeper");

//BodyParser set up
app.use(bodyParser.urlencoded({ extended: true }));

//MethodOverride set up
app.use(methodOverride("_method"));

app.get('/', function(req,res){
	//res.sendFile("./index.html");
          res.render('index',{});
});

//I haven't migrated to ejs yet.

app.listen(8000, function(){
	console.log("Server is running on 8000");
});
