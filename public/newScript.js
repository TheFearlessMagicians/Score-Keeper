/* variables */
let inputPlayers = document.getElementById("numOfPlayers");
let playerList = [];
let selectHTML = document.getElementById("sel1");
let alert = document.getElementsByClassName("alert")[0];
let maxScore = 0; // For progress bar visualisation.
let ranking = [];
/*1. -----------------Player class useful to store player data locally (client side) -------------*/
// player class is defined here because of JS hoisting. (classes can get reference error when they aren't defined yet but already
//used. )
class player {
    constructor(id, points, turns) {
        this.score = points;
        this.turns = turns;
        this.id = id;
    }
    updateScore(points) {
        this.score += points;
        this.turns++;
    }
    //Wilson: added this for convenience.
    getId() {
        return this.id;
    }
    score() {
        return this.score;
    }
    turns() {
        return this.turns;
    }
    textString() {
        return ("Player " + (this.id) + " : " + (this.score));
    }
}

/* 2. ---------If game has started, then get data about that game from db(see app.js)-----*/
/* SEE index.ejs"
/* 3. ------------------Function for initialising a new game  (client side)-----------------*/

function init(nPlayers, jsonObject = null) {
    maxScore = 0;
    playerList = [];
    if (jsonObject === null) {
        for (let x = 1; x <= nPlayers; x++) {
            let p = new player(x, 0, 0);
            console.log('added player object');
            playerList.push(p);
        }
    } else {

        console.log(`json object: ${jsonObject}`);
        jsonObject.players.forEach(function(pl) {
            let p = new player(Number(pl.idInGame), Number(pl.points), 0);
            console.log(`${pl.idInGame}, ${pl.points}`);
            playerList.push(p);
        });

    }

    playerList.sort(function(a, b) {
        return Number(a.id) - Number(b.id);
    });

    playerList.forEach(function(p) {
        // append li to ul.
        $("div#list > ul").append(`<li id=${p.id} class="playersStyle"><b>${p.textString()}</b></li>`);
        //Append progress bar right under it.

        $("div#list > ul").append(
            `<div class="progress">
                                        <div class="progress-bar bg-primary" id="playerBar_${p.id}" role="progressbar" style="width: 0%" aria-valuenow="100"
                                        aria-valuemin="0" aria-valuemax="100">
                                        </div>
                                     </div>`);
        if (maxScore < p.score) {
            maxScore = p.score;
        }
        if (jsonObject === null)
            maxScoreChanged(0);;
        // Put this player as an option to the selector.
        $('select#sel1').append(`<option>${p.id}</option>`);
    });
    //TODO put vvvv on a callback after initialiszing all the players.
    maxScoreChanged(maxScore);
    initScore();
}


function maxScoreChanged(maxScore) {
    console.log(`score changed to ${maxScore}`);
    if (maxScore == 0) {
        playerList.forEach(function(player) {
            $(`div#playerBar_${player.id}`).css("width", `0%`);
        });
    } else {
        playerList.forEach(function(player) {
            $(`div#playerBar_${player.id}`).css("width", `${100 * ( player.score/maxScore)}%`);
        });
    }

}

/*4. ------------------When a player gets scored / has scored----------*/
function scored(playerId, pointsScored) {
    playerList[playerId - 1].updateScore(pointsScored);
    //TODO: pgbar is only changing when Maxscore is changed.
    $(`div#playerBar_${playerId}`).css("width", `${100 * ( playerList[playerId-1].score/maxScore)}%`);
    /* -----Update the player's score in html */
    $(`li#${playerId} > b`).html(playerList[playerId - 1].textString());
    /* **********Animation ***************/

    if (pointsScored > 0) {
        animate(playerId, "playerScoreAnimation");
    } else {
        animate(playerId, "playerDeductScoreAnimation");
    }

    let tempMax = 0;
    playerList.forEach(function(p) {
        if (p.score > tempMax)
            tempMax = p.score;
    });
    maxScoreChanged(tempMax);
    updateRank();


}


/* 4.i --------------Animation for scored function --------------*/
function animate(playerID, classAnimation) {
    $("ul li.playersStyle").eq(playerID - 1).addClass(classAnimation);
    window.setTimeout(function() {
        $("ul li.playersStyle").eq(playerID - 1).removeClass(classAnimation);
    }, 400);
}


/*5. ------------------When the user adds/subtracts score for a player --------*/
$('button#button-success').on("click", function() {
    let idOfPlayer = Number(selectHTML.value);
    let points = Number(document.querySelector('input#points').value);
    /* --------Socket Code - DO NOT ERASE------*/
    socket.emit('scoreUpdate', { 'userId': idOfPlayer, 'scoreUpdate': points });
    scored(idOfPlayer, points);
});



function initScore(){
          for(let x = 0; x < 5; x++){
                    $("tbody").append(`<tr id=rank_${x} ></tr>`);
          }
            updateRank();
}
var sort_by = function(field, reverse, primer){

   var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     }
}

function sortScore(){
          //console.log('sort score called.')
  let nPlayers = playerList.length;//Number(inputPlayers.value);//NOTE TO HANIF: This shouldn't be inputPlayers.value. cos other browsers wont have that value.
  for(let x = 1; x <= nPlayers; x++){
    ranking[x-1] = {"id": x, "score": playerList[x-1].score};
  }
  ranking.sort(sort_by('score', true, parseInt));
}

function updateRank(){
          //console.log('updateRank called');
    sortScore();
    for(let x = 0; x < 5; x++){
              //console.log(x);
            //  console.log(`<td>${ranking[x].id}</td><td>${ranking[x].score}</td>`);
              $(`tbody tr#rank_${x}`).html(`<td>${x+1}</td><td>${ranking[x].id}</td><td>${ranking[x].score}</td>`);
       //$("tbody").append(`<tr id=${x} ><td>${ranking[x].id}</td><td>${ranking[x].score}</td></tr>`);
    }
}
