// 271 Daenerys Targaryen
// 583 Jon Snow
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var body,
  infoModal,
  questionModal,
  headline,
  yourPlayer,
  dice,
  diceHeadline,
  playerMessages,
  board,
  numTiles,
  questions,
  path,
  characters,
  charactersColors,
  charactersImages,
  startRound,
  continueRound,
  ragequit,
  rageScreen,
  characterSuggestions;

body = document.querySelector("body");
infoModal = document.getElementsByClassName("info-modal")[0];
questionModal = document.getElementsByClassName("question-modal")[0];
headline = document.getElementsByClassName("header__headline")[0];
yourPlayer = document.getElementsByClassName("header__player")[0];
dice = document.getElementsByClassName("dice")[0];
diceHeadline = document.getElementsByClassName("dice-headline")[0];
diceFace = document.getElementsByClassName("dice-face")[0];
playerMessages = document.getElementsByClassName("player-messages")[0];
board = document.getElementsByClassName("board")[0];
ragequit = document.getElementsByClassName("ragequit")[0];
rageScreen = document.getElementsByClassName("rage-modal")[0];

characterSuggestions = [
  "bronn",
  "brynden tully",
  "the hound",
  "jamie lannister",
  "littlefinger",
  "olenna tyrell",
  "renly baratheon",
  "tyrion",
  "varys"
];

ragequit.addEventListener("click", function() {
  let rageMessage = document.createElement("h1");
  rageMessage.classList.add("rage-modal__message");
  rageMessage.innerHTML = "AARRRRGGGHHHH!!!";
  rageScreen.appendChild(rageMessage);
  rageScreen.style.display = "flex";

  fadeIn(rageScreen);
  count = 0;
  timer = setInterval(function() {
    count += 0.1;
    if (count > 1) {
      location.reload();
      clearInterval(timer);
    }
  }, 100);
});

numTiles = 120;
path = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11, //right
  23,
  35,
  47, //down
  46,
  45,
  44,
  43,
  42, //41,40,39,38, //left
  30, //up
  29,
  28,
  27,
  26, //left
  38,
  50, //down
  49,
  48, //left
  60,
  72,
  84,
  96,
  108, //down
  109,
  110, //right
  98,
  86,
  74, //up
  75,
  76, //left
  64, //up
  65,
  66,
  67,
  68,
  69,
  70, //left
  82,
  94, //down
  93,
  92,
  91,
  90, //right
  102,
  114, //down
  115,
  116,
  117,
  118,
  119
]; //right

questions = [];

characters = JSON.parse(localStorage.getItem("players"));
charactersColors = JSON.parse(localStorage.getItem("colors"));
charactersImages = JSON.parse(localStorage.getItem("images"));

class Board {
  constructor(numTiles, path) {
    this.numTiles = numTiles;
    this.tiles = [];
    this.challengeTiles = [];

    this.path = path;
    this.startTile = path[0];
    this.endTile = path[path.length - 1];

    for (let i = 0; i < this.numTiles; i++) {
      let tile = document.createElement("span");
      tile.classList.add("board__tile");
      tile.setAttribute("data-tile-number", i);
      board.appendChild(tile);

      for (let j = 0; j < this.path.length; j++) {
        if (this.path[j] === i) {
          if (j === 0) {
            tile.classList.add("board__tile--start");
            let startImg = document.createElement("img");
            startImg.setAttribute("src", "assets/home.svg");
            startImg.classList.add("board__tile--image");
            tile.appendChild(startImg);
            this.startTile = tile;
          } else if (j === this.path.length - 1) {
            tile.classList.add("board__tile--finish");
            let finishImg = document.createElement("img");
            finishImg.setAttribute("src", "assets/dragon.svg");
            finishImg.classList.add("board__tile--image");
            tile.appendChild(finishImg);
            this.endTile = tile;
          }
          if (j !== 0 && j !== this.path.length - 1) {
            if (j % 5 === 2 || j % 12 === 0) {
              tile.classList.add("board__tile--challenge");
              let questionImg = document.createElement("img");
              questionImg.setAttribute("src", "assets/question.svg");
              questionImg.classList.add("board__tile--image");
              tile.appendChild(questionImg);
              this.challengeTiles.push(tile);
            } else if (j % 2 === 0) {
              tile.classList.add("board__tile--pathgreen");
            } else {
              tile.classList.add("board__tile--path");
            }
          }
          this.path[j] = tile;
        }
        this.tiles.push(tile);
      }
    }
  }
  getTileNumber(tile) {
    return parseInt(tile.getAttribute("data-tile-number"));
  }
  isPathTile(tile) {
    for (let i = 0; i < this.path.length; i++) {
      if (tile === this.path[i]) {
        return true;
      }
    }
    return false;
  }
  getPathTile(num) {
    return this.path[num];
  }
  isChallengeTile(tile) {
    for (let i = 0; i < this.challengeTiles.length; i++) {
      if (tile === this.challengeTiles[i]) {
        return true;
      }
    }
    return false;
  }
}

