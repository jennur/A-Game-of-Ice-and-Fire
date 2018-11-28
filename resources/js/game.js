// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var infoModal, headline, dice, playerMessages, player1Message, player2Message, board, numTiles, tiles, startTile, endTile, challengeTilesNum, challengeTiles, questions, path, 
    character; //, player1features, player2features, player1piece, player2piece; 

infoModal = document.getElementsByClassName('info-modal')[0];
headline = document.getElementsByClassName('header__headline')[0];
dice = document.getElementsByClassName('dice')[0];
diceFace = document.getElementsByClassName('dice-face')[0];
playerMessages = document.getElementsByClassName('player-messages')[0];
board = document.getElementsByClassName('board')[0];

numTiles = 120; 
path = [0,1,2,3,4,5,6,7,8, //right
        20,32,44, //down
        43,42,41,40,39,38, //left
        50, //down
        49,48, //left
        60,72,84, //down
        85,86,87,88,89,90,91, //right
        103, //down
        115,116,117,118,119]; //right
/*
startTile = path[0];
endTile = path[path.length-1];
tiles = [];
challengeTiles = [3,32,40,50,84,89,117];*/
questions = [];

characters = JSON.parse(localStorage.getItem('players'));
charactersColors = JSON.parse(localStorage.getItem('colors'));

//player1features = [characters[0], charactersColors[0]];
//player2features = [characters[1], charactersColors[1]];

class Board {
  constructor(numTiles, path){
    this.numTiles = numTiles;
    this.tiles = [];
    this.challengeTiles = [];

    this.path = path; 
    this.startTile = path[0];    
    this.endTile = path[path.length-1];

    for(let i = 0; i < this.numTiles; i++){
      let tile = document.createElement('span'); 
      tile.classList.add('board__tile');
      tile.setAttribute('data-tile-number', i); 
      board.appendChild(tile);

      for(let j = 0; j < this.path.length; j++){
        if(this.path[j] === i){
          if(j === 0){
            tile.classList.add('board__tile--start');
            this.startTile = tile;
          }
          else if(j%5 === 2 || j%12 === 0){
            tile.classList.add('board__tile--challenge');
            let question = document.createElement('img');
            question.setAttribute('src', '../assets/question.svg');
            question.classList.add('question-image');
            tile.appendChild(question);
            this.challengeTiles.push(tile);
          }
          else if(j%2 === 0){
            tile.classList.add('board__tile--pathgreen');
          }
          else{
            tile.classList.add('board__tile--path');
          }
          this.path[i] = tile;
        }
        this.tiles.push(tile);
      }
    }
  }

  getTileNumber(tile){
    return parseInt(tile.getAttribute('data-tile-number'));
  }
  
  isPathTile(tile){
    for(let i = 0; i < this.path.length; i++){
      if(tile === this.path[i]){
        return true;
      }
    }
    return false;
  } 
  
  getPathTile(num){
    return this.path[num];
  }
   
  isChallengeTile(tile){
    for(let i = 0; i < this.challengeTiles.length; i++){
      if(tile === this.challengeTiles[i]){
          return true; 
      }
    }
    return false;
  }
}

class Player{
  constructor(auto, name, color){
    this.board; 
    this.auto = auto;
    this.piece = document.createElement('span');
    this.piece.classList.add('player'); 
    this.piece.style.backgroundColor = color;
    this.piece.innerHTML = name.charAt(0);

    this.color = color;
    this.name = name;
  }
  addBoard(board){ 
    this.board = board; 
  }
  addToTile(tile){ 
    tile.appendChild(this.piece); 
  }
  moveForward(steps){
    let newTile, currentTile, path, tileIndex;
    path = this.board.path;
    currentTile = this.piece.parentElement;

    if(this.board.isPathTile(currentTile)){
      tileIndex = path.indexOf(currentTile);
      if(tileIndex + steps > path.length-1){
        newTile = path[path.length-1];
      }
      else{
        newTile = path[tileIndex + steps];
      }
      currentTile.removeChild(this.piece);
      newTile.appendChild(this.piece);
    }
  }
  moveBackward(steps){
    let newTile, currentTile, path;
    path = this.board.path;
    currentTile = this.piece.parentElement;

    if(this.board.isPathTile(currentTile)){
      currentTile.removeChild(player.piece);
      let tileIndex = path.indexOf(currentTile);
      newTile = path[tileIndex-steps];
      newTile.appendChild(player.piece);
    }
    return newTile;
  }
  listMessage(message){
    let newMessage = document.createElement('li');
    newMessage.innerHTML = message;
    playerMessages.insertBefore(newMessage, playerMessages.firstChild);
  }

}

