// Pull characters from api:
// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 27 Tywin Lannister
// 565 Joffrey Baratheon
// 148 Arya Stark
window.localStorage.clear();

var characterContainer = document.getElementsByClassName('characters__container')[0];
var headline = document.getElementsByClassName('header__headline')[0];
var charactersModal = document.getElementsByClassName('characters__modal')[0];
var characterNumbers = [27, 271, 583, 565, 148];
var houseColors = ['#d6bf53', '#993f40', '#a9ae9d', '#ce874b', '#a9ae9d'];
var players = []; 
var cardList = [];

for(let i = 0; i < characterNumbers.length; i++){
  fetch('https://www.anapioficeandfire.com/api/characters/' + characterNumbers[i])
  .then(function(response){
      return response.json(); 
  })
  .then(function(data){ 
    
    /* Create character cards */
    let card = document.createElement('div'); 
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

    /* Character selection */
    card.addEventListener('click', function(e){
      cardList.push(card);
      if(players.length < 2){
        players.push(data);
        if(players.length === 2){
          localStorage.setItem('players', JSON.stringify(players));
          localStorage.setItem('colors', JSON.stringify([{color: cardList[0].style.backgroundColor}, 
                                                         {color: cardList[1].style.backgroundColor}]));
          
          /* Create modal box for verification */ 
          let modalMessage = document.createElement('div'); 
          modalMessage.classList.add('characters__modal--message');
          modalMessage.innerHTML = 'You will play "' 
                                  + players[0].name 
                                  + '" against "' 
                                  + players[1].name 
                                  + '".';
          charactersModal.appendChild(modalMessage);  
          
          let modalCardBox = document.createElement('div');
          modalCardBox.classList.add('characters__modal--cards');
          modalCardBox.appendChild(cardList[0]);
          modalCardBox.appendChild(cardList[1]);
          charactersModal.appendChild(modalCardBox);

          let modalButtonBox = document.createElement('div'); 
          modalButtonBox.classList.add('characters__modal--button-wrap');

          let redoButton = document.createElement('a');
          redoButton.classList.add('characters__modal--button'); 
          redoButton.innerHTML = "Change players"; 
          modalButtonBox.appendChild(redoButton); 
          
          let modalButton = document.createElement('a'); 
          modalButton.classList.add('characters__modal--button');
          modalButton.setAttribute('href', 'in-game.html');
          modalButton.innerHTML = "I'm ready!";
          modalButtonBox.appendChild(modalButton); 
          
          charactersModal.appendChild(modalButtonBox);
          cardList[0].classList.remove('card--selected');
          charactersModal.style.display = "flex";

          redoButton.addEventListener('click', function(e){
            localStorage.clear();
            charactersModal.style.display = "none";
            players = [];
            characterContainer.appendChild(cardList[0]);
            characterContainer.appendChild(cardList[1]);
            cardList = [];
            headline.innerHTML = "Select your character";
            while(charactersModal.firstChild){
              charactersModal.removeChild(charactersModal.firstChild);
            }
          });
        }
        else{
          headline.innerHTML = 'You selected "' + players[0].name + '". Select your enemy!';
          card.classList.add('card--selected');
        }
      }
    });

    characterContainer.appendChild(card);
  });
}

