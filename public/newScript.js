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
                    return;
          } else if (Number(inputPlayers.value) >= 2 && alert.style.visibility == "visible") {
                    alert.style.visibility = "hidden";
                    alert.style.display = "none";}
          document.getElementsByClassName("playersPlaying").innerHTML = "Players playing: " + inputPlayers.value;
          init();
          /*--------Animation for the login thing to slide up and begin scoring -----*/
          $("form#initialForm").slideUp(400,()=>{
                    $("ul li").append("<button  id=\"incrementScore\" class=\"incrementButtons\">+1</button>");
                    $("ul li").prepend("<button id=\"decrementScore\" class=\"incrementButtons\">-1</button>");
                    $("li button#incrementScore").click(function(){
                              scored( $(this).parent().attr("id"),1);
                    });
                    $("li button#decrementScore").click(function(){
                              scored($(this).parent().attr("id"),-1);
                    });
          });
});



/* 2. ------------------Function for initialising a new game  (client side)-----------------*/
function init() {
    let nPlayers = Number(inputPlayers.value);
    for (let x = 1; x <= nPlayers; x++) {
                  let p = new player(x);
                  playerList.push(p);
                  /* ------REPLACEMENT FOR above -----*/
                  let jqueryString = `<li id=${x} class="playersStyle"><b>${p.textString()}</b></li>`
                  $("div#list > ul").append($(jqueryString));

                  let option = document.createElement("option");
                  let textOption = document.createTextNode(x);
                  option.appendChild(textOption);
                  $('div#sel1').append($(option));
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
          let idOfPlayer = playerId;
          let points = pointsScored;
          playerList[idOfPlayer - 1].updateScore(points);
          let playerScore = playerList[idOfPlayer - 1].textString();
          /* ------------------Socket Code - DO NOT ERASE-----------*/
          socket.emit('scoreUpdate',{'userId':playerId,'scoreUpdate':points});
          /* -----Update the player's score in html */
          $(`li#${idOfPlayer} > b`).html(playerScore);

          /* **********Animation ***************/
          let animationClass = "";
          if (points > 0){
                    animate(idOfPlayer,"playerScoreAnimation");}
          else{
                    animate(idOfPlayer,"playerDeductScoreAnimation");}
}


/* 4.i --------------Animation for scored function --------------*/
function animate(playerID,classAnimation){
          $("ul li.playersStyle").eq(playerID- 1).addClass(classAnimation);

          window.setTimeout(function(){
                    $("ul li.playersStyle").eq(playerID - 1).removeClass(classAnimation);
          },400);
}


/*5. ------------------When the user adds/subtracts score for a player --------*/
scoreButton.addEventListener("click", function() {
    let idOfPlayer = Number(selectHTML.value);
    let points = Number(selectHTML.value);
    scored(idOfPlayer,points);
});