const player1 = new Player(false, characters[0].name, charactersColors[0].color);
const player2 = new Player(true, characters[1].name, charactersColors[1].color);

// Appending tiles to board

initiateGame([player1, player2]);
/*buildBoard();*/

//Roll dice when click



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



function initiateGame(players){
  const gameBoard = new Board(numTiles, path);
  for(let i = 0; i < players.length; i++){
    players[i].addBoard(gameBoard);
    players[i].addToTile(gameBoard.startTile);
  }
  dice.addEventListener('click', diceEventHandle);
}

function diceEventHandle(){
  playGame(player1);
  /*let victory = checkVictory();
  if(victory){
    dice.removeEventListener('click', diceEventHandle);
  }*/
}
/*
function buildBoard(){
  for(let i = 0; i < numTiles; i++){
    let tile = document.createElement('span'); 
    tile.classList.add('board__tile');
    tile.setAttribute('data-tile-number', i); 
    board.appendChild(tile);
    tiles.push(tile);
    
    //Adding path-tile
    if(i === startTile){
        tile.classList.add('board__tile--start');
        startTile = tile;
        tile.appendChild(player1piece);
        tile.appendChild(player2piece);
    }
    else if(i === endTile){
        tile.classList.add('board__tile--end');
        endTile = tile;
    }//Done adding path-tile

    //Adding challenge tile
    for(let k = 0; k < challengeTiles.length; k++){
      for(let j = 0; j < path.length; j++){
          if( i === challengeTiles[k]){
              tile.classList.add('board__tile--challenge');
              let question = document.createElement('img');
              question.setAttribute('src', '../assets/question.svg');
              question.classList.add('question-image');
              tile.appendChild(question);
              challengeTiles[k] = tile;
          }
          else if(i === path[j]){
              if(!tile.classList.contains('board__tile--challenge')){
              tile.classList.add('board__tile--path');
              }
              if(j%2 === 0){
              tile.classList.add('board__tile--pathgreen');
              }
              path[j] = tile;
          }
      }
    }//Done adding challenge tile
  }
}
*/
function rollDice(){
    let result = 1 + Math.floor(Math.random()*6);
    let face;
    switch(result){
        case 1: 
          face = '../assets/dice1.svg';
          break;
        case 2:
          face = '../assets/dice2.svg';
          break;
        case 3: 
          face = '../assets/dice3.svg';
          break;
        case 4: 
          face = '../assets/dice4.svg';
          break;
        case 5: 
          face = '../assets/dice5.svg';
          break;
        case 6: 
          face = '../assets/dice6.svg';
          break;
    }
    diceFace.setAttribute('src', face);
    return result;
}

function runAutoChallenge(player){
  let result, newTile;
  result = Math.round(Math.random());

  if(result){
    player.moveForward(2);
    player.listMessage(player.name + " answered correctly and moved 2 extra steps forward.");
  }
  else{
    player.moveForward(2);
    player2Message.innerHTML = player2features.name + " didn't know the correct answer and moved 2 steps back.";
  }

  newTile = player.piece.parentElement;
  if(player.board.isChallengeTile(newTile)){
    runAutoChallenge(player);
  }
}

