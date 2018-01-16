"use strict";
let btnGo = document.getElementById("goBtn");
let inputPlayers = document.getElementById("numOfPlayers");
let listOfPlayersHTML = document.createElement("ul");
let divList = document.getElementById("list");
let selectHTML = document.getElementById("sel1");
let scoreButton = document.getElementsByClassName("btn-success")[0];
let pointsScored = document.getElementById("points");
let alert = document.getElementsByClassName("alert")[0];
let playerList = [];
let initialForm = document.getElementById("initialForm");

$('form input').keydown(function (e) {
    if (e.keyCode == 13) {
        e.preventDefault();
        return false;
    }
});

btnGo.addEventListener("click", function() {
    playerList = []
    while (listOfPlayersHTML.firstChild) {
        listOfPlayersHTML.removeChild(listOfPlayersHTML.firstChild)
    }
    let h2Msg = document.getElementsByClassName("playersPlaying")[0];
    h2Msg.innerHTML = "";
    if (Number(inputPlayers.value) <= 1) {
        alert.style.visibility = "visible";
        alert.style.display = "block";
        return;
    } else if (Number(inputPlayers.value) >= 2 && alert.style.visibility == "visible") {
        console.log(alert.style.visibility)
        alert.style.visibility = "hidden";
        alert.style.display = "none";
    }
    h2Msg.innerHTML = "Players playing: " + inputPlayers.value;
 //   init();
 //
        init();
    divList.appendChild(listOfPlayersHTML);
    document.getElementById("RS").style.visibility = "visible";

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

})

function init() {
    let nPlayers = Number(inputPlayers.value);
    for (let x = 1; x <= nPlayers; x++) {
        let p = new player(x);
        playerList.push(p);
        let liPHTML = document.createElement("li");
        liPHTML.setAttribute("id",x);
        let textP = document.createTextNode(p.textString());
        let textPTag = document.createElement("b");
        textPTag.appendChild(textP);

        liPHTML.appendChild(textPTag);
        liPHTML.classList.add("playersStyle");
        listOfPlayersHTML.appendChild(liPHTML);
        let option = document.createElement("option");
        let textOption = document.createTextNode(x);
        option.appendChild(textOption);
        selectHTML.appendChild(option);
    }
}

function scored(playerId,pointsScored){
    let idOfPlayer = playerId;
    let points = pointsScored;
    playerList[idOfPlayer - 1].updateScore(points);
    let playerScore = playerList[idOfPlayer - 1].textString();

    //This vvv not sure about this one.
    //let playerScoreText = document.createTextNode(playerScore);
    //let p1 = listOfPlayersHTML.childNodes[idOfPlayer - 1];
    //p1.replaceChild(playerScoreText, p1.childNodes[0]);
    // ^^^
    
    //replacement:
    $("li#"+idOfPlayer+" b").html(playerScore);
    //end
    let animationClass = "";
    if (points > 0){
        animationClass="playerScoreAnimation";}
    else{
        animationClass="playerDeductScoreAnimation";}
    $("ul li.playersStyle").eq(idOfPlayer - 1).addClass(animationClass);
   window.setTimeout(function(){
   $("ul li.playersStyle").eq(idOfPlayer - 1).removeClass(animationClass);
   },400); 
}

scoreButton.addEventListener("click", function() {

    let idOfPlayer = Number(selectHTML.value);

    let points = Number(pointsScored.value);
    scored(idOfPlayer,points);

});

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
