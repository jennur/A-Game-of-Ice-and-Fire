// Pull characters from api:
// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark

var characterContainer = document.getElementsByClassName('characters__container')[0];
var characterNumbers = [27, 271, 583, 565, 148];
var houseColors = ['#d6bf53', '#993f40', '#a9ae9d', '#ce874b', '#a9ae9d'];

for(let i = 0; i < characterNumbers.length; i++){
  fetch('https://www.anapioficeandfire.com/api/characters/' + characterNumbers[i])
  .then(function(response){
      return response.json(); 
  })
  .then(function(data){
    console.log(data);
    let card = document.createElement('a'); 
    card.setAttribute('href', 'in-game.html');
    card.classList.add('characters__card');
    card.style.backgroundColor = houseColors[i];
    
    let title = document.createElement('h3'); 
    title.classList.add('card__title');
    title.innerHTML = data.name;
    
    card.appendChild(title);
    let titleList = document.createElement('ul');
    titleList.classList.add('card__titles-list');
    for(let i = 0; i < data['titles'].length; i++){
      let listItem = document.createElement('li');
      listItem.innerHTML = data.titles[i];
      titleList.appendChild(listItem);
    }
    card.appendChild(titleList);
    characterContainer.appendChild(card);
  });
}

