/* variables */
let inputPlayers = document.getElementById("numOfPlayers");
let playerList = [];
let selectHTML = document.getElementById("sel1");
let alert = document.getElementsByClassName("alert")[0];


/* 1. --------------Go Btn to start a game. ------------------*/
document.getElementById('goBtn').addEventListener("click", function() {
          playerList = []
          if (Number(inputPlayers.value) <= 1) {
                    // Alert the user that he/she has entered invalid value..
                    alert.style.visibility = "visible";
                    alert.style.display = "block";
          } else if (Number(inputPlayers.value) >= 2 /*&& alert.style.visibility == "visible"*/) {
                    //NOTE: @ VARUN why must there be a && alert.style.visibility up here ^^ ???
                    //What's the purpose? I commented it out cos i thought it was unnecessary.??
                    alert.style.visibility = "hidden";
                    alert.style.display = "none";
                    document.getElementsByClassName("playersPlaying").innerHTML = "Players playing: " + inputPlayers.value;
                    init();
                    /*--------Animation for the login thing to slide up, and functions for  scoring -----*/
                    $("form#initialForm").slideUp(400,()=>{
                              $("ul li").append("<button  id=\"incrementScore\" class=\"incrementButtons\">+1</button>")
                                          .prepend("<button id=\"decrementScore\" class=\"incrementButtons\">-1</button>");
                              $("li button#incrementScore").click(function(){
                                        let id = $(this).parent().attr("id")
                                         socket.emit('scoreUpdate',{'userId':id,'scoreUpdate':1});
                                        scored(id,1);
                              });
                              $("li button#decrementScore").click(function(){
                                        let id = $(this).parent().attr("id")
                                         socket.emit('scoreUpdate',{'userId':id,'scoreUpdate':-1});
                                        scored(id,-1);
                              });
                    });
          }
});



/* 2. ------------------Function for initialising a new game  (client side)-----------------*/
function init() {
    let nPlayers = Number(inputPlayers.value);
    for (let x = 1; x <= nPlayers; x++) {
                  let p = new player(x);
                  playerList.push(p);
                  $("div#list > ul").append(`<li id=${x} class="playersStyle"><b>${p.textString()}</b></li>`);
                  $('select#sel1').append(`<option>${x}</option>`);
    }
}



/*3. -----------------Player class useful to store player data locally (client side) -------------*/
class player {
    constructor(id) {
        this.score = 0;
        this.turns = 0;
        this.id = id;
    }
    updateScore(points) {
        this.score += points;
        this.turns++;
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



/*4. ------------------When a player gets scored / has scored----------*/
function scored(playerId,pointsScored){
          playerList[playerId - 1].updateScore(pointsScored);
          /* -----Update the player's score in html */
          $(`li#${playerId} > b`).html(playerList[playerId - 1].textString());
          /* **********Animation ***************/
          if (pointsScored > 0){
                    animate(playerId,"playerScoreAnimation");}
          else{
                    animate(playerId,"playerDeductScoreAnimation");}
}


/* 4.i --------------Animation for scored function --------------*/
function animate(playerID,classAnimation){
          $("ul li.playersStyle").eq(playerID- 1).addClass(classAnimation);
          window.setTimeout(function(){
                    $("ul li.playersStyle").eq(playerID - 1).removeClass(classAnimation);
          },400);
}


/*5. ------------------When the user adds/subtracts score for a player --------*/
$('button#button-success').on("click", function() {
    let idOfPlayer = Number(selectHTML.value);
    let points = Number(document.querySelector('input#points').value);
    /* --------Socket Code - DO NOT ERASE------*/
    socket.emit('scoreUpdate',{'userId':idOfPlayer,'scoreUpdate':points});
    scored(idOfPlayer,points);
});