class Player {
  constructor(name, color, image, index, auto) {
    this.board;
    this.results = [];
    this.auto = auto;
    this.index = index;
    this.piece = document.createElement("span");
    this.piece.classList.add("player");
    this.piece.style.backgroundColor = color;
    this.piece.innerHTML = image;

    this.image = image;
    this.color = color;
    this.name = name;
  }
  addBoard(board) {
    this.board = board;
  }
  addToTile(tile) {
    tile.appendChild(this.piece);
  }
  moveForward(steps) {
    let tileIndex;

    if (this.board.isPathTile(this.piece.parentElement)) {
      tileIndex = this.board.path.indexOf(this.piece.parentElement);
      if (tileIndex + steps < this.board.path.length - 1) {
        this.board.path[tileIndex + steps].appendChild(this.piece);
      } else {
        this.board.endTile.appendChild(this.piece);
      }
    }
  }
  moveBackward(steps) {
    let tileIndex;
    path = this.board.path;
    if (this.board.isPathTile(this.piece.parentElement)) {
      tileIndex = this.board.path.indexOf(this.piece.parentElement);
      this.piece.parentElement.removeChild(this.piece);
      if (tileIndex - steps < this.board.path.indexOf(this.board.startTile)) {
        this.board.startTile.appendChild(this.piece);
      } else {
        this.board.path[tileIndex - steps].appendChild(this.piece);
      }
    }
  }
  listMessage(message) {
    let newMessage = document.createElement("li");
    newMessage.style.color = this.color;
    newMessage.innerHTML = message;
    playerMessages.insertBefore(newMessage, playerMessages.firstChild);
  }
  addQuestionResult(result) {
    this.results.push(result);
  }
  checkVictory() {
    return this.piece.parentElement === this.board.endTile ? true : false;
  }
}

//Build player objects
const player1 = new Player(
  characters[0].name,
  charactersColors[0].color,
  charactersImages[0].image,
  0,
  false
);
const player2 = new Player(
  characters[1].name,
  charactersColors[1].color,
  charactersImages[1].image,
  1,
  true
);
const players = [player1, player2];

const playerName = document.createTextNode(player1.name);
yourPlayer.appendChild(playerName);
const showPlayerPiece = document.getElementById("showPlayer");
showPlayerPiece.innerHTML = player1.image;
showPlayerPiece.style.backgroundColor = player1.color;

initiateGame(players);

//Functions

/*
function buildBoardPath(steps){
  boardWidth = 12;
  boardHeight = 10; 
  
  let path = [];
  let challengeTiles = [];
  path[0] = Math.floor(Math.random()*boardWidth);
  while(steps > 0){

    steps--; 
  }
  return [path, challengeTiles]; 
}
*/

function initiateGame(players) {
  const gameBoard = new Board(numTiles, path);
  for (let i = 0; i < players.length; i++) {
    players[i].addBoard(gameBoard);
    players[i].addToTile(gameBoard.startTile);
  }
  dice.addEventListener("click", diceEventHandle);
}

function diceEventHandle() {
  startRound = continueRound ? continueRound : 0;
  for (let i = startRound; i < players.length; i++) {
    let gameManager = playGame(players[i]);
    if (gameManager === 6) {
      if (!players[i].auto) {
        return;
      } else {
        extraRound = playGame(players[i]);

        while (extraRound === 6) {
          newRound = playGame(players[i]);
          extraRound = newRound;
        }
        gameManager = extraRound;
      }
    } else if (gameManager === 2) {
      return;
    }
    if (gameManager) {
      flashVictory(players[i]);
      return;
    }
  }
  continueRound = 0;
}

function rollDice() {
  let result = 1 + Math.floor(Math.random() * 6);
  let face = "assets/dice" + result + ".svg";
  diceFace.setAttribute("src", face);
  return result;
}

