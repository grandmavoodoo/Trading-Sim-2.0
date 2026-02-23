function vegasRender(container, cash, updateCash) {
  // Global jackpot settings
  const JACKPOT_START = 50000;
  let jackpot = JACKPOT_START;
  try {
    const savedJackpot = localStorage.getItem('vegasJackpot');
    if (savedJackpot !== null) {
      const parsed = parseFloat(savedJackpot);
      if (!isNaN(parsed)) {
        jackpot = parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage not accessible, jackpot persistence disabled.');
  }

  const JACKPOT_CONTRIBUTION = 0.1;

  function saveJackpot() {
    try {
      localStorage.setItem('vegasJackpot', jackpot.toString());
    } catch (e) {
      console.warn('Failed to save jackpot to localStorage.');
    }
  }

  function resetJackpot() {
    jackpot = JACKPOT_START;
    saveJackpot();
  }

  const games = [
    { id: 'slots', name: '🎰 Slot Machine', render: renderSlotsGame },
    { id: 'roulette', name: '🔴 Roulette', render: renderRouletteGame },
    { id: 'blackjack', name: '🃏 Blackjack', render: renderBlackjackGame },
  ];

  function showGameMenu() {
    let html = `
      <div class="casino-header">
        <h1>🏆 VEGAS CASINO 🏆</h1>
        <div class="cash-display">💰 Cash: $<span id="vegas-cash">${cash.toFixed(2)}</span></div>
      </div>
      <div class="game-menu">
        <h2>Select a Game</h2>
        <div class="games-grid">`;
    
    games.forEach(game => {
      html += `
        <button class="game-card" data-game-id="${game.id}">
          <div class="game-icon">${game.name.split(' ')[0]}</div>
          <div class="game-name">${game.name.substring(2)}</div>
        </button>`;
    });
    
    html += `
        </div>
      </div>
      
      <style>
        .casino-header {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          border-radius: 15px;
          margin-bottom: 20px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        
        .casino-header h1 {
          color: gold;
          font-size: 2.5rem;
          margin: 0;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }
        
        .cash-display {
          font-size: 1.5rem;
          color: white;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .game-menu h2 {
          text-align: center;
          color: #fff;
          font-size: 2rem;
          margin-bottom: 30px;
        }
        
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .game-card {
          background: linear-gradient(135deg, #2c3e50, #4a6491);
          border: none;
          border-radius: 15px;
          padding: 25px 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
        }
        
        .game-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.4);
          background: linear-gradient(135deg, #3498db, #8e44ad);
        }
        
        .game-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }
        
        .game-name {
          font-size: 1.4rem;
          font-weight: bold;
        }
      </style>
    `;
    
    container.innerHTML = html;

    container.querySelectorAll('.game-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const gameId = btn.getAttribute('data-game-id');
        const game = games.find(g => g.id === gameId);
        if (game) {
          game.render();
        }
      });
    });
  }

  function updateCashDisplay() {
    const cashSpan = container.querySelector('#vegas-cash');
    if (cashSpan) {
      cashSpan.textContent = cash.toFixed(2);
    }
  }



  // Add this inside vegasRender, alongside other games in the games array:
games.push({ id: 'poker', name: '🃏 Poker', render: renderPokerGame });

