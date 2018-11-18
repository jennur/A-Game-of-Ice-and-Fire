// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark

var board = document.getElementsByClassName('board')[0];
var numTiles = 210; 

for(let i = 0; i < numTiles; i++){
  let tile = document.createElement('span'); 
  tile.classList.add('board__tile');
  tile.setAttribute('data-tilenumber', i); 
  board.appendChild(tile);
}