// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var infoModal, headline, dice, playerMessages, player1Message, player2Message, board, numTiles, tiles, startTile, endTile, challengeTilesNum, challengeTiles, questions, path, 
    character, humanPlayerFeatures, autoPlayerFeatures, humanPlayerPiece, autoPlayerPiece; 

infoModal = document.getElementsByClassName('info-modal')[0];
headline = document.getElementsByClassName('header__headline')[0];
dice = document.getElementsByClassName('dice')[0];
diceFace = document.getElementsByClassName('dice-face')[0];
playerMessages = document.getElementsByClassName('player-messages')[0];
player1Message = document.getElementById('player1');
player2Message = document.getElementById('player2');
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

startTile = path[0];
endTile = path[path.length-1];
tiles = [];
challengeTiles = [3,32,40,50,84,89,117];
questions = [];

characters = JSON.parse(localStorage.getItem('players'));
charactersColors = JSON.parse(localStorage.getItem('colors'));

humanPlayerFeatures = [characters[0], charactersColors[0]];
autoPlayerFeatures = [characters[1], charactersColors[1]];

// Creating character board elements
humanPlayerPiece = document.createElement('span');
humanPlayerPiece.classList.add('player'); 
humanPlayerPiece.style.backgroundColor = charactersColors[0].color;
humanPlayerPiece.innerHTML = humanPlayerFeatures[0].name.charAt(0);

autoPlayerPiece = document.createElement('span');
autoPlayerPiece.classList.add('player'); 
autoPlayerPiece.style.backgroundColor = charactersColors[1].color;
autoPlayerPiece.innerHTML = autoPlayerFeatures[0].name.charAt(0);

// Appending tiles to board
buildBoard();

//Roll dice when click
dice.addEventListener('click', diceEventHandle);

function diceEventHandle(){
    playGame();
    let victory = checkVictory();
    if(victory){
      dice.removeEventListener('click', diceEventHandle);
    }
}


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
        tile.appendChild(humanPlayerPiece);
        tile.appendChild(autoPlayerPiece);
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

function playGame(player){
  let diceResult;
  diceResult = rollDice();
  
  if(diceResult === 6){
    player.message.innerHTML = "You got 6! Roll dice again."
  }
  else{
    movePlayer(player.piece)
  }
}

function playGame(){
    let diceResult1, diceResult2, number, face; 

    diceResult1 = rollDice();
    number = diceResult1[0];
    face = diceResult1[1];
    diceFace.setAttribute('src', face);
    player1Message.innerHTML = "You moved " + number + " steps.";
    movePlayer(humanPlayerPiece, number); 
  
    if(number !== 6){
      diceResult2 = rollDice();
      movePlayer(autoPlayerPiece, diceResult2[0]);
      diceFace.setAttribute('src', diceResult2[1]);
      player2Message.innerHTML = "Player 2 moved " + diceResult2[0] + " steps.";
    }
    else {
      player1Message.innerHTML = "You got 6! Roll dice again.";
    }
}

function movePlayer(playerPiece, number){
  let currentTile = playerPiece.parentElement;
  let newTile;

  newTile = moveForward(playerPiece, currentTile, number);

  if(isChallengeTile(newTile) && playerPiece === humanPlayerPiece){
    let button = document.createElement('button');
    button.classList.add('question-button');
    button.innerHTML = "Accept challenge to continue";
    button.addEventListener('click', function(){
      askQuestion();
      button.parentElement.removeChild(button);
    });

    playerMessages.appendChild(button);
    player1Message.innerHTML = "You moved " + number + " steps and stepped on a challenge tile!";

  }
  else if(isChallengeTile(newTile) && playerPiece === autoPlayerPiece){
    let result = Math.round(Math.random());
    if(result){
      newerTile = moveForward(playerPiece, newTile, 2)
      player2Message.innerHTML = autoPlayerFeatures.name + " answered correctly and moved " + number + " + 2 extra steps forward.";
    }
    else{
      newTile = moveBack(playerPiece, newTile, 2);    
      player2Message.innerHTML = autoPlayerFeatures.name + " didn't know the correct answer and moved 2 steps back.";
    }
  }
  return newTile; 
}

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
}

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


function getTileNumber(tile){
  return parseInt(tile.getAttribute('data-tile-number'));
}

function isPathTile(tile){
  for(let i = 0; i < path.length; i++){
    if(tile === path[i]){
      return true;
    }
  }
  return false;
} 

function getPathTile(num){
  return path[num];
}
 
function isChallengeTile(tile){
  for(let i = 0; i < challengeTiles.length; i++){
    if(tile === challengeTiles[i]){
        return true; 
    }
  }
  return false;
}

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
      let currentTile = humanPlayerPiece.parentElement;

      if(answerInput.value.toLowerCase() === data.character.toLowerCase()){
        result.innerHTML = 'Correct! "' + data.character + '" said this!';
        result.classList.add('question-modal__result--correct');
        questionModal.append(result, okBtn);

        moveForward(humanPlayerPiece, currentTile, 2);
        player1Message.innerHTML = "Congrats! You moved 2 extra steps forward.";
      }
      else{
        result.innerHTML = 'Wrong! "' + data.character + '" said this! You must move two steps back';
        result.classList.add('question-modal__result--wrong');
        questionModal.append(result, okBtn);
        
        moveBack(humanPlayerPiece, currentTile, 2);
        player1Message.innerHTML = "You moved 2 steps back.";
      }
    });
  });
}

function checkVictory(){
  let player1tileNumber = parseInt(humanPlayerPiece.parentElement.getAttribute('data-tile-number'));
  let player2tileNumber = parseInt(autoPlayerPiece.parentElement.getAttribute('data-tile-number'));
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
      headline.innerHTML = "You beat " + autoPlayerFeatures[0].name + ", Congratulations!";

      infoModal.style.display = "flex";
      infoModal.append(headline, question, answer);

      return true; 
    }
    else if(player2tileNumber === finalTile && player1tileNumber < finalTile){
      headline.innerHTML = "You got defeated by " + autoPlayerFeatures[0].name + ".";
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