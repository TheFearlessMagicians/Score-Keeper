/* variables */
let inputPlayers = document.getElementById("numOfPlayers");
let playerList = [];
let selectHTML = document.getElementById("sel1");
let alert = document.getElementsByClassName("alert")[0];

// player class is defined here because of JS hoisting. (classes can get reference error when they aren't defined yet but already
//used. )
class player {
    constructor(id,points,turns) {
        this.score = points;
        this.turns = turns;
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

/* 1. ---------If game has started, then get data about that game from db(see app.js)-----*/
if (gameState== 'scoring'){
          console.log('going to scoring module');
          // this is already defined in index.ejs -> var playersData =<%- JSON.stringify(playersData) %>;
          init(playersData.length,playersData);
          alert.style.visibility = "hidden";
          alert.style.display = "none";
          document.getElementsByClassName("playersPlaying").innerHTML = "Players playing: " + playersData.length;
          $("form#initialForm").slideUp(40,()=>{
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
}else{
          /* 1a. --------------Go Btn to start a game. ------------------*/
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
                              init(Number(inputPlayers.value));
                              /*-------- Tell server that game has started */
                              socket.emit('startScoring',{});

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


}

/* 2. ------------------Function for initialising a new game  (client side)-----------------*/

function init(nPlayers,jsonObject=null) {
          playerList = [];
                if( jsonObject === null){
                          for (let x = 1; x <= nPlayers; x++) {
                                  let p = new player(x,0,0);
                                  console.log('added player object');
                                  playerList.push(p);
                          }
                }
                else{
                          jsonny = jsonObject;
                          console.log(`json object: ${jsonObject}`);
                          jsonObject.players.forEach((pl)=>{
                                   // let p = new player(0,0,0);
                                    let p = new player(Number(pl.idInGame),Number( pl.points), 0);
                                    console.log(`${pl.idInGame}, ${pl.points}`);
                                    //let p = new player(12,300,0); // TODO why is this not a constructor????
                                    playerList.push(p);
                          });
                }
                playerList.sort(function(a,b){
                          return Number(a.id) - Number(b.id);
                });

                playerList.forEach((p)=>{

                $("div#list > ul").append(`<li id=${p.id} class="playersStyle"><b>${p.textString()}</b></li>`);
                $('select#sel1').append(`<option>${p.id}</option>`);
                });
}



/*3. -----------------Player class useful to store player data locally (client side) -------------*/




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