function playGame(player) {
  let steps, newTile, challenge, victory;

  steps = rollDice();
  player.moveForward(steps);
  newTile = player.piece.parentElement;
  challenge = player.board.isChallengeTile(newTile);
  victory = player.checkVictory();

  if (challenge) {
    player.listMessage(
      player.name +
        " moved " +
        steps +
        " steps and stepped into forbidden territory!"
    );
    if (!player.auto) {
      if (steps === 6) {
        prepareChallenge(player, steps);
        player.listMessage(player.name + ", roll dice again!");
        return 6;
      } else {
        prepareChallenge(player, steps);
        return 2;
      }
    } else {
      runAutoChallenge(player);
      if (steps === 6) {
        player.listMessage(player.name + ", roll dice again!");
        return 6;
      }
    }
  } else {
    player.listMessage(player.name + " moved " + steps + " steps.");
  }

  if (steps === 6 && !victory) {
    player.listMessage(player.name + ", roll dice again!");
    return 6;
  }

  return victory;
}

function prepareChallenge(player, steps) {
  dice.removeEventListener("click", diceEventHandle);
  diceHeadline.innerHTML = "Accept challenge to continue";
  dice.classList.add("dice--inactive");
  buttonWrap = document.createElement("li");
  buttonWrap.classList.add("player-messages__button-wrap");
  button = document.createElement("button");
  button.classList.add("player-messages__button");
  button.style.backgroundColor = player.color;
  button.innerHTML = "Take challenge!";
  buttonWrap.appendChild(button);
  button.addEventListener("click", function() {
    askQuestion(player, steps);
    button.parentElement.removeChild(button);
  });

  playerMessages.insertBefore(buttonWrap, playerMessages.firstChild);
}

function runAutoChallenge(player) {
  let result, newTile;
  result = Math.round(Math.random());

  if (result) {
    player.moveForward(2);
    player.addQuestionResult("correct");
    player.listMessage(
      player.name +
        " answered correctly and passed the gates, 2 extra steps forward."
    );
  } else {
    player.moveBackward(2);
    player.addQuestionResult("wrong");
    player.listMessage(
      player.name +
        " didn't know the correct answer and got kicked out of the territory, 2 steps back."
    );
  }

  newTile = player.piece.parentElement;
  if (player.board.isChallengeTile(newTile)) {
    player.listMessage(
      player.name + " stepped into another forbidden territory!"
    );
    runAutoChallenge(player);
  }
}

function askQuestion(player, steps) {
  fetch("https://got-quotes.herokuapp.com/quotes")
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      questions.push(data);
      localStorage.setItem("questions", JSON.stringify(questions));

      //Creating modal elements
      fadeIn(questionModal);

      let image = document.createElement("img");
      image.setAttribute("src", "assets/castle.svg");
      image.classList.add("question-modal__image");

      let headline = document.createElement("h1");
      headline.classList.add("question-modal__headline");
      headline.innerHTML =
        "You must answer correctly to pass the gates in peace";

      let question = document.createElement("div");
      question.classList.add("question-modal__question");
      question.innerHTML = 'Who said this: "' + data.quote + '" ? ';

      let answer = document.createElement("div");
      answer.classList.add("question-modal__form");
      answer.setAttribute("id", "answer");
      answer.classList.add("question-modal__answer-wrapper");

      let result = document.createElement("div");
      result.classList.add("question-modal__result");

      let btnWrap = document.createElement("div");
      btnWrap.classList.add("question-modal__button-wrap");

      let okBtn = document.createElement("button");
      okBtn.classList.add("question-modal__ok-btn");
      okBtn.innerHTML = "OK";

      btnWrap.append(okBtn);

      let suggestions = [];
      while (suggestions.length < 2) {
        let index = Math.floor(Math.random() * characterSuggestions.length);
        let name = characterSuggestions[index].toLowerCase();
        let correctName = data.character.toLowerCase();

        if (suggestions.length === 0 && name !== correctName) {
          suggestions.push(name);
        } else if (
          suggestions.length === 1 &&
          name !== correctName &&
          name !== suggestions[0]
        ) {
          suggestions.push(name);
        }
      }
      let position = Math.floor(Math.random() * 3);
      suggestions.splice(position, 0, data.character.toLowerCase());

      suggestions.forEach(function(element) {
        let button = document.createElement("button");
        button.innerHTML = element;
        button.classList.add("question-modal__suggestion");
        button.onclick = () => {
          let submittedAnswer = element.toLowerCase();
          questionModal.removeChild(answer);

          if (submittedAnswer === data.character.toLowerCase()) {
            result.innerHTML =
              'Correct! "' +
              data.character +
              '" said this! You can pass the gates.';
            result.classList.add("question-modal__result--correct");
            questionModal.append(result, okBtn);

            player.addQuestionResult("correct");
            player.moveForward(2);
            player.listMessage(
              player.name +
                " answered correctly and passed the gates, 2 extra steps!"
            );
          } else {
            result.innerHTML =
              '"' +
              submittedAnswer +
              '" is wrong. "' +
              data.character +
              '" said this! You are getting kicked out of the territory and must move two steps back';
            result.classList.add("question-modal__result--wrong");
            questionModal.append(result, btnWrap);

            player.addQuestionResult("wrong");
            player.moveBackward(2);
            player.listMessage(
              player.name +
                " didn't know the answer and got kicked out of the territory, 2 steps back."
            );
          }
        };
        answer.appendChild(button);
      });

      questionModal.append(image, headline, question, answer);

      okBtn.addEventListener("click", function() {
        fadeOut(questionModal);
        while (questionModal.firstChild) {
          questionModal.removeChild(questionModal.firstChild);
        }
        let challenge = player.board.isChallengeTile(
          player.piece.parentElement
        );
        let victory =
          player.piece.parentElement === player.board.endTile ? true : false;

        if (challenge) {
          player.listMessage(
            player.name + " stepped into another forbidden territory!"
          );
          prepareChallenge(player);
        }
        if (victory) {
          flashVictory(player);
        }
        if (steps !== 6 && !challenge && !victory) {
          continueRound = player.index + 1;
          diceEventHandle();
        }
      });
    });
  dice.addEventListener("click", diceEventHandle);
  diceHeadline.innerHTML = "Roll the dice!";
  dice.classList.remove("dice--inactive");
}

