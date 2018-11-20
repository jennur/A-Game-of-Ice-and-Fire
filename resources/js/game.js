// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
var dice, diceMessage, board, numTiles, tiles, startTile, endTile, challengeTilesNum, challengeTiles, path, 
    character, player1, player2; 

diceFace = document.getElementsByClassName('dice-face')[0];
diceMessage = document.getElementsByClassName('dice-message')[0];
board = document.getElementsByClassName('board')[0];
numTiles = 120; 
startTile = 0;
endTile = 119;
path = [1,2,3,4,5,6,7,8, //right
        20,32,44, //down
        43,42,41,40,39,38, //left
        50, //down
        49,48, //left
        60,72,84, //down
        85,86,87,88,89,90,91, //right
        103, //down
        115,116,117,118]; //right
tiles = [];
challengeTiles = [3,32,40,50,84,89,117];
characters = JSON.parse(localStorage.getItem('players'));

player1 = characters[0];
player2 = characters[1];

console.log(characters);

// Appending tiles to board
for(let i = 0; i < numTiles; i++){
  let tile = document.createElement('span'); 
  tile.classList.add('board__tile');
  tile.setAttribute('data-tile-number', i); 
  board.appendChild(tile);
  tiles.push(tile);

  //Creating path
  if(i === startTile){
    tile.classList.add('board__tile--start');
    startTile = tile;
  }
  else if(i === endTile){
    tile.classList.add('board__tile--end');
    endTile = tile;
  }
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
        path[j] = tile;
      }
    }
  }
}

//Roll dice when click
diceFace.addEventListener('click', function(e){
    let diceResult1, diceResult2, number, face; 
    diceResult1 = rollDice();
    number = diceResult1[0];
    face = diceResult1[1];
    diceFace.setAttribute('src', face);
    movePlayer(player1, number); 
    if(number !== 6){
      diceResult2 = rollDice();
      movePlayer(player2, diceResult2[0]);
      diceFace.setAttribute('src', diceResult2[1]);
      diceMessage.innerHTML = "Player 2 moved " + diceResult2[0] + " steps. Your turn to roll the dice!";
    }
    else {
      diceMessage.innerHTML = "You got 6! Roll dice again.";
    }
});



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

function movePlayer(player, number){
  
}