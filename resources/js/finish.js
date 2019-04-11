var players, playerMessages;

players = JSON.parse(window.localStorage.getItem("players"));

playerMessages = document.getElementsByClassName("player-messages")[0];
playerMessages.innerHTML = localStorage.getItem("history");

let scores,
  scoresContent,
  scoresTitle,
  scoresNumber,
  scoresText,
  result,
  winnerImgWrap,
  winnerImg;

winnerImgWrap = document.querySelector(".header__final-img-wrap");
winnerImg = localStorage.getItem("winnerImg");
winnerImgWrap.innerHTML = winnerImg;

scores = document.getElementsByClassName("score__wrapper")[0];
for (let i = 0; i < players.length; i++) {
  result = 0;

  for (let j = 0; j < players[i].results.length; j++) {
    if (players[i].results[j] === "correct") {
      result += 1;
    }
  }
  scoresContent = document.createElement("div");
  scoresContent.classList.add("scores__container");
  scoresContent.style.border = "1px solid " + players[i].color;

  scoresTitle = document.createElement("h2");
  scoresTitle.classList.add("scores__title");
  scoresTitle.innerHTML = players[i].name;
  scoresTitle.style.color = players[i].color;

  scoresNumber = document.createElement("span");
  scoresNumber.classList.add("scores__number");
  scoresNumber.innerHTML = result;
  scoresNumber.style.color = players[i].color;

  scoresText = document.createElement("p");
  scoresText.classList.add("scores__text");
  scoresText.style.color = players[i].color;

  scoresText.innerHTML =
    "correct answers out of " + players[i].results.length + " questions.";

  scoresContent.append(scoresTitle, scoresNumber, scoresText);
  scores.appendChild(scoresContent);
}