function flashVictory(player) {
  localStorage.setItem("winnerImg", player.image);
  player.listMessage(player.name + " caught the dragon!");
  while (infoModal.firstChild) {
    infoModal.removeChild(firstChild);
  }
  let finalScreen, finalMessage, timer;
  finalScreen = document.createElement("div");
  finalScreen.classList.add("final-modal");

  finalMessage = document.createElement("h1");
  finalMessage.classList.add("final-modal__message");

  finalScreen.appendChild(finalMessage);
  body.appendChild(finalScreen);
  finalScreen.style.display = "flex";

  if (player.index !== 0) {
    finalMessage.innerHTML = "You Lost";
    finalScreen.classList.add("final-modal--lost");
    infoModal.style.backgroundColor = "#940007";

    fadeIn(finalScreen);
    count = 0;
    timer = setInterval(function() {
      count += 0.1;
      if (count > 1) {
        fadeOut(finalScreen);
        infoModal.style.display = "flex";
        clearInterval(timer);
      }
    }, 100);
  } else {
    finalMessage.innerHTML = "You Won";
    finalScreen.classList.add("final-modal--won");
    infoModal.style.backgroundColor = "#6cb438";

    fadeIn(finalScreen);
    count = 0;
    timer = setInterval(function() {
      count += 0.1;
      if (count > 1) {
        fadeOut(finalScreen);
        infoModal.style.display = "flex";
        clearInterval(timer);
      }
    }, 100);
  }
  let headline = document.createElement("h1");
  headline.classList.add("info-modal__headline");
  headline.innerHTML = player.name + " won the game!";

  let winnerImage = document.createElement("div");
  winnerImage.innerHTML = player.image;
  /*
  let historyHeadline = document.createElement('h2');
  historyHeadline.innerHTML = "Game history: ";
*/
  let answer = document.createElement("div");
  answer.classList.add("question-modal__answer-wrapper");

  let yesBtn = document.createElement("a");
  yesBtn.setAttribute("href", "select-character.html");
  yesBtn.classList.add("info-modal__button");
  yesBtn.innerHTML = "Play again";

  let noBtn = document.createElement("a");
  noBtn.setAttribute("href", "final.html");
  noBtn.classList.add("info-modal__button");
  noBtn.innerHTML = "Take me to the score view";

  answer.append(yesBtn, noBtn);
  playerMessages.classList.add("player-messages--history");
  infoModal.append(headline, winnerImage, answer);

  localStorage.setItem("history", playerMessages.innerHTML);
  localStorage.setItem("players", JSON.stringify(players));
}

function fadeIn(element) {
  element.style.display = "flex";
  let opacity, timer;
  opacity = 0;

  timer = setInterval(function() {
    if (opacity >= 1) {
      clearInterval(timer);
    }
    element.style.opacity = opacity;
    opacity += 0.1;
  }, 20);
}

function fadeOut(element) {
  let opacity, timer;
  opacity = 1;

  timer = setInterval(function() {
    if (opacity <= 0) {
      element.style.display = "none";
      clearInterval(timer);
    }
    element.style.opacity = opacity;
    opacity -= 0.1;
  }, 20);
}