function playGame(player){
  dice.removeEventListener('click', diceEventHandle);
  let steps, newTile, challenge, buttonWrap, button, finalTile, path;

  steps = rollDice();
  newTile = player.moveForward(steps);
  challenge = player.board.isChallengeTile(newTile);

  if(player.auto){
    if(challenge){
      runAutoChallenge(player);
    
    }
  }
  if(challenge && !player.auto){
    buttonWrap = document.createElement('li');
    button = document.createElement('button');
    button.classList.add('question-button');
    button.innerHTML = "Accept challenge to continue";
    buttonWrap.appendChild(button);
    button.addEventListener('click', function(){
      askQuestion();
      button.parentElement.removeChild(button);
    });

    playerMessages.insertBefore(buttonWrap, playerMessages.firstChild);
    player.listMessage("You moved " + steps + " steps and stepped on a challenge tile!");
  }
  /*else if(challenge && player.auto){
    let result = Math.round(Math.random());
    if(result){
      newerTile = moveForward(playerPiece, newTile, 2)
      player2Message.innerHTML = player2features.name + " answered correctly and moved " + number + " + 2 extra steps forward.";
    }
    else{
      newTile = moveBack(playerPiece, newTile, 2);
      player2Message.innerHTML = player2features.name + " didn't know the correct answer and moved 2 steps back.";
    }
  }*/
  else if(!challenge){
    player.listMessage(player.name + " moved " + steps + " steps.");
  }
  if(steps === 6){
    player.listMessage(player.name + " got 6! Roll dice again.");

    if(!player.auto){
      dice.addEventListener('click', diceEventHandle);
    }
    else{
      playGame(player);
    }
  }
  playGame(player2);
  finalTile = player.piece.parentElement;
  path = player.board.path;
  
  return(finalTile === path[path.length-1] ? true : false);
}
/*
function playGame(){
    let diceResult1, diceResult2, number, face; 

    diceResult1 = rollDice();
    number = diceResult1[0];
    face = diceResult1[1];
    diceFace.setAttribute('src', face);
    player1Message.innerHTML = "You moved " + number + " steps.";
    movePlayer(player1piece, number); 
  
    if(number !== 6){
      diceResult2 = rollDice();
      movePlayer(player2piece, diceResult2[0]);
      diceFace.setAttribute('src', diceResult2[1]);
      player2Message.innerHTML = "Player 2 moved " + diceResult2[0] + " steps.";
    }
    else {
      player1Message.innerHTML = "You got 6! Roll dice again.";
    }
}
*/
/*
function movePlayer(player, steps){
  let currentTile = player.piece.parentElement;
  let newTile;

  newTile = moveForward(player.piece, currentTile, steps);

  if(player.board.isChallengeTile(newTile) && player.auto === false){
    let button = document.createElement('button');
    button.classList.add('question-button');
    button.innerHTML = "Accept challenge to continue";
    button.addEventListener('click', function(){
      askQuestion();
      button.parentElement.removeChild(button);
    });

    playerMessages.insertBefore(button, playerMessages.firstChild);
    let updateMessage = "You moved " + steps + " steps and stepped on a challenge tile!";
    player.listMessage(updateMessage);

  }
  else if(isChallengeTile(newTile) && playerPiece === player2piece){
    let result = Math.round(Math.random());
    if(result){
      newerTile = moveForward(playerPiece, newTile, 2)
      player2Message.innerHTML = player2features.name + " answered correctly and moved " + number + " + 2 extra steps forward.";
    }
    else{
      newTile = moveBack(playerPiece, newTile, 2);    
      player2Message.innerHTML = player2features.name + " didn't know the correct answer and moved 2 steps back.";
    }
  }
  return newTile; 
}*/
/*
function moveForward(playerPiece, currentTile, number){
  let newTile;
  if(isPathTile(currentTile)){
    let tileIndex = path.indexOf(currentTile);
    if(tileIndex + number < path.length){
      newTile = path[tileIndex + number];
    }
    else{
      newTile = path[path.length-1];
    }
    currentTile.removeChild(playerPiece);
    newTile.appendChild(playerPiece);
  }
  return newTile;
}*/
/*
function moveBack(playerPiece, currentTile, steps){
  let newTile;

  if(isPathTile(currentTile)){
    currentTile.removeChild(playerPiece);
    let tileIndex = path.indexOf(currentTile);
    newTile = path[tileIndex-steps];
    newTile.appendChild(playerPiece);
  }
  return newTile;
}
*/



