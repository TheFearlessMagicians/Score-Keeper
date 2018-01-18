//Entry Point for the web app
let express = require("express");
let io = require('socket.io')();
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
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/ScoreKeeper", { useMongoClient: true });

let PlayerSchema = new mongoose.Schema({
    idInGame: Number,
    points: Number,
});

let Player = mongoose.model('Player', PlayerSchema);

let GameSchema = new mongoose.Schema({
    players: [PlayerSchema],
    created: {
        type: Date,
        default: Date.now,
    }
});

let Game = mongoose.model('Game', GameSchema);

//BodyParser set up
app.use(bodyParser.urlencoded({ extended: true }));

//MethodOverride set up
app.use(methodOverride("_method"));

app.get('/', function(req, res) {
    res.render('index', {});
});

app.post('/', function(req, res) {
    //No other way I am capable of except callback hell
    //Async hell 
    //Why do even exist? FML
    let players = Number(req.body.players);
    Game.create({
        players: [],
    }, function(error, newGame) {
        if (error) {
            console.log(error);
        } else {
            for (let i = 0; i < players; i++) {
                Player.create({
                    idInGame: i + 1,
                    points: 0
                }, function(error, newPlayer) {
                    if (error) {
                        console.log(error);
                    } else {
                        newGame.players.push(newPlayer);
                        newGame.save(function(error, newGame) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("New Player added");
                            }
                        });
                    }
                });
            }
        }

    });
});

let server = app.listen(8000, function() {
    console.log("Server is running on 8000");
});

io.attach(server);
io.on('connection', function(socket) {
    socket.on('connect', function(data) {});

    socket.on('scoreUpdate', function(data) {
        console.log(data); //NOTHING PRINTS :
        let userId = Number(data.userId);
        let scoreUpdate = Number(data.scoreUpdate);
        //TODO: VARUN : scoreUpdate event here. Update the database.
        console.log(userId, scoreUpdate); // NOTHING PRINTS :(
        Player.findOne({
            idInGame: userId,
        }, function(error, foundPlayer) {
            foundPlayer.points += scoreUpdate;
            foundPlayer.save(function(error, savedPlayer) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(savedPlayer);
                }
            });
        });

        console.log(`${userId} scored: ${scoreUpdate}`);
    });
});