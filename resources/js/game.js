// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var infoModal, headline, dice, diceMessage, board, numTiles, tiles, startTile, endTile, challengeTilesNum, challengeTiles, questions, path, 
    character, player1features, player2features, player1piece, player2piece; 

infoModal = document.getElementsByClassName('info-modal')[0];
headline = document.getElementsByClassName('header__headline')[0];
dice = document.getElementsByClassName('dice')[0];
diceFace = document.getElementsByClassName('dice-face')[0];
diceMessage = document.getElementsByClassName('dice-message')[0];
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

player1features = [characters[0], charactersColors[0]];
player2features = [characters[1], charactersColors[1]];

// Creating character board elements
player1piece = document.createElement('span');
player1piece.classList.add('player'); 
player1piece.style.backgroundColor = charactersColors[0].color;
player1piece.innerHTML = player1features[0].name.charAt(0);

player2piece = document.createElement('span');
player2piece.classList.add('player'); 
player2piece.style.backgroundColor = charactersColors[1].color;
player2piece.innerHTML = player2features[0].name.charAt(0);

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
    return [result, face];
}

function movePlayer(playerPiece, number){
  let currentTile = playerPiece.parentElement;
  let newTile;

  moveForward(playerPiece, currentTile, number);


  for(let i = 0; i < challengeTiles.length; i++){
    if(playerPiece === player1piece && newTile === challengeTiles[i]){
      let result = askQuestion();
      if(!result){
        for(let i = 0; i < path.length; i++){
          if(newTile === path[i]){
            newTile.removeChild(playerPiece);
            newTile = path[i-2];
            newTile.appendChild(playerPiece);
            diceMessage.innerHTML = "You moved 2 steps back. Waiting for " + player2features.name + "."; 
          }
        }
      }
      break;
    }
    else if(playerPiece === player2piece && newTile === challengeTiles[i]){
      let result = Math.round(Math.random());

      if(!result){
        moveBack(playerPiece, newTile);    
        diceMessage.innerHTML = player2features.name + " didn't know the correct answer and moved 2 steps back.";
        break;
      }
      else{
        diceMessage.innerHTML = player2features.name + " moved " + number + " steps forward."; 
        break;
      }
    }
  }
}

function moveForward(playerPiece, currentTile, number){
    for(let i = 0; i < path.length; i++){
        if(path[i] === currentTile){
          if( i + number < path.length){
            //currentTile.removeChild(playerPiece);
            
            for(let j = i; j <= i + number; j++){
                  currentTile.removeChild(playerPiece);
                  newTile = path[j];
                  newTile.appendChild(playerPiece);
                  currentTile = newTile;
                }
            //newTile = path[i + number];
            //newTile.appendChild(playerPiece);
            break;
          }
          else {
            setTimeout(function(){
            for(let j = i; j > path.length; j++){
                  currentTile.removeChild(playerPiece);
                  newTile = path[j];
                  newTile.appendChild(playerPiece);
                  currentTile = newTile;
                }
              }, 1000);
            //newTile = path[path.length-1];
            //newTile.appendChild(playerPiece);
            break;
          }
        }
      }
}

function moveBack(playerPiece, currentTile){
  let newTile;
  for(let i = 0; i < path.length; i++){
    if(currentTile === path[i]){
    currentTile.removeChild(playerPiece);
    newTile = path[i-2];
    newTile.appendChild(playerPiece);
    }
  }
}

function playGame(){
    let diceResult1, diceResult2, number, face; 

    diceResult1 = rollDice();
    number = diceResult1[0];
    face = diceResult1[1];
    diceFace.setAttribute('src', face);
    diceMessage.innerHTML = "You moved " + number + " steps. Waiting for " + player2features[0].name + ".";
    movePlayer(player1piece, number); 
  
    if(number !== 6){
      diceResult2 = rollDice();
      movePlayer(player2piece, diceResult2[0]);
      diceFace.setAttribute('src', diceResult2[1]);
      diceMessage.innerHTML = "Player 2 moved " + diceResult2[0] + " steps. Your turn to roll the dice!";
    }
    else {
      diceMessage.innerHTML = "You got 6! Roll dice again.";
    }
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
      
      if(answerInput.value.toLowerCase() === data.character.toLowerCase()){
        result.innerHTML = 'Correct! "' + data.character + '" said this!';
        result.classList.add('question-modal__result--correct');
        questionModal.append(result, okBtn);
        return true;
      }
      else{
        result.innerHTML = 'Wrong! "' + data.character + '" said this! You must move two steps back';
        result.classList.add('question-modal__result--wrong');
        questionModal.append(result, okBtn);
        return false; 
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