// Add this function inside vegasRender, alongside renderBlackjackGame, renderSlotsGame, etc.
function renderPokerGame() {
  container.innerHTML = `
    <style>
      #poker-game {
        max-width: 900px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        color: white;
        background: #006400;
        padding: 10px;
        border-radius: 10px;
      }
      #community-cards {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin: 20px 0;
      }
      .player-area {
        border: 1px solid #444;
        padding: 10px;
        margin: 10px 0;
        background: #013220;
        border-radius: 8px;
      }
      .player-name {
        font-weight: bold;
        margin-bottom: 5px;
      }
      .cards {
        display: flex;
        gap: 5px;
        margin-bottom: 5px;
        perspective: 600px;
        position: relative;
        height: 70px;
      }
      .card {
        width: 50px;
        height: 70px;
        border-radius: 5px;
        font-weight: bold;
        font-size: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        backface-visibility: hidden;
        transition: transform 0.6s;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0 0 5px #000;
      }
      .card.front {
        background: white;
        color: black;
        z-index: 2;
      }
      .card.back {
        background: #004400;
        color: transparent;
        border: 1px solid #002200;
        transform: rotateY(180deg);
        z-index: 1;
      }
      .card.flipped {
        transform: rotateY(180deg);
      }
      #betting-controls {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;
      }
      button {
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
      }
      button:disabled {
        background: #555;
        cursor: not-allowed;
      }
      #log {
        background: #002200;
        padding: 10px;
        height: 150px;
        overflow-y: auto;
        border-radius: 8px;
        margin-top: 20px;
        font-size: 14px;
      }
      #cash-display {
        font-weight: bold;
        font-size: 18px;
        text-align: center;
        margin: 10px 0;
      }
      #pot-display {
        font-weight: bold;
        font-size: 18px;
        margin-top: 10px;
        text-align: center;
      }
      #winner-display {
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: gold;
        padding: 20px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        z-index: 100;
        display: none;
        text-align: center;
        box-shadow: 0 0 20px gold;
      }
      #custom-bet-input {
        width: 120px;
        padding: 5px;
        border-radius: 5px;
        border: none;
        font-size: 16px;
        text-align: center;
      }
      #entry-fee {
        text-align: center;
        margin: 10px 0;
        font-size: 16px;
        color: #FFD700;
      }
    </style>
    <div id="poker-game">
      <h1>Poker Game: You vs 4 Bots</h1>
      <div id="cash-display">Balance: $<span id="player-cash-display">0</span></div>
      <div id="entry-fee">Entry Fee: $150</div>
      <button id="btn-start-game">Start Game ($150)</button>
      <div id="community-cards"></div>
      <div id="players"></div>
      <div id="pot-display">Pot: $0</div>
      <div id="betting-controls" style="display:none;">
        <input type="number" id="custom-bet-input" min="1" placeholder="Enter bet amount" step="0.01" />
        <button id="btn-check">Check</button>
        <button id="btn-bet">Bet/Raise</button>
        <button id="btn-fold">Fold</button>
      </div>
      <div id="log"></div>
      <button id="btn-back" style="margin-top:10px;">Back to Casino</button>
      <div id="winner-display"></div>
    </div>
  `;

  let playerCash = cash; 

  function updateDisplays() {
    playerCashDisplay.textContent = playerCash.toFixed(2);
    potDisplay.textContent = `Pot: $${pot.toFixed(2)}`;
  }

  function showWinner(winnerName, winnings) {
    winnerDisplay.textContent = `${winnerName} wins $${winnings.toFixed(2)}!`;
    winnerDisplay.style.display = 'block';
    setTimeout(() => {
      winnerDisplay.style.display = 'none';
    }, 5000);
  }

  class Card {
    constructor(suit, rank) {
      this.suit = suit;
      this.rank = rank;
    }
    toString() {
      const rankNames = {11: 'J', 12: 'Q', 13: 'K', 14: 'A'};
      const suitSymbols = { 'hearts': '♥', 'diamonds': '♦', 'clubs': '♣', 'spades': '♠' };
      const rankStr = rankNames[this.rank] || this.rank;
      return rankStr + suitSymbols[this.suit];
    }
  }

  class Deck {
    constructor() {
      this.cards = [];
      const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
      for (let suit of suits) {
        for (let rank = 2; rank <= 14; rank++) {
          this.cards.push(new Card(suit, rank));
        }
      }
    }
    shuffle() {
      for (let i = this.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
    }
    deal() {
      return this.cards.pop();
    }
  }

  class Player {
    constructor(name, balance, isBot = false) {
      this.name = name;
      this.isBot = isBot;
      this.hand = [];
      this.folded = false;
      this.balance = balance;
      this.currentBet = 0;
      this.totalBet = 0; 
    }
    resetForRound() {
      this.hand = [];
      this.folded = false;
      this.currentBet = 0;
      this.totalBet = 0;
    }
    
    placeBet(amount) {
      const actualBet = Math.min(amount, this.balance);
      this.balance -= actualBet;
      this.currentBet += actualBet;
      this.totalBet += actualBet;
      return actualBet;
    }
    
    collectWinnings(amount) {
      this.balance += amount;
    }
  }

  const communityCardsElement = container.querySelector('#community-cards');
  const playersElement = container.querySelector('#players');
  const logElement = container.querySelector('#log');
  const btnCheck = container.querySelector('#btn-check');
  const btnBet = container.querySelector('#btn-bet');
  const btnFold = container.querySelector('#btn-fold');
  const btnBack = container.querySelector('#btn-back');
  const btnStartGame = container.querySelector('#btn-start-game');
  const bettingControls = container.querySelector('#betting-controls');
  const customBetInput = container.querySelector('#custom-bet-input');
  const playerCashDisplay = container.querySelector('#player-cash-display');
  const potDisplay = container.querySelector('#pot-display');
  const winnerDisplay = container.querySelector('#winner-display');

  let deck, players, communityCards, pot, currentBet, currentPlayerIndex, bettingRound;

  function log(message) {
    logElement.innerHTML += message + '<br>';
    logElement.scrollTop = logElement.scrollHeight;
  }

  function startNewRound() {
    // Check if player has enough money to pay the entry fee
    if (playerCash < 150) {
      alert("You don't have enough money to start a game! You need $150.");
      return;
    }
    
    // Deduct entry fee
    playerCash -= 150;
    updateCash(playerCash);
    
    log('<b>Starting new round (Entry fee: $150 deducted)</b>');
    deck = new Deck();
    deck.shuffle();
    communityCards = [];
    pot = 0;
    currentBet = 0;
    bettingRound = 0;
    currentPlayerIndex = 0;
    
    players = [
      new Player('You', playerCash),
      new Player('Bot 1', playerCash, true),
      new Player('Bot 2', playerCash, true),
      new Player('Bot 3', playerCash, true),
      new Player('Bot 4', playerCash, true),
    ];
    
    players.forEach(p => p.resetForRound());
    dealHoleCards();
    updateUI();
    log('Dealt hole cards to all players.');
    bettingControls.style.display = 'flex';
    btnStartGame.style.display = 'none';
    updateDisplays();
    if (players[currentPlayerIndex].isBot) {
      setTimeout(botTurn, 1000);
    }
  }

  function dealHoleCards() {
    for (let i = 0; i < 2; i++) {
      for (let player of players) {
        player.hand.push(deck.deal());
      }
    }
  }

  function createCardElement(card, faceUp = true, index = 0) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    cardContainer.style.position = 'relative';
    cardContainer.style.width = '50px';
    cardContainer.style.height = '70px';
    cardContainer.style.perspective = '600px';
    cardContainer.style.left = `${index * 30}px`;

    const front = document.createElement('div');
    front.className = 'card front';
    front.textContent = card.toString();

    const back = document.createElement('div');
    back.className = 'card back';
    back.textContent = '🂠';

    cardContainer.appendChild(front);
    cardContainer.appendChild(back);

    if (!faceUp) {
      front.style.transform = 'rotateY(180deg)';
      back.style.transform = 'rotateY(0deg)';
    }

    return { container: cardContainer, front, back };
  }

  function flipCard(cardElements) {
    cardElements.front.style.transform = 'rotateY(180deg)';
    cardElements.back.style.transform = 'rotateY(0deg)';
  }

  function updateUI(showdownReveal = false, winningPlayer = null) {
    communityCardsElement.innerHTML = '';
    communityCards.forEach((card, idx) => {
      const cardElements = createCardElement(card, true, idx);
      communityCardsElement.appendChild(cardElements.container);
    });

    playersElement.innerHTML = '';
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      const playerDiv = document.createElement('div');
      playerDiv.className = 'player-area';
      if (player.folded) playerDiv.style.opacity = '0.5';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'player-name';
      nameDiv.textContent = `${player.name} - Balance: $${player.balance.toFixed(2)} - Bet: $${player.currentBet.toFixed(2)}`;
      playerDiv.appendChild(nameDiv);

      const cardsDiv = document.createElement('div');
      cardsDiv.className = 'cards';
      cardsDiv.style.position = 'relative';
      cardsDiv.style.height = '70px';

      player.hand.forEach((card, idx) => {
        const isPlayer = !player.isBot;
        const showFaceUp = isPlayer || bettingRound > 3 || player.folded || (showdownReveal && player === winningPlayer);
        const cardElements = createCardElement(card, showFaceUp, idx);
        cardsDiv.appendChild(cardElements.container);
        if (showFaceUp && showdownReveal && player === winningPlayer) {
          setTimeout(() => flipCard(cardElements), 100 + idx * 300);
        }
      });

      playerDiv.appendChild(cardsDiv);
      playersElement.appendChild(playerDiv);
    }

    const currentPlayer = players[currentPlayerIndex];
    if (currentPlayer.isBot || currentPlayer.folded) {
      btnCheck.disabled = true;
      btnBet.disabled = true;
      btnFold.disabled = true;
      customBetInput.disabled = true;
    } else {
      btnCheck.disabled = false;
      btnBet.disabled = false;
      btnFold.disabled = false;
      customBetInput.disabled = false;
      customBetInput.min = (currentBet - currentPlayer.currentBet + 0.01).toFixed(2);
      customBetInput.value = (currentBet - currentPlayer.currentBet + 1).toFixed(2);
    }
    updateDisplays();
  }

  function playerAction(action) {
    const player = players[currentPlayerIndex];
    if (player.folded) return;

    if (action === 'fold') {
      player.folded = true;
      pot += player.currentBet;
      log(`${player.name} folds.`);
      
      const activePlayers = players.filter(p => !p.folded);
      if (activePlayers.length === 1) {
        const winner = activePlayers[0];
        log(`${winner.name} wins the pot of $${pot.toFixed(2)}!`);
        winner.collectWinnings(pot);
        
        if (winner.name === 'You') {
          playerCash = winner.balance;
          updateCash(playerCash);
          updateDisplays();
          showWinner(winner.name, pot);
        }
        
        updateUI(true, winner);
        
        setTimeout(() => {
          bettingControls.style.display = 'none';
          btnStartGame.style.display = 'inline-block';
        }, 3000);
        return;
      }
    } else if (action === 'check') {
      if (player.currentBet < currentBet) {
        log(`You must call or raise the current bet.`);
        return;
      }
      log(`${player.name} checks.`);
    } else if (action === 'bet') {
      let betAmount = parseFloat(customBetInput.value);
      if (isNaN(betAmount) || betAmount <= (currentBet - player.currentBet)) {
        log(`Bet must be greater than current bet ($${(currentBet - player.currentBet).toFixed(2)}).`);
        return;
      }
      if (betAmount > player.balance + player.currentBet) {
        log(`You don't have enough money to bet that amount.`);
        return;
      }
      
      const raiseAmount = betAmount - player.currentBet;
      player.placeBet(raiseAmount);
      pot += raiseAmount;
      currentBet = betAmount;
      log(`${player.name} bets $${betAmount.toFixed(2)}.`);
    }

    nextPlayer();
  }

  function nextPlayer() {
    do {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    } while (players[currentPlayerIndex].folded);

    if (currentPlayerIndex === 0) {
      advanceRound();
    } else {
      updateUI();
      if (players[currentPlayerIndex].isBot) {
        setTimeout(botTurn, 1000);
      }
    }
  }

  function advanceRound() {
    log('<b>Advancing round</b>');
    players.forEach(p => {
      pot += p.currentBet;
      p.currentBet = 0;
    });
    currentBet = 0;
    bettingRound++;
    
    if (bettingRound === 1) {
      communityCards.push(deck.deal(), deck.deal(), deck.deal());
      log('Flop dealt.');
    } else if (bettingRound === 2) {
      communityCards.push(deck.deal());
      log('Turn dealt.');
    } else if (bettingRound === 3) {
      communityCards.push(deck.deal());
      log('River dealt.');
    } else {
      showdown();
      return;
    }
    
    currentPlayerIndex = 0;
    while (players[currentPlayerIndex].folded) currentPlayerIndex++;
    updateUI();
    if (players[currentPlayerIndex].isBot) {
      setTimeout(botTurn, 1000);
    }
  }

  function botTurn() {
    const bot = players[currentPlayerIndex];
    if (bot.folded) { nextPlayer(); return; }

    const handStrength = evaluateHandStrength(bot.hand, communityCards);
    const bluffChance = Math.random();
    const callCost = Math.max(0, currentBet - bot.currentBet);
    const potIfCalled = pot + callCost;
    const potOdds = callCost > 0 ? callCost / potIfCalled : 0;

    if (handStrength >= 0.65 && bot.balance + bot.currentBet > currentBet) {
      let raiseSize = Math.max(10, Math.floor(pot * 0.25));
      let betAmount = currentBet + raiseSize;
      betAmount = Math.min(betAmount, bot.balance + bot.currentBet);
      const raiseAmount = betAmount - bot.currentBet;
      bot.placeBet(raiseAmount);
      pot += raiseAmount;
      currentBet = Math.max(currentBet, bot.currentBet);
      log(`${bot.name} raises to $${betAmount.toFixed(2)}.`);
      nextPlayer();
      return;
    }

    if (handStrength >= 0.35) {
      if (callCost === 0) {
        log(`${bot.name} checks.`);
        nextPlayer();
        return;
      }
      if (potOdds < 0.7 || handStrength > 0.5) {
        const callAmount = Math.min(callCost, bot.balance);
        bot.placeBet(callAmount);
        pot += callAmount;
        currentBet = Math.max(currentBet, bot.currentBet);
        log(`${bot.name} calls $${callAmount.toFixed(2)}.`);
        nextPlayer();
        return;
      } else {
        bot.folded = true;
        pot += bot.currentBet;
        log(`${bot.name} folds.`);
        nextPlayer();
        return;
      }
    }

    if (callCost === 0) {
      if (bluffChance < 0.15 && bot.balance >= 10) {
        let betAmount = Math.min(currentBet + 10, bot.balance + bot.currentBet);
        const raiseAmount = betAmount - bot.currentBet;
        bot.placeBet(raiseAmount);
        pot += raiseAmount;
        currentBet = Math.max(currentBet, bot.currentBet);
        log(`${bot.name} bets $${betAmount.toFixed(2)}.`);
        nextPlayer();
        return;
      } else {
        log(`${bot.name} checks.`);
        nextPlayer();
        return;
      }
    } else {
      if (callCost <= Math.max(1, Math.floor(pot * 0.1))) {
        const callAmount = Math.min(callCost, bot.balance);
        bot.placeBet(callAmount);
        pot += callAmount;
        currentBet = Math.max(currentBet, bot.currentBet);
        log(`${bot.name} calls $${callAmount.toFixed(2)}.`);
        nextPlayer();
        return;
      }

      if (bluffChance < 0.08) {
        const callAmount = Math.min(callCost, bot.balance);
        bot.placeBet(callAmount);
        pot += callAmount;
        currentBet = Math.max(currentBet, bot.currentBet);
        log(`${bot.name} calls $${callAmount.toFixed(2)}.`);
        nextPlayer();
        return;
      }

      bot.folded = true;
      pot += bot.currentBet;
      log(`${bot.name} folds.`);
      nextPlayer();
      return;
    }
  }

  function evaluateHandStrength(hand, communityCards) {
    const all = hand.concat(communityCards);
    if (all.length === 0) return 0;

    const rankCounts = {};
    const suitCounts = {};
    for (let c of all) {
      rankCounts[c.rank] = (rankCounts[c.rank] || 0) + 1;
      suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
    }

    const counts = Object.values(rankCounts).sort((a,b)=>b-a);
    const maxCount = counts.length ? counts[0] : 0;
    const pairs = counts.filter(v=>v===2).length;

    const uniqueRanks = Object.keys(rankCounts).map(r=>parseInt(r)).sort((a,b)=>a-b);
    let straight = false;
    if (uniqueRanks.length >= 5) {
      for (let i = 0; i <= uniqueRanks.length - 5; i++) {
        let ok = true;
        for (let j = 1; j < 5; j++) {
          if (uniqueRanks[i+j] !== uniqueRanks[i] + j) { ok = false; break; }
        }
        if (ok) { straight = true; break; }
      }
      if (!straight && uniqueRanks.includes(14)) {
        const wheel = [2,3,4,5];
        if (wheel.every(r=>uniqueRanks.includes(r))) straight = true;
      }
    }

    const flush = Object.values(suitCounts).some(v=>v >= 5);

    let score = 0;
    if (maxCount >= 4) score = 0.95;
    else if (maxCount === 3 && pairs >= 1) score = 0.88;
    else if (flush) score = 0.80;
    else if (straight) score = 0.75;
    else if (maxCount === 3) score = 0.60;
    else if (pairs >= 2) score = 0.50;
    else if (pairs === 1) score = 0.35;
    else {
      const maxRank = Math.max(...uniqueRanks);
      score = (maxRank / 14) * 0.3;
    }

    const revealed = communityCards.length;
    score = Math.min(1, score + revealed * 0.03);

    return score;
  }

  function showdown() {
    log('<b>Showdown!</b>');
    
    players.forEach(p => {
      pot += p.currentBet;
      p.currentBet = 0;
    });
    
    const activePlayers = players.filter(p => !p.folded);
    let winner, winnings;
    
    if (activePlayers.length === 1) {
      winner = activePlayers[0];
      winnings = pot;
      log(`${winner.name} wins the pot of $${pot.toFixed(2)}!`);
      winner.collectWinnings(pot);
      
      if (winner.name === 'You') {
        playerCash = winner.balance;
        updateCash(playerCash);
        updateDisplays();
      }
    } else {
      let bestPlayer = activePlayers[0];
      let bestStrength = evaluateHandStrength(bestPlayer.hand, communityCards);
      
      for (let i = 1; i < activePlayers.length; i++) {
        const strength = evaluateHandStrength(activePlayers[i].hand, communityCards);
        if (strength > bestStrength) {
          bestPlayer = activePlayers[i];
          bestStrength = strength;
        }
      }
      
      winner = bestPlayer;
      winnings = pot;
      log(`${winner.name} wins the pot of $${pot.toFixed(2)}!`);
      winner.collectWinnings(pot);
      
      if (winner.name === 'You') {
        playerCash = winner.balance;
        updateCash(playerCash);
        updateDisplays();
      }
    }
    
    showWinner(winner.name, winnings);
    updateUI(true, winner);
    
    pot = 0;
    bettingRound = 0;
    
    if (winner.name === 'You') {
      for (let i = 1; i < players.length; i++) {
        players[i].balance = playerCash;
      }
    } else {
      playerCash = players[0].balance;
      updateCash(playerCash);
    }
    
    setTimeout(() => {
      bettingControls.style.display = 'none';
      btnStartGame.style.display = 'inline-block';
    }, 3000);
  }

  btnCheck.onclick = () => playerAction('check');
  btnBet.onclick = () => playerAction('bet');
  btnFold.onclick = () => playerAction('fold');
  btnBack.onclick = () => showGameMenu();
  btnStartGame.onclick = () => startNewRound();

  updateDisplays();
}
  // Blackjack game implementation
  function renderBlackjackGame() {
    container.innerHTML = `
      <style>
        .blackjack-container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: white;
          background: linear-gradient(135deg, #0a3d1f, #1a5d38);
          padding: 25px;
          border-radius: 15px;
          max-width: 800px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        
        .game-title {
          font-size: 2rem;
          margin: 0;
          color: gold;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }
        
        .cash-info {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .hand-container {
          margin: 20px 0;
        }
        
        .hand-title {
          font-size: 1.4rem;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        }
        
        .hand {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          padding: 15px;
          min-height: 120px;
        }
        
        .cards {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .card {
          width: 80px;
          height: 110px;
          background: white;
          color: black;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          position: relative;
          transition: transform 0.3s;
        }
        
        .card.red {
          color: #d32f2f;
        }
        
        .card-back {
          background: linear-gradient(135deg, #b71c1c, #4a0000);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }
        
        .card-value {
          font-size: 1.5rem;
        }
        
        .card-suit {
          font-size: 2rem;
          align-self: center;
        }
        
        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-top: 25px;
          justify-content: center;
        }
        
        .btn {
          padding: 12px 25px;
          font-size: 1.1rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background: linear-gradient(to bottom, #4CAF50, #2E7D32);
          color: white;
        }
        
        .btn-secondary {
          background: linear-gradient(to bottom, #2196F3, #0D47A1);
          color: white;
        }
        
        .btn-warning {
          background: linear-gradient(to bottom, #FF9800, #E65100);
          color: white;
        }
        
        .btn-danger {
          background: linear-gradient(to bottom, #F44336, #B71C1C);
          color: white;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        
        .bet-controls {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 20px 0;
          justify-content: center;
          background: rgba(0,0,0,0.2);
          padding: 15px;
          border-radius: 10px;
        }
        
        .bet-input {
          padding: 10px;
          border-radius: 5px;
          border: none;
          width: 100px;
          text-align: center;
          font-size: 1.1rem;
          font-weight: bold;
        }
        
        #blackjack-result {
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
          min-height: 40px;
          margin: 20px 0;
          padding: 15px;
          border-radius: 10px;
          background: rgba(0,0,0,0.3);
        }
        
        .win {
          color: #4CAF50;
          text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
        }
        
        .lose {
          color: #F44336;
          text-shadow: 0 0 10px rgba(244, 67, 54, 0.5);
        }
        
        .push {
          color: #FFC107;
          text-shadow: 0 0 10px rgba(255, 193, 7, 0.5);
        }
      </style>
      
      <div class="blackjack-container">
        <div class="game-header">
          <h2 class="game-title">🃏 BLACKJACK</h2>
          <div class="cash-info">💰 Cash: $<span id="blackjack-cash">${cash.toFixed(2)}</span></div>
        </div>
        
        <div class="bet-controls">
          <label for="blackjack-bet">Bet Amount: $</label>
          <input type="number" id="blackjack-bet" class="bet-input" min="1" step="1" value="10" />
          <button id="blackjack-deal" class="btn btn-primary"> DEAL CARDS </button>
        </div>
        
        <div class="hand-container">
          <div class="hand-title">
            <span>Dealer Hand (<span id="dealer-score">0</span>)</span>
          </div>
          <div class="hand">
            <div class="cards" id="dealer-cards"></div>
          </div>
        </div>
        
        <div class="hand-container">
          <div class="hand-title">
            <span>Your Hand (<span id="player-score">0</span>)</span>
          </div>
          <div class="hand">
            <div class="cards" id="player-cards"></div>
          </div>
        </div>
        
        <div id="blackjack-result"></div>
        
        <div class="controls">
          <button id="blackjack-hit" class="btn btn-primary" disabled>HIT</button>
          <button id="blackjack-stand" class="btn btn-warning" disabled>STAND</button>
          <button id="blackjack-back" class="btn btn-danger">BACK TO CASINO</button>
        </div>
      </div>
    `;

    const dealerCardsDiv = container.querySelector('#dealer-cards');
    const playerCardsDiv = container.querySelector('#player-cards');
    const dealerScoreSpan = container.querySelector('#dealer-score');
    const playerScoreSpan = container.querySelector('#player-score');
    const resultDiv = container.querySelector('#blackjack-result');
    const cashSpan = container.querySelector('#blackjack-cash');
    const betInput = container.querySelector('#blackjack-bet');
    const hitBtn = container.querySelector('#blackjack-hit');
    const standBtn = container.querySelector('#blackjack-stand');
    const dealBtn = container.querySelector('#blackjack-deal');
    const backBtn = container.querySelector('#blackjack-back');

    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let inRound = false;
    let bet = 0;

    function createDeck() {
      const suits = ['♠', '♥', '♦', '♣'];
      const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
      const newDeck = [];
      for (const suit of suits) {
        for (const rank of ranks) {
          newDeck.push({ rank, suit });
        }
      }
      return newDeck;
    }

    function shuffleDeck(deck) {
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }

    function cardValue(card) {
      if (card.rank === 'A') return 11;
      if (['K', 'Q', 'J'].includes(card.rank)) return 10;
      return parseInt(card.rank, 10);
    }

    function calculateScore(hand) {
      let score = 0;
      let aces = 0;
      for (const card of hand) {
        score += cardValue(card);
        if (card.rank === 'A') aces++;
      }
      while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
      }
      return score;
    }

    function renderCard(card, isHidden = false) {
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('card');
      
      if (isHidden) {
        cardDiv.classList.add('card-back');
        cardDiv.textContent = '🂠';
        return cardDiv;
      }
      
      if (card.suit === '♥' || card.suit === '♦') {
        cardDiv.classList.add('red');
      }
      
      cardDiv.innerHTML = `
        <div class="card-value">${card.rank}</div>
        <div class="card-suit">${card.suit}</div>
        <div class="card-value" style="transform: rotate(180deg); align-self: flex-end;">${card.rank}</div>
      `;
      
      return cardDiv;
    }

    function renderHand(cardsDiv, hand, hideFirstCard = false) {
      cardsDiv.innerHTML = '';
      hand.forEach((card, index) => {
        const isHidden = hideFirstCard && index === 0;
        cardsDiv.appendChild(renderCard(card, isHidden));
      });
    }

    function updateScores() {
      const playerScore = calculateScore(playerHand);
      const dealerScore = inRound ? '?' : calculateScore(dealerHand);
      playerScoreSpan.textContent = playerScore;
      dealerScoreSpan.textContent = dealerScore;
    }

    function showMessage(message, type = '') {
      resultDiv.textContent = message;
      resultDiv.className = '';
      if (type) {
        resultDiv.classList.add(type);
      }
    }

    function endRound(message, won, type) {
      inRound = false;
      showMessage(message, type);
      hitBtn.disabled = true;
      standBtn.disabled = true;
      dealBtn.disabled = false;

      if (won === true) {
        cash += bet;
      } else if (won === false) {
        cash -= bet;
      }
      
      cashSpan.textContent = cash.toFixed(2);
      updateCash(cash);
      updateScores();
      renderHand(dealerCardsDiv, dealerHand, false);
    }

    function dealerPlay() {
      let dealerScore = calculateScore(dealerHand);
      while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
      }
    }

    hitBtn.addEventListener('click', () => {
      if (!inRound) return;
      playerHand.push(deck.pop());
      renderHand(playerCardsDiv, playerHand);
      updateScores();
      const playerScore = calculateScore(playerHand);
      
      if (playerScore === 21) {
        standBtn.click();
      } else if (playerScore > 21) {
        endRound('BUST! You went over 21. Dealer wins.', false, 'lose');
      }
    });

    standBtn.addEventListener('click', () => {
      if (!inRound) return;
      dealerPlay();
      renderHand(dealerCardsDiv, dealerHand, false);
      updateScores();

      const playerScore = calculateScore(playerHand);
      const dealerScore = calculateScore(dealerHand);

      if (dealerScore > 21) {
        endRound('DEALER BUSTS! You win!', true, 'win');
      } else if (dealerScore > playerScore) {
        endRound(`Dealer wins with ${dealerScore} vs your ${playerScore}`, false, 'lose');
      } else if (dealerScore < playerScore) {
        endRound(`You win with ${playerScore} vs dealer's ${dealerScore}!`, true, 'win');
      } else {
        endRound(`PUSH! Both have ${playerScore}. It's a tie.`, null, 'push');
      }
    });

    dealBtn.addEventListener('click', () => {
      if (inRound) return;
      bet = parseFloat(betInput.value);
      if (isNaN(bet) || bet <= 0) {
        showMessage('Please enter a valid bet amount', 'lose');
        return;
      }
      if (bet > cash) {
        showMessage('Not enough cash to place that bet!', 'lose');
        return;
      }

      deck = createDeck();
      shuffleDeck(deck);
      playerHand = [deck.pop(), deck.pop()];
      dealerHand = [deck.pop(), deck.pop()];
      inRound = true;
      showMessage('Game in progress...');
      hitBtn.disabled = false;
      standBtn.disabled = false;
      dealBtn.disabled = true;

      renderHand(playerCardsDiv, playerHand);
      renderHand(dealerCardsDiv, dealerHand, true);
      updateScores();
    });

    backBtn.addEventListener('click', () => {
      showGameMenu();
    });
  }

  function renderSlotsGame() {
    container.innerHTML = `
      <style>
        .retro-slot {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          user-select: none;
          text-align: center;
        }
        
        .slot-header {
          background: linear-gradient(180deg,#ffdd66,#ffb400);
          border-top-left-radius: 14px;
          border-top-right-radius: 14px;
          border: 4px solid #4d2f00;
          padding: 15px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.35), inset 0 -6px 12px rgba(0,0,0,0.08);
          margin-bottom: 0;
        }
        
        .slot-header h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: 1px;
          color: #3a1600;
          text-shadow: 0 1px 0 rgba(255,255,255,0.6);
        }
        
        .bulb-row {
          position: absolute;
          bottom: -10px;
          left: 15px;
          right: 15px;
          display:flex;
          justify-content:space-between;
        }
        
        .bulb {
          width: 12px;
          height: 12px;
          background: #fff6d6;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255,200,0,0.9);
          border: 1px solid rgba(0,0,0,0.2);
        }
        
        .cabinet {
          background: linear-gradient(180deg, #ff8f1a, #bf5310);
          padding: 20px;
          border: 4px solid #4d2f00;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          box-shadow: 0 14px 24px rgba(0,0,0,0.45);
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          background: rgba(0,0,0,0.2);
          padding: 12px;
          border-radius: 10px;
        }
        
        .cash-display {
          font-size: 18px;
          color: #fff8e6;
          font-weight: 700;
        }
        
        .bet-control {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          color: #fff8e6;
        }
        
        .bet-input {
          width: 80px;
          font-weight: 700;
          border-radius: 4px;
          padding: 6px;
          text-align: center;
        }
        
        .reel-window {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin: 20px 0;
        }
        
        .reel-frame {
          background: linear-gradient(180deg,#ffe, #fff);
          width: 100px;
          height: 130px;
          border-radius: 12px;
          border: 4px solid #6b4a25;
          box-shadow: inset 0 6px 14px rgba(0,0,0,0.12), 0 6px 10px rgba(0,0,0,0.25);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 56px;
          transition: transform 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        
        .reel-frame .highlight {
          position: absolute;
          top: 40%;
          left: 0;
          right: 0;
          height: 36px;
          pointer-events:none;
          background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02));
          mix-blend-mode: overlay;
        }
        
        .controls-row {
          display: flex;
          justify-content: center;
          gap: 20px;
          align-items: center;
          margin-top: 25px;
          flex-wrap: wrap;
        }
        
        .btn-large {
          padding: 14px 30px;
          font-size: 18px;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
          border: none;
          transition: all 0.2s;
        }
        
        .btn-large:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }
        
        .spin-button {
          background: linear-gradient(180deg,#ff2,#f90);
          color: #3a1600;
        }
        
        .back-button {
          background: linear-gradient(180deg,#444,#222);
          color: white;
        }
        
        .lever-outer {
          position: absolute;
          right: -70px;
          top: 70px;
          width: 60px;
          height: 240px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          pointer-events: none;
        }
        
        .lever-rod {
          position: relative;
          width: 10px;
          height: 180px;
          background: linear-gradient(180deg,#333,#111);
          border-radius: 8px;
          transform-origin: top center;
          transform: rotate(0deg);
          transition: transform 350ms cubic-bezier(.2,.9,.2,1);
          box-shadow: 0 6px 14px rgba(0,0,0,0.45);
          pointer-events: auto;
        }
        
        .lever-knob {
          position: absolute;
          bottom: -18px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: radial-gradient(circle at 30% 30%, #ff9a3a, #e63d00);
          border-radius: 50%;
          border: 4px solid #2a1100;
          box-shadow: 0 8px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          transition: box-shadow 160ms;
          pointer-events: auto;
        }
        
        .lever-knob:active { 
          box-shadow: 0 4px 8px rgba(0,0,0,0.35); 
        }
        
        .jackpot-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          color: #fff;
          font-weight: 700;
          text-shadow: 0 1px 0 rgba(0,0,0,0.35);
          background: rgba(0,0,0,0.2);
          padding: 12px;
          border-radius: 10px;
        }
        
        .jackpot-label { 
          font-size: 18px; 
        }
        
        .jackpot-value { 
          font-size: 20px; 
          color: gold; 
          background: rgba(0,0,0,0.3); 
          padding: 6px 12px; 
          border-radius: 8px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.7);
        }
        
        .payouts {
          margin-top: 25px; 
          color: #fff8e6; 
          font-size: 14px; 
          opacity: 0.95;
          background: rgba(0,0,0,0.2);
          padding: 15px;
          border-radius: 10px;
        }
        
        .payouts h3 {
          margin-top: 0;
          color: gold;
        }
        
        .result-area { 
          height: 40px; 
          margin-top: 15px; 
          font-weight: 700; 
          color: #fff; 
          text-shadow: 0 1px 0 rgba(0,0,0,0.35);
          font-size: 18px;
        }
        
        .reel-frame.spin-end {
          transform: translateY(-8px);
        }
        
        @media (max-width: 600px) {
          .lever-outer {
            display: none;
          }
          
          .reel-frame {
            width: 80px;
            height: 100px;
            font-size: 40px;
          }
        }
      </style>

      <div class="retro-slot">
        <div class="slot-header">
          <h2>🎰 VEGAS CLASSIC SLOTS 🎰</h2>
          <div class="bulb-row">
            <div class="bulb"></div><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div><div class="bulb"></div>
          </div>
        </div>

        <div style="position: relative;">
          <div class="cabinet">
            <div class="info-row">
              <div class="cash-display">💰 Cash: $<span id="vegas-cash">${cash.toFixed(2)}</span></div>
              <div class="bet-control">
                💵 Bet: $<input id="bet-amount" type="number" min="1" step="1" value="10" class="bet-input">
              </div>
            </div>

            <div style="position: relative; margin-top: 15px;">
              <div class="reel-window" id="reel-window">
                <div id="reel1" class="reel-frame">❓<div class="highlight"></div></div>
                <div id="reel2" class="reel-frame">❓<div class="highlight"></div></div>
                <div id="reel3" class="reel-frame">❓<div class="highlight"></div></div>
              </div>

              <div class="lever-outer" title="Pull lever to spin">
                <div id="lever-rod" class="lever-rod">
                  <div id="lever-knob" class="lever-knob" tabindex="0" role="button" aria-label="Pull lever to spin"></div>
                </div>
              </div>
            </div>

            <div class="jackpot-row">
              <div class="jackpot-label">🏆 Progressive Jackpot</div>
              <div class="jackpot-value">$<span id="slot-jackpot">${jackpot.toFixed(2)}</span></div>
            </div>

            <div class="controls-row">
              <button id="spin-btn" class="btn-large spin-button">🎰 SPIN 🎰</button>
              <button id="back-btn" class="btn-large back-button">BACK</button>
            </div>

            <div class="result-area" id="slot-result"></div>

            <div class="payouts">
              <h3>Payouts</h3>
              <div>🍒🍒🍒 = 2x • 🔔🔔🔔 = 5x • 7️⃣7️⃣7️⃣ = 10x</div>
              <div>👑👑👑 = 20x • 🍀🍀🍀 = 50x • ⭐⭐⭐ = JACKPOT!</div>
              <div style="opacity:0.9; margin-top:10px;">Two matching symbols = 0.5x your bet</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const betInput = container.querySelector('#bet-amount');
    const spinBtn = container.querySelector('#spin-btn');
    const backBtn = container.querySelector('#back-btn');
    const resultDiv = container.querySelector('#slot-result');
    const cashSpan = container.querySelector('#vegas-cash');
    const reelElements = [
      container.querySelector('#reel1'),
      container.querySelector('#reel2'),
      container.querySelector('#reel3'),
    ];
    const leverRod = container.querySelector('#lever-rod');
    const leverKnob = container.querySelector('#lever-knob');

    let spinning = false;

    const symbols = [
      { char: '🍒', name: 'Cherry', rarity: 'common' },
      { char: '👽', name: 'Alien', rarity: 'common' },
      { char: '👾', name: 'Space', rarity: 'common' },
      { char: '🍋', name: 'Lemon', rarity: 'common' },
      { char: '🍊', name: 'Orange', rarity: 'common' },
      { char: '🍇', name: 'Grapes', rarity: 'common' },
      { char: '🔔', name: 'Bell', rarity: 'uncommon' },
      { char: '🤑', name: 'Money', rarity: 'uncommon' },
      { char: '🐵', name: 'Monkey', rarity: 'uncommon' },
      { char: '⭐', name: 'Star', rarity: 'legendary' },
      { char: '💎', name: 'Diamond', rarity: 'rare' },
      { char: '7️⃣', name: 'Seven', rarity: 'rare' },
      { char: '👑', name: 'Crown', rarity: 'legendary' },
      { char: '🍀', name: 'Clover', rarity: 'legendary' }
    ];

    function getRandomSymbol() {
      const rand = Math.random();
      if (rand < 0.4) return symbols[Math.floor(Math.random() * 4)];
      if (rand < 0.7) return symbols[4 + Math.floor(Math.random() * 2)];
      if (rand < 0.9) return symbols[6 + Math.floor(Math.random() * 2)];
      return symbols[8 + Math.floor(Math.random() * 2)];
    }

    function moveLever(pulled) {
      if (pulled) {
        leverRod.style.transform = 'rotate(-65deg)';
      } else {
        leverRod.style.transform = 'rotate(0deg)';
      }
    }

    function startSpinAnimation() {
      reelElements.forEach(el => el.classList.remove('spin-end'));
      moveLever(true);
    }
    
    function endSpinAnimation() {
      reelElements.forEach(el => {
        el.classList.add('spin-end');
        setTimeout(() => el.classList.remove('spin-end'), 500);
      });
      setTimeout(() => moveLever(false), 300);
    }

    leverKnob.addEventListener('click', () => {
      spinBtn.click();
    });
    
    leverKnob.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        spinBtn.click();
      }
    });

    spinBtn.addEventListener('click', () => {
      if (spinning) return;

      const bet = parseFloat(betInput.value);
      if (isNaN(bet) || bet <= 0) {
        alert('Enter a valid bet amount');
        return;
      }
      if (bet > cash) {
        alert('Not enough cash to bet that amount');
        return;
      }

      spinning = true;
      jackpot += bet * JACKPOT_CONTRIBUTION;
      saveJackpot();
      const jackpotSpan = container.querySelector('#slot-jackpot');
      if (jackpotSpan) jackpotSpan.textContent = jackpot.toFixed(2);

      spinBtn.disabled = true;
      resultDiv.textContent = '';
      startSpinAnimation();

      const spinDuration = 3000;
      const spinInterval = 80;
      const startTime = Date.now();

      function spinReels() {
        const elapsed = Date.now() - startTime;
        if (elapsed >= spinDuration) {
          const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
          reelElements.forEach((el, i) => {
            el.textContent = finalReels[i].char;
          });

          let payout = 0;
          const allMatch = finalReels[0].char === finalReels[1].char && finalReels[1].char === finalReels[2].char;
          const twoMatch = finalReels[0].char === finalReels[1].char || finalReels[1].char === finalReels[2].char || finalReels[0].char === finalReels[2].char;

          if (allMatch) {
            switch(finalReels[0].rarity) {
              case 'common': payout = bet * 2; break;
              case 'uncommon': payout = bet * 5; break;
              case 'rare': payout = bet * 10; break;
              case 'legendary': payout = bet * 50; break;
            }
            if (finalReels[0].char === '⭐') {
              const jackpotWon = jackpot;
              payout += jackpotWon;
              resultDiv.innerHTML = `🎉 JACKPOT! ${finalReels[0].name} x3 - You win ${(payout - jackpotWon)/bet}x plus the jackpot of $${jackpotWon.toFixed(2)}! 🎉`;
              jackpot = JACKPOT_START;
              saveJackpot();
              const jackpotSpan = container.querySelector('#slot-jackpot');
              if (jackpotSpan) jackpotSpan.textContent = jackpot.toFixed(2);
            } else {
              resultDiv.innerHTML = `🎉 ${finalReels[0].name} x3 - You win ${payout/bet}x your bet! 🎉`;
            }
          } else if (twoMatch) {
            payout = bet * 0.5;
            resultDiv.textContent = '✨ Nice! Two matching symbols - You win 0.5x your bet! ✨';
          } else {
            payout = 0;
            resultDiv.textContent = '😞 Sorry, you lost this round.';
          }

          const newCash = cash - bet + payout;
          cash = newCash;
          cashSpan.textContent = cash.toFixed(2);
          updateCash(newCash);
          updateCashDisplay();

          endSpinAnimation();
          spinning = false;
          spinBtn.disabled = false;
        } else {
          reelElements.forEach((el, i) => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            el.textContent = randomSymbol.char;
          });
          setTimeout(spinReels, spinInterval);
        }
      }

      spinReels();
    });

    backBtn.addEventListener('click', () => {
      showGameMenu();
    });
  }

 function renderRouletteGame() {
    const rouletteNumbers = [
      { n: '0', c: 'green' },
      { n: '28', c: 'black' },
      { n: '9', c: 'red' },
      { n: '26', c: 'black' },
      { n: '30', c: 'red' },
      { n: '11', c: 'black' },
      { n: '7', c: 'red' },
      { n: '20', c: 'black' },
      { n: '32', c: 'red' },
      { n: '17', c: 'black' },
      { n: '5', c: 'red' },
      { n: '22', c: 'black' },
      { n: '34', c: 'red' },
      { n: '15', c: 'black' },
      { n: '3', c: 'red' },
      { n: '24', c: 'black' },
      { n: '36', c: 'red' },
      { n: '13', c: 'black' },
      { n: '1', c: 'red' },
      { n: '00', c: 'green' },
      { n: '27', c: 'red' },
      { n: '10', c: 'black' },
      { n: '25', c: 'red' },
      { n: '29', c: 'black' },
      { n: '12', c: 'red' },
      { n: '8', c: 'black' },
      { n: '19', c: 'red' },
      { n: '31', c: 'black' },
      { n: '18', c: 'red' },
      { n: '6', c: 'black' },
      { n: '21', c: 'red' },
      { n: '33', c: 'black' },
      { n: '16', c: 'red' },
      { n: '4', c: 'black' },
      { n: '23', c: 'red' },
      { n: '35', c: 'black' },
      { n: '14', c: 'red' },
      { n: '2', c: 'black' }
    ];

    let history = [];

    container.innerHTML = `
      <style>
        .roulette-container { 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
          color: white; 
          background: linear-gradient(135deg, #0d331f, #1a5d38);
          padding: 25px; 
          border-radius: 15px;
          max-width: 900px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }
        
        .game-title {
          font-size: 2rem;
          margin: 0;
          color: gold;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }
        
        .cash-info {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .wheel-container {
          position: relative;
          width: 350px;
          height: 350px;
          margin: 20px auto;
        }
        
        .wheel-outer { 
          width: 100%; 
          height: 100%; 
          border-radius: 50%; 
          border: 12px solid #444; 
          position: relative; 
          background: #222; 
          overflow: hidden; 
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        
        .wheel-inner { 
          position: absolute; 
          top: 50%; 
          left: 50%; 
          transform: translate(-50%, -50%); 
          width: 280px; 
          height: 280px; 
          border-radius: 50%; 
          background: #0d331f; 
          border: 6px solid #888; 
          z-index: 2; 
        }
        
        .ball { 
          position: absolute; 
          width: 20px; 
          height: 20px; 
          background: white; 
          border-radius: 50%; 
          z-index: 3; 
          box-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
        
        .pointer {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 40px;
          background: gold;
          clip-path: polygon(50% 100%, 0 0, 100% 0);
          z-index: 10;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        }
        
        .segment {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 50%;
          transform-origin: bottom center;
          background: #888;
        }
        
        .segment-number {
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: bold;
          color: white;
          text-shadow: 1px 1px 1px black;
        }
        
        .betting-section {
          width: 100%;
          margin: 25px 0;
        }
        
        .betting-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .betting-title {
          font-size: 1.4rem;
          margin: 0;
        }
        
        .bet-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .bet-input {
          padding: 8px;
          border-radius: 5px;
          border: none;
          width: 80px;
          text-align: center;
          font-size: 1rem;
          font-weight: bold;
        }
        
        .betting-table { 
          display: grid; 
          grid-template-columns: repeat(14, 1fr); 
          gap: 3px; 
          background: #fff; 
          padding: 6px; 
          border-radius: 8px; 
          color: #000; 
        }
        
        .bet-cell { 
          padding: 12px 6px; 
          text-align: center; 
          border: 1px solid #ccc; 
          cursor: pointer; 
          font-weight: bold; 
          min-width: 30px; 
          transition: all 0.2s;
        }
        
        .bet-cell:hover { 
          background: #eee; 
          transform: scale(1.05);
        }
        
        .bet-cell.selected { 
          outline: 3px solid yellow; 
          background: #ffffcc; 
          position: relative;
          z-index: 1;
        }
        
        .red { background: #d00; color: white; }
        .black { background: #222; color: white; }
        .green { background: #0a0; color: white; }
        
        .controls { 
          margin: 25px 0; 
          display: flex; 
          gap: 15px; 
          align-items: center; 
          flex-wrap: wrap; 
          justify-content: center; 
        }
        
        .btn {
          padding: 12px 25px;
          font-size: 1.1rem;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background: linear-gradient(to bottom, #4CAF50, #2E7D32);
          color: white;
        }
        
        .btn-secondary {
          background: linear-gradient(to bottom, #2196F3, #0D47A1);
          color: white;
        }
        
        .btn-warning {
          background: linear-gradient(to bottom, #FF9800, #E65100);
          color: white;
        }
        
        .btn-danger {
          background: linear-gradient(to bottom, #F44336, #B71C1C);
          color: white;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        
        .special-bets-container { 
          margin: 15px 0; 
          display: flex; 
          gap: 12px; 
          flex-wrap: wrap; 
          justify-content: center; 
        }
        
        .special-bet { 
          min-width: 70px; 
          padding: 12px 8px; 
          border: 1px solid #ccc; 
          cursor: pointer; 
          font-weight: bold; 
          border-radius: 6px; 
          user-select: none; 
          transition: all 0.2s;
        }
        
        .special-bet:hover { 
          background: #eee; 
          color: #000; 
          transform: scale(1.05);
        }
        
        .special-bet.selected { 
          outline: 3px solid yellow; 
          background: #ffffcc; 
          color: #000; 
        }
        
        #roulette-history { 
          margin-top: 25px; 
          width: 100%; 
          background: rgba(0,0,0,0.3); 
          border-radius: 10px; 
          padding: 15px; 
          color: white; 
          font-size: 14px; 
        }
        
        #roulette-history h3 { 
          margin: 0 0 12px 0; 
          font-weight: bold; 
          color: gold;
        }
        
        .history-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .history-item { 
          display: inline-block; 
          width: 36px; 
          height: 36px; 
          line-height: 36px; 
          border-radius: 50%; 
          text-align: center; 
          font-weight: bold; 
          user-select: none; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .history-item.red { background: #d00; color: white; }
        .history-item.black { background: #222; color: white; }
        .history-item.green { background: #0a0; color: white; }
        
        #win-loss { 
          margin: 15px 0; 
          font-size: 1.4rem; 
          font-weight: bold; 
          min-height: 30px; 
          text-align: center;
          padding: 10px;
          border-radius: 8px;
          background: rgba(0,0,0,0.2);
        }
        
        #roulette-result {
          margin: 15px 0;
          font-size: 1.8rem;
          font-weight: bold;
          text-align: center;
          min-height: 40px;
        }
      </style>
      
      <div class="roulette-container">
        <div class="game-header">
          <h2 class="game-title">🔴 AMERICAN ROULETTE</h2>
          <div class="cash-info">💰 Cash: $<span id="roulette-cash">${cash.toFixed(2)}</span></div>
        </div>
        
        <div class="wheel-container">
          <div id="roulette-wheel" class="wheel-outer">
            <div class="wheel-inner"></div>
            <div id="roulette-ball" class="ball"></div>
            <div class="pointer"></div>
          </div>
        </div>
        
        <div id="roulette-result"></div>
        <div id="win-loss"></div>
        
        <div class="betting-section">
          <div class="betting-header">
            <h3 class="betting-title">Place Your Bets</h3>
            <div class="bet-controls">
              <label>Bet: $</label>
              <input type="number" id="roulette-bet-amount" class="bet-input" value="10" min="1">
            </div>
          </div>
          
          <div class="betting-table" id="betting-grid"></div>
          
          <div class="special-bets-container" id="special-bets">
            <div class="special-bet red" data-bet="red">Red</div>
            <div class="special-bet black" data-bet="black">Black</div>
            <div class="special-bet green" data-bet="green">Green</div>
            <div class="special-bet" data-bet="odd">Odd</div>
            <div class="special-bet" data-bet="even">Even</div>
          </div>
        </div>
        
        <div class="controls">
          <button id="roulette-spin-btn" class="btn btn-primary">🎰 SPIN WHEEL</button>
          <button id="roulette-back-btn" class="btn btn-danger">BACK TO CASINO</button>
        </div>
        
        <div id="roulette-history">
          <h3>🎲 Recent Spins</h3>
          <div class="history-list" id="history-list"></div>
        </div>
      </div>
    `;

    // Create wheel segments with numbers
    const wheel = container.querySelector('#roulette-wheel');
    const segmentAngle = 360 / rouletteNumbers.length;
    
    rouletteNumbers.forEach((num, i) => {
      const segment = document.createElement('div');
      segment.className = 'segment';
      segment.style.transform = `rotate(${i * segmentAngle}deg)`;
      
      const numberEl = document.createElement('div');
      numberEl.className = 'segment-number';
      numberEl.textContent = num.n;
      numberEl.style.color = num.c === 'red' ? '#f55' : num.c === 'green' ? '#5f5' : '#fff';
      
      segment.appendChild(numberEl);
      wheel.appendChild(segment);
    });

    const grid = container.querySelector('#betting-grid');
    const specialBets = container.querySelectorAll('.special-bet');
    const spinBtn = container.querySelector('#roulette-spin-btn');
    const backBtn = container.querySelector('#roulette-back-btn');
    const ball = container.querySelector('#roulette-ball');
    const resultDiv = container.querySelector('#roulette-result');
    const betInput = container.querySelector('#roulette-bet-amount');
    const winLossDiv = container.querySelector('#win-loss');
    const historyList = container.querySelector('#history-list');
    const cashSpan = container.querySelector('#roulette-cash');

    let selectedBets = new Set();

    let tableHtml = `<div style="grid-row: 1 / span 3; display: flex; flex-direction: column;">
      <div class="bet-cell green" data-bet="0">0</div>
      <div class="bet-cell green" data-bet="00">00</div>
    </div>`;

    for (let i = 1; i <= 36; i++) {
      const numData = rouletteNumbers.find(n => n.n === i.toString());
      tableHtml += `<div class="bet-cell ${numData.c}" data-bet="${i}">${i}</div>`;
    }

    grid.innerHTML = tableHtml;

    grid.querySelectorAll('.bet-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const bet = cell.getAttribute('data-bet');
        if (selectedBets.has(bet)) {
          selectedBets.delete(bet);
          cell.classList.remove('selected');
        } else {
          selectedBets.add(bet);
          cell.classList.add('selected');
        }
      });
    });

    specialBets.forEach(cell => {
      cell.addEventListener('click', () => {
        const bet = cell.getAttribute('data-bet');
        if (selectedBets.has(bet)) {
          selectedBets.delete(bet);
          cell.classList.remove('selected');
        } else {
          selectedBets.add(bet);
          cell.classList.add('selected');
        }
      });
    });

    function updateHistory(winningNumber) {
      history.unshift(winningNumber);
      if (history.length > 12) history.pop();

      historyList.innerHTML = history.map(item => `
        <div class="history-item ${item.c}" title="${item.n}">${item.n}</div>
      `).join('');
    }

    let isSpinning = false;

    spinBtn.addEventListener('click', () => {
      if (isSpinning) return;
      const betAmount = parseFloat(betInput.value);
      if (selectedBets.size === 0) {
        alert('Place at least one bet!');
        return;
      }
      const totalBet = betAmount * selectedBets.size;
      if (totalBet > cash) {
        alert('Not enough cash!');
        return;
      }

      isSpinning = true;
      spinBtn.disabled = true;
      resultDiv.textContent = 'Spinning...';
      winLossDiv.textContent = '';

      const winningIndex = Math.floor(Math.random() * rouletteNumbers.length);
      const winningNumber = rouletteNumbers[winningIndex];

      // Calculate the exact rotation needed to land on the winning number
      const segmentAngle = 360 / rouletteNumbers.length;
      // Offset to ensure the pointer lands at the center of the segment
      const offsetAngle = segmentAngle / 2;
      // Total rotation: full spins + segment position + offset
      const totalSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
      const targetRotation = -(totalSpins * 360 + winningIndex * segmentAngle + offsetAngle);
      
      // Animate the wheel
      wheel.style.transition = 'transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)';
      wheel.style.transform = `rotate(${targetRotation}deg)`;

      // Position the ball at the edge initially
      const centerX = wheel.clientWidth / 2;
      const centerY = wheel.clientHeight / 2;
      const radius = 160;
      
      ball.style.left = `${centerX + radius - ball.clientWidth / 2}px`;
      ball.style.top = `${centerY - ball.clientHeight / 2}px`;
      ball.style.display = 'block';

      // Animate the ball orbiting around the wheel
      let startTime = null;
      let animationId = null;
      const ballOrbitDuration = 4000; // Ball orbits for 4 seconds
      const ballFinalSettleTime = 1000; // Ball settles in 1 second
      
      // Ball animation parameters
      const startAngle = Math.random() * Math.PI * 2; // Random starting angle
      const orbitSpeed = 5; // Speed of orbit (radians per second)
      const initialOrbitRadius = radius - 10; // Initial orbit radius
      const finalOrbitRadius = radius * 0.7; // Final orbit radius when settling
      
      function animateBall(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        
        if (elapsed < ballOrbitDuration) {
          // Ball is orbiting
          const progress = elapsed / ballOrbitDuration;
          const currentAngle = startAngle + orbitSpeed * progress * Math.PI * 2;
          const currentRadius = initialOrbitRadius - (initialOrbitRadius - finalOrbitRadius) * progress;
          
          const ballX = centerX + currentRadius * Math.sin(currentAngle) - ball.clientWidth / 2;
          const ballY = centerY - currentRadius * Math.cos(currentAngle) - ball.clientHeight / 2;
          
          ball.style.left = `${ballX}px`;
          ball.style.top = `${ballY}px`;
          
          animationId = requestAnimationFrame(animateBall);
        } else {
          // Ball settles to winning position
          cancelAnimationFrame(animationId);
          
          // Move ball to the winning segment position
          const ballAngle = (winningIndex * segmentAngle + offsetAngle) * (Math.PI / 180);
          const ballX = centerX + (finalOrbitRadius) * Math.sin(ballAngle) - ball.clientWidth / 2;
          const ballY = centerY - (finalOrbitRadius) * Math.cos(ballAngle) - ball.clientHeight / 2;
          
          // Smooth transition to final position
          ball.style.transition = `left ${ballFinalSettleTime}ms ease-out, top ${ballFinalSettleTime}ms ease-out`;
          ball.style.left = `${ballX}px`;
          ball.style.top = `${ballY}px`;
        }
      }
      
      // Start ball animation
      animationId = requestAnimationFrame(animateBall);

      // After animation completes
      setTimeout(() => {
        isSpinning = false;
        spinBtn.disabled = false;

        let totalWin = 0;

        // Check for straight number bets
        if (selectedBets.has(winningNumber.n)) {
          totalWin += betAmount * 35;
        }

        // Check for color bets
        if (selectedBets.has(winningNumber.c)) {
          totalWin += betAmount * 2;
        }

        // Check for odd/even bets (0 and 00 don't count)
        const numVal = parseInt(winningNumber.n, 10);
        if (!isNaN(numVal) && numVal >= 1 && numVal <= 36) {
          if (numVal % 2 === 0 && selectedBets.has('even')) {
            totalWin += betAmount * 2;
          } else if (numVal % 2 === 1 && selectedBets.has('odd')) {
            totalWin += betAmount * 2;
          }
        }

        const netWin = totalWin - totalBet;

        resultDiv.textContent = `Result: ${winningNumber.n} (${winningNumber.c.toUpperCase()})`;

        if (netWin > 0) {
          winLossDiv.textContent = `You won $${netWin.toFixed(2)}! 🎉`;
          winLossDiv.style.color = '#4CAF50';
        } else if (netWin < 0) {
          winLossDiv.textContent = `You lost $${(-netWin).toFixed(2)}. 😞`;
          winLossDiv.style.color = '#F44336';
        } else {
          winLossDiv.textContent = `You broke even.`;
          winLossDiv.style.color = '#FFC107';
        }

        const newCash = cash - totalBet + totalWin;
        cash = newCash;
        cashSpan.textContent = cash.toFixed(2);
        updateCash(newCash);
        updateCashDisplay();

        updateHistory(winningNumber);
        
        // Clean up transitions
        setTimeout(() => {
          ball.style.transition = '';
          wheel.style.transition = '';
        }, 1000);
      }, 5500);
    });

    backBtn.addEventListener('click', () => showGameMenu());
  }

  showGameMenu();
}