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

var characterContainer,
  headerWrap,
  headline,
  infoModal,
  charactersModal,
  characterNumbers,
  houseColors,
  characterImages,
  players,
  cardList,
  loading,
  loaded,
  error;

characterContainer = document.getElementsByClassName(
  "characters__container"
)[0];
headerWrap = document.getElementsByClassName("header-wrap")[0];
headline = document.getElementsByClassName("header__headline")[0];
infoModal = document.getElementsByClassName("info-modal")[0];
charactersModal = document.getElementsByClassName("characters-modal")[0];
loading = document.getElementById("loading");
characterNumbers = [27, 238, 271, 583, 565, 148, 1052, 232, 862, 867];
houseColors = [
  "#ffc400",
  "#ffc400",
  "#940007",
  "#868686",
  "#ffc400",
  "#868686",
  "#ffc400",
  "#868686",
  "#ff7300",
  "#940007"
];
characterImages = [
  "assets/tywin.svg",
  "assets/cersei.svg",
  "assets/daenerys.svg",
  "assets/jonsnow.svg",
  "assets/joffrey.svg",
  "assets/arya.svg",
  "assets/tyrion.svg",
  "assets/catelyn.svg",
  "assets/renly.svg",
  "assets/rhaegar.svg"
];
players = [];
cardList = [];
loaded = [];

for (let i = 0; i < characterNumbers.length; i++) {
  fetch(
    "https://www.anapioficeandfire.com/api/characters/" + characterNumbers[i]
  )
    .then(function(response) {
      if (response.status !== 200) {
        loading.innerHTML = "Unable to load content :/";
      }
      return response.json();
    })
    .then(function(data) {
      /* Create character cards */
      let card = document.createElement("div");
      card.classList.add("characters__card");
      card.style.border = "1px solid " + houseColors[i];
      card.style.color = houseColors[i];

      let charImg = document.createElement("img");
      charImg.setAttribute("src", characterImages[i]);
      charImg.classList.add("card__image");
      card.append(charImg);

      let title = document.createElement("h3");
      title.classList.add("card__title");
      title.innerHTML = data.name;
      title.style.color = houseColors[i];

      let list = document.createElement("ul");

      let born = document.createElement("li");
      born.innerHTML = "Born " + data.born;
      list.appendChild(born);

      if (data.culture) {
        let culture = document.createElement("li");
        culture.innerHTML = "Culture: " + data.culture;
        list.appendChild(culture);
      }

      card.append(title, charImg, list);
      /* Character selection */
      card.addEventListener("click", function(e) {
        if (cardList.length === 1 && card === cardList[0]) {
          cardClone = cardList[0].cloneNode(true);
          cardList.push(cardClone);
        }
        card.classList.add("characters__card--selected");
        cardList.push(card);

        if (players.length < 2) {
          players.push(data);
          if (players.length === 2) {
            localStorage.setItem("players", JSON.stringify(players));
            localStorage.setItem(
              "colors",
              JSON.stringify([
                { color: cardList[0].style.color },
                { color: cardList[1].style.color }
              ])
            );
            localStorage.setItem(
              "images",
              JSON.stringify([
                { image: cardList[0].childNodes[1].outerHTML },
                { image: cardList[1].childNodes[1].outerHTML }
              ])
            );

            /* Create modal box for verification */

            let modalMessage = document.createElement("div");
            modalMessage.classList.add("characters-modal__message");
            modalMessage.innerHTML =
              'You will play "' +
              players[0].name +
              '" against "' +
              players[1].name +
              '".';
            charactersModal.appendChild(modalMessage);

            let modalCardBox = document.createElement("div");
            modalCardBox.classList.add("characters-modal__cards");
            modalCardBox.appendChild(cardList[0]);
            modalCardBox.appendChild(cardList[1]);
            charactersModal.appendChild(modalCardBox);

            let modalButtonBox = document.createElement("div");
            modalButtonBox.classList.add("button-wrap");

            let redoButton = document.createElement("a");
            redoButton.classList.add("button", "button--gray");
            redoButton.innerHTML = "Change players";
            modalButtonBox.appendChild(redoButton);

            let modalButton = document.createElement("a");
            modalButton.classList.add("button", "button--gray");
            modalButton.setAttribute("href", "in-game.html");
            modalButton.innerHTML = "I'm ready!";
            modalButtonBox.appendChild(modalButton);

            charactersModal.appendChild(modalButtonBox);
            cardList[0].classList.remove("card--selected");
            charactersModal.style.display = "flex";

            redoButton.addEventListener("click", function(e) {
              localStorage.clear();
              charactersModal.style.display = "none";
              players = [];
              cardList[0].classList.remove("characters__card--selected");
              cardList[1].classList.remove("characters__card--selected");

              characterContainer.appendChild(cardList[0]);
              characterContainer.appendChild(cardList[1]);
              cardList = [];
              headline.innerHTML = "Select your character";
              while (charactersModal.firstChild) {
                charactersModal.removeChild(charactersModal.firstChild);
              }
            });
          } else {
            headline.innerHTML =
              'You selected "' + players[0].name + '". Select your enemy!';
            infoModal.appendChild(headline);
            infoModal.style.opacity = 0;

            fadeIn(infoModal);
            count = 0;
            timer = setInterval(function() {
              count += 0.1;
              if (count > 1) {
                headline.innerHTML = "Select your enemy";
                headerWrap.appendChild(headline);
                fadeOut(infoModal);
                clearInterval(timer);
              }
            }, 200);
          }
        }
      });
      loading.style.display = "none";
      characterContainer.appendChild(card);
    });
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