function askQuestion(){
  fetch('https://got-quotes.herokuapp.com/quotes')
  .then(function(response){
    return(response.json());
  })
  .then(function(data){
    questions.push(data);
    localStorage.setItem('questions', JSON.stringify(questions));

    //Creating modal elements
    let questionModal = document.getElementsByClassName('question-modal')[0];
    fadeIn(questionModal);

    let headline = document.createElement('h1'); 
    headline.classList.add('question-modal__headline');
    headline.innerHTML = "How well do you know Game of Thrones?";

    let question = document.createElement('div');
    question.classList.add('question-modal__question');
    question.innerHTML = 'Who said this: "' + data.quote + '" ? ';

    let answer = document.createElement('form');
    answer.setAttribute('id', 'answer');
    answer.setAttribute('method', 'get');
    answer.classList.add('question-modal__answer-wrapper');

    let answerInput = document.createElement('input'); 
    answerInput.setAttribute('name', 'answer'); 
    answerInput.setAttribute('type', 'text'); 
    answerInput.setAttribute('placeholder', 'Your answer here ...');
    answerInput.classList.add('question-modal__input');

    let answerSubmit = document.createElement('button');
    answerSubmit.setAttribute('type', 'sumbit');
    answerSubmit.setAttribute('form', 'answer');
    answer.setAttribute('value', 'submit');
    answerSubmit.classList.add('question-modal__submit');
    answerSubmit.innerHTML = "That's my answer!";

    answer.append(answerInput, answerSubmit);
    questionModal.append(headline, question, answer);

    let result = document.createElement('div');
    result.classList.add('question-modal__result');

    let okBtn = document.createElement('button');
    okBtn.classList.add('question-modal__ok-btn');
    okBtn.innerHTML = "OK";

    okBtn.addEventListener('click', function(){
      fadeOut(questionModal);
    });

    answer.addEventListener('submit', function(e){
      e.preventDefault();
      questionModal.removeChild(answer);
      console.log(answerInput.value.toLowerCase() + " " + data.character.toLowerCase());

      if(answerInput.value.toLowerCase() === data.character.toLowerCase()){
        result.innerHTML = 'Correct! "' + data.character + '" said this!';
        result.classList.add('question-modal__result--correct');
        questionModal.append(result, okBtn);

        player.moveForward(2);
      }
      else{
        result.innerHTML = 'Wrong! "' + data.character + '" said this! You must move two steps back';
        result.classList.add('question-modal__result--wrong');
        questionModal.append(result, okBtn);
        player.moveBack(2);
      }
    });
  });
}

function checkVictory(){
  let player1tileNumber = parseInt(player1piece.parentElement.getAttribute('data-tile-number'));
  let player2tileNumber = parseInt(player2piece.parentElement.getAttribute('data-tile-number'));
  let finalTile = parseInt(endTile.getAttribute('data-tile-number'));

  if(player1tileNumber === finalTile || player2tileNumber === finalTile){
    let headline = document.createElement('h1'); 
    headline.classList.add('info-modal__headline');

    let question = document.createElement('div');
    question.classList.add('info-modal__question');
    question.innerHTML = 'Play again?';

    let answer = document.createElement('div');
    answer.classList.add('question-modal__answer-wrapper');

    let yesBtn = document.createElement('a');
    noBtn.setAttribute('href', 'select-character.html');
    yesBtn.classList.add('info-modal__button');
    yesBtn.innerHTML = "One more time!";

    let noBtn = document.createElement('a');
    noBtn.setAttribute('href', 'final.html');
    noBtn.classList.add('info-modal__button');
    noBtn.innerHTML = "No, take me to the score view!";

    answer.append(yesBtn, noBtn);

    if(player1tileNumber === finalTile && player2tileNumber < finalTile){
      headline.innerHTML = "You beat " + player2features[0].name + ", Congratulations!";

      infoModal.style.display = "flex";
      infoModal.append(headline, question, answer);

      return true; 
    }
    else if(player2tileNumber === finalTile && player1tileNumber < finalTile){
      headline.innerHTML = "You got defeated by " + player2features[0].name + ".";
      infoModal.style.display = "flex";
      infoModal.append(headline, question, answer);
      return true; 
    }
  }

  
}

function fadeIn(element){
  element.style.display = "flex";
  let opacity, timer;
  opacity = 0;
  
  timer = setInterval(function(){ 
  if(opacity >= 1){
      clearInterval(timer);
  }
  element.style.opacity = opacity;
  opacity += 0.1;
  }, 20);
}

function fadeOut(element){
  let opacity, timer;
  opacity = 1;
  
  timer = setInterval(function(){ 
  if(opacity <= 0){
    element.style.display = "none";
    clearInterval(timer);
  }
  element.style.opacity = opacity;
  opacity -= 0.1;
  }, 20);
}