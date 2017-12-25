"use strict";
let btnGO = document.getElementById("goBtn");
let inputPlayers = document.getElementById("numOfPlayers");
let listOfPlayersHTML = document.createElement("ul");
let divList = document.getElementById("list");
let selectHTML = document.getElementById("sel1");
let scoreButton = document.getElementsByClassName("btn-success")[0];
let pointsScored = document.getElementById("points");
let alert = document.getElementsByClassName("alert")[0];
let playerList = [];

btnGO.addEventListener("click", function() {
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
    init();
    divList.appendChild(listOfPlayersHTML);
    document.getElementById("RS").style.visibility = "visible";
})

function init() {
    let nPlayers = Number(inputPlayers.value);
    for (let x = 1; x <= nPlayers; x++) {
        let p = new player(x);
        playerList.push(p);
        let liPHTML = document.createElement("li");
        let textP = document.createTextNode(p.textString());
        liPHTML.appendChild(textP);
        liPHTML.classList.add("playersStyle");
        listOfPlayersHTML.appendChild(liPHTML);
        let option = document.createElement("option");
        let textOption = document.createTextNode(x);
        option.appendChild(textOption);
        selectHTML.appendChild(option);
    }
}

scoreButton.addEventListener("click", function() {
    let idOfPlayer = Number(selectHTML.value);
    let points = Number(pointsScored.value);
    playerList[idOfPlayer - 1].updateScore(points);
    let playerScore = playerList[idOfPlayer - 1].textString();
    let playerScoreText = document.createTextNode(playerScore);
    let p1 = listOfPlayersHTML.childNodes[idOfPlayer - 1];
    p1.replaceChild(playerScoreText, p1.childNodes[0]);
})

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