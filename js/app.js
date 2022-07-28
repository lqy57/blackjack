/*----- constants -----*/
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];

// Build a 'master' deck of 'card' objects used to create shuffled decks
const masterDeck = buildMasterDeck();
renderDeckInContainer(masterDeck, document.getElementById('master-deck-container'));

/*----- app's state (variables) -----*/
let shuffledDeck;
let pWins = 0;
let dWins = 0;
let playerHand = [];
let dealerHand = [];
let pValue = 0;
let dValue = 0; 
let pDiff = 0;
let dDiff = 0;
let showDealerHand = false;
let hitButton = document.querySelector('#hit');
let standButton = document.querySelector('#stand');
hitButton.disabled = true;
standButton.disabled = true;

/*----- cached element references -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');
const pWCounter = document.getElementById('pWins');
const dWCounter = document.getElementById('dWins');
const player = document.getElementById('player');
const dealer = document.getElementById('dealer');
const pHand = document.getElementById('pHand');
const dHand = document.getElementById('dHand');
const modalEl = document.getElementById('win-modal')
const modalTextEl = document.getElementById('modal-text');
const spanEl = document.getElementsByClassName('close')[0];

/*----- event listeners -----*/
document.querySelector('#new-hand').addEventListener('click', renderNewShuffledDeck);
document.querySelector('#new-hand').addEventListener('click', renderDealedHands);
document.querySelector('#hit').addEventListener('click', hitPlayerHand);
document.querySelector('#stand').addEventListener('click', dealerTurn);
document.querySelector('#reset').addEventListener('click', resetGame);

/*----- functions -----*/
function renderDealedHands() {
    // show buttons and variables after starting game/new hand
    hitButton.disabled = false;
    standButton.disabled = false;
    showDealerHand = false;
    player.style.display = "block";
    pWCounter.style.display = "block";
    dealer.style.display = "block";
    dWCounter.style.display = "block";
    hitButton.style.display = "block";
    standButton.style.display = "block";
    // reset hand
    playerHand = []; 
    dealerHand = [];
    // dealing cards
    playerHand.push(shuffledDeck.shift());
    dealerHand.push(shuffledDeck.shift());
    playerHand.push(shuffledDeck.shift());
    dealerHand.push(shuffledDeck.shift());
    updateHand();
    compareHands('A');
}

function updateHand() {
    // updates the view and cards for each hand
    pHand.innerHTML = '';
    let pContainer = '';
    playerHand.forEach(function(card) {
        pContainer += `<div class="card ${card.face}"></div>`;
    });
    pHand.innerHTML = pContainer;

    dHand.innerHTML = '';
    let dContainer = '';
    dContainer += `<div class="card ${dealerHand[0].face}"></div>`;
    dContainer += `<div class="card back"></div>`; 

    if(showDealerHand) {
        dContainer = '';
        dealerHand.forEach(function(card) {
        dContainer += `<div class="card ${card.face}"></div>`;
        });
    }

    dHand.innerHTML = dContainer;
}

function hitPlayerHand() {
    // deal new card to hand
    playerHand.push(shuffledDeck.shift());
    updateHand();
    compareHands('B');
}

function hitDealerHand() {
    // deal new card to dealer
    dealerHand.push(shuffledDeck.shift());
    updateHand();
    compareHands('C');
}

function dealerTurn() {
    showDealerHand = true;
    updateHand()
    // dealer logic 
    // hit if player score is closer to 21 than dealer score
    while(dValue < 17) {
        hitDealerHand();
    } 
    // stand if dealer score is btw 17 and 21
    if(dValue >= 17 && dValue < 21) {
        compareHands('D');
    }
}

function compareHands(compare) {
    pValue = 0;
    dValue = 0;
    playerHand.forEach(function(card) {
        pValue += card.value;
    }) 
    dealerHand.forEach(function(card) {
        dValue += card.value;
    }) 
    pDiff = 21 - pValue;
    dDiff = 21 - dValue;
    let comparison = compare;
    switch(comparison) {
        case 'A': 
            if(pDiff == 0) {
                modalTextEl.innerText = "Blackjack! Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(dDiff == 0) {
                modalTextEl.innerText = "Blackjack! Dealer Wins!"
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'B':
            if(pDiff < 0) {
                modalTextEl.innerText = "Player Busts! Dealer Wins!";
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(pDiff == 0) {
                modalTextEl.innerText = "Blackjack! Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'C': 
            if(dDiff < 0) {
                modalTextEl.innerText = "Dealer Busts! Player Wins!"
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(dDiff == 0) {
                modalTextEl.innerText = "Blackjack! Dealer Wins!";
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'D':
            if(pDiff == dDiff) {
                modalTextEl.innerText = "It's a tie!";
                modalEl.style.display = "block";
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(pDiff < dDiff) {
                modalTextEl.innerText = "Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else {
                modalTextEl.innerText = "Dealer Wins!";
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
    }   
    pWCounter.innerText = `Player Wins: ${pWins}`;
    dWCounter.innerText = `Dealer Wins: ${dWins}`;
}

function getNewShuffledDeck() {
  // Create a copy of the masterDeck (leave masterDeck untouched!)
  const tempDeck = [...masterDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderNewShuffledDeck() {
  // Create a copy of the masterDeck (leave masterDeck untouched!)
  shuffledDeck = getNewShuffledDeck();
  renderDeckInContainer(shuffledDeck, shuffledContainer);
}

function renderDeckInContainer(deck, container) {
  container.innerHTML = '';
  // build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
}

function buildMasterDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property for game of blackjack, not war
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

function resetGame() {
    location.reload();
}

renderNewShuffledDeck();

player.style.display = "none";
pWCounter.style.display = "none";
dealer.style.display = "none";
dWCounter.style.display = "none";
hitButton.style.display = "none";
standButton.style.display = "none";

// Closes popup after win/loss
spanEl.onclick = function() {
    modalEl.style.display = "none";
}

