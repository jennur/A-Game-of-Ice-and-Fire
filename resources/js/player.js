// Pull characters from api:
// 27 Tywin Lannister
// 238 Cersei Lannister 
// 271 Daenerys Targaryen 
// 583 Jon Snow 
// 565 Joffrey Baratheon
// 148 Arya Stark
// 1052 Tyrion Lannister
// 232 Catelyn Stark
// 862 Renly Baratheon
// 867 Rhaegar Targaryen
window.localStorage.clear();

var characterContainer, headline, charactersModal, characterNumbers, 
houseColors, characterImages, players, cardList, loading, loaded, error;

characterContainer = document.getElementsByClassName('characters__container')[0];
headline = document.getElementsByClassName('header__headline')[0];
charactersModal = document.getElementsByClassName('characters-modal')[0];
loading = document.getElementById('loading')
characterNumbers = [27, 238, 271, 583, 565, 148, 1052, 232, 862, 867];
houseColors = ['#d6bf53', '#d6bf53','#993f40', '#a9ae9d', '#ce874b', '#a9ae9d', '#d6bf53', '#a9ae9d', '#ce874b', '#993f40'];
characterImages = ['assets/tywin.svg', 'assets/cersei.svg', 'assets/daenerys.svg', 
                   'assets/jonsnow.svg', 'assets/joffrey.svg', 'assets/arya.svg', 'assets/tyrion.svg', 'assets/catelyn.svg', 
                   'assets/renly.svg', 'assets/rhaegar.svg'];
players = [];
cardList = [];
loaded = [];

for(let i = 0; i < characterNumbers.length; i++){
  fetch('https://www.anapioficeandfire.com/api/characters/' + characterNumbers[i])
  .then(function(response){
    if(response.status !== 200){ loading.innerHTML = "Unable to load content :/"; }
    return response.json(); 
  })
  .then(function(data){ 
    
    /* Create character cards */
    let card = document.createElement('div'); 
    card.classList.add('characters__card');
    card.style.backgroundColor = houseColors[i];

    let charImg = document.createElement('img');
    charImg.setAttribute('src', characterImages[i]);
    charImg.classList.add('card__image');

    let title = document.createElement('h3'); 
    title.classList.add('card__title');
    title.innerHTML = data.name;

    let list = document.createElement('ul');

    let born = document.createElement('li');
    born.innerHTML = "Born " + data.born;
    list.appendChild(born);

    if(data.culture){
      let culture = document.createElement('li');
      culture.innerHTML = "Culture: " + data.culture;
      list.appendChild(culture);
    }

    card.append(title, charImg, list);
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
          modalMessage.classList.add('characters-modal__message');
          modalMessage.innerHTML = 'You will play "' 
                                  + players[0].name 
                                  + '" against "' 
                                  + players[1].name 
                                  + '".';
          charactersModal.appendChild(modalMessage);  
          
          let modalCardBox = document.createElement('div');
          modalCardBox.classList.add('characters-modal__cards');
          modalCardBox.appendChild(cardList[0]);
          modalCardBox.appendChild(cardList[1]);
          charactersModal.appendChild(modalCardBox);

          let modalButtonBox = document.createElement('div'); 
          modalButtonBox.classList.add('characters-modal__button-wrap');

          let redoButton = document.createElement('a');
          redoButton.classList.add('characters-modal__button'); 
          redoButton.innerHTML = "Change players"; 
          modalButtonBox.appendChild(redoButton); 
          
          let modalButton = document.createElement('a'); 
          modalButton.classList.add('characters-modal__button');
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
    loading.style.display = "none"
    characterContainer.appendChild(card);
  });
}
