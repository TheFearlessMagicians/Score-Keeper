//Entry Point for the web app
let express = require("express");
io = require('socket.io')();
app = express();
bodyParser = require("body-parser");
mongoose = require("mongoose");
methodOverride = require("method-override");
path = require('path');
serverPort = 8000;


//Allowing JS and CSS to run somoothly and setting up a public directory for the css
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.set('state', 'init'); //two states: init, and scoring. init is where you select how many players,
//and scoring is when you are scoring the players.
//Connecting to database
//Connecting to database
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/ScoreKeeper", { useMongoClient: true });

let PlayerSchema = new mongoose.Schema({
    parentGameId: mongoose.Schema.Types.ObjectId,
    idInGame: Number,
    points: Number,
});

let Player = mongoose.model('Player', PlayerSchema);

let GameSchema = new mongoose.Schema({
    players: [{
        ref: "Player",
        type: mongoose.Schema.Types.ObjectId,
    }],
    created: {
        type: Date,
        default: Date.now,
    },
}, { usePushEach: true });

let Game = mongoose.model('Game', GameSchema);
let currentGameID; // A way to keep track of current gameID ? Got a better idea implement it

//BodyParser set up
app.use(bodyParser.urlencoded({ extended: true }));

//MethodOverride set up
app.use(methodOverride("_method"));

//Routes
app.get('/load', function(req, res) {
    Game.find({}).limit(9).populate({
        path: 'players',
        options: {
            sort: {
                'points': -1,
            }
        }
    }).exec(function(error, games) {
        if (error) {
            console.log(error);
        } else {
            res.render("load", { games: games });
        }
    });
});

app.get('/', function(req, res) {

    if (app.get('state') == 'scoring') {
        Game.findOne({}, {}, { sort: { 'created_at': -1 } }).populate("players").sort({ '_id': -1 }).exec(function(error, foundGame) {
            if (error) {
                console.log(error);
            } else {
                res.render('index', { gameState: 'scoring', playersData: foundGame });
                console.log(foundGame);
            }
        });
    } else { //Where every player is a json object like: {id: (player Id), score: (player's score)}
        res.render('index', { gameState: 'init', playersData: [] });
    }
    // -1 for oldest, 1 for the newest


    // res.render('index', {});
});

app.delete("/", function (req,res){
    Game.remove({_id: req.body.id}, function (error, deletedGame){
        if (error){
            console.log(error);
        } else {
            console.log(deletedGame);
        }
    });
    res.redirect("/load");
});

app.post('/', function(req, res) {
    //populate the DB
    let players = Number(req.body.players);
    Game.create({
        players: [],
    }, function(error, newGame) {
        if (error) {
            console.log(error);
        } else {
            console.log("GAME NUMBER: ", newGame.gameNumber)
            currentGameID = newGame._id;
            for (let i = 1; i <= players; i++) {
                Player.create({
                    parentGameId: currentGameID,
                    idInGame: i,
                    points: 0
                }, function(error, newPlayer) {
                    if (error) {
                        console.log(error);
                    } else {
                        newGame.update({
                            //Thanks @ https://stackoverflow.com/a/48333797/8176981
                            $push: {
                                players: newPlayer._id
                            }
                        }, function(error, newGame) {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                });
            }
        }

    });
});

let server = app.listen(serverPort, function() {
    console.log("Server is running on " + serverPort);
});

io.attach(server);
let sockets = []
io.on('connection', function(socket) {
    console.log('a client connected.')
    sockets.push(socket);
    console.log(`${sockets.length} players`)


    // Events:
    socket.on('startScoring', function(data) {
        app.set('state', 'scoring');
    });

    socket.on('scoreUpdate', function(data) {
        socket.broadcast.emit('scoreUpdate', data)
        let userId = Number(data.userId);
        let scoreUpdate = Number(data.scoreUpdate);
        console.log(currentGameID);
        Player.update({
                parentGameId: currentGameID,
                idInGame: userId,
            }, {
                $inc: {
                    points: scoreUpdate,
                },
            },
            function(error, updatedPlayer) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(updatedPlayer);
                }
            });
    });
});