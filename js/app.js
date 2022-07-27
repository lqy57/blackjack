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
let hitButton = document.querySelector('#hit');
let standButton = document.querySelector('#stand');
let showDealerHand = false;
hitButton.disabled = true;
standButton.disabled = true;

/*----- cached element references -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');
const pWCounter = document.getElementById('pWins');
const dWCounter = document.getElementById('dWins');
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

/*----- functions -----*/
function renderDealedHands() {
    hitButton.disabled = false;
    standButton.disabled = false;
    showDealerHand = false;
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
    if(dValue >= 17 && dValue < 21) {
        compareHands('D');
    }
    // while(dValue <= 8) {
    //     hitDealerHand();
    // } if(dValue >= 17) {
    //     compareHands('D');
    // }
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
                console.log("Blackjack! Player Wins!");
                modalTextEl.innerText = "Blackjack! Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(dDiff == 0) {
                console.log("Blackjack! Dealer Wins!");
                modalTextEl.innerText = "Blackjack! Dealer Wins!"
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'B':
            if(pDiff < 0) {
                console.log("Player Busts! Dealer Wins!");
                modalTextEl.innerText = "Player Busts! Dealer Wins!";
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(pDiff == 0) {
                console.log("Blackjack! Player Wins!")
                modalTextEl.innerText = "Blackjack! Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'C': 
            if(dDiff < 0) {
                console.log("Dealer Busts! Player Wins!")
                modalTextEl.innerText = "Dealer Busts! Player Wins!"
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(dDiff == 0) {
                console.log("Blackjack! Dealer Wins!")
                modalTextEl.innerText = "Blackjack! Dealer Wins!";
                modalEl.style.display = "block";
                dWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            }
            break;
        case 'D':
            if(pDiff == dDiff) {
                console.log("It's a tie!");
                modalTextEl.innerText = "It's a tie!";
                modalEl.style.display = "block";
                hitButton.disabled = true;
                standButton.disabled = true;
            } else if(pDiff < dDiff) {
                console.log("Player Wins!");
                modalTextEl.innerText = "Player Wins!";
                modalEl.style.display = "block";
                pWins++;
                hitButton.disabled = true;
                standButton.disabled = true;
            } else {
                console.log("Dealer Wins!");
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

spanEl.onclick = function() {
    modalEl.style.display = "none";
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
  // Let's build the cards as a string of HTML
  let cardsHtml = '';
  deck.forEach(function(card) {
    cardsHtml += `<div class="card ${card.face}"></div>`;
  });
  // Or, use reduce to 'reduce' the array into a single thing - in this case a string of HTML markup 
  // const cardsHtml = deck.reduce(function(html, card) {
  //   return html + `<div class="card ${card.face}"></div>`;
  // }, '');
  container.innerHTML = cardsHtml;
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

renderNewShuffledDeck();