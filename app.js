//Entry Point for the web app
let express = require("express");
let io = require('socket.io')();
let a = 21;

let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
let path = require('path');
//Allowing JS and CSS to run somoothly and setting up a public directory for the css
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');
//Connecting to database
mongoose.createConnection("mongodb://localhost/ScoreKeeper");

let PlayerSchema = new mongoose.Schema({
    idInGame: Number,
    points: Number,
});

let GameSchema = new mongoose.Schema({
    players: [PlayerSchema],
    created: {
        type: Date,
        default: Date.now,
    }
});

//BodyParser set up
app.use(bodyParser.urlencoded({ extended: true }));

//MethodOverride set up
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
    res.render('index', {});
});

app.post('/', function(req, res) {
	let players = req.body.players;
	console.log(players);
});





let server = app.listen(8000, function() {
    console.log("Server is running on 8000");
});

io.attach(server);
io.on('connection', function(socket) {
    socket.on('connect', function(data) {});

    socket.on('scoreUpdate', function(data) {
        let userId = data.userId;
        let scoreUpdate = data.scoreUpdate;
        //TODO: VARUN : scoreUpdate event here. Update the database.
        console.log(`${userId} scored: ${scoreUpdate}`);
    });
});