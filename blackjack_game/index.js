let player = {
    name: "Per",
    chips: 200
}

let playerCards = []
let dealerCards = []
let playerSum = 0
let dealerSum = 0
let bet = 0
let isAlive = false
let hasBlackJack = false

const messageEl = document.getElementById("message-el")
const playerEl = document.getElementById("player-el")
const cardsEl = document.getElementById("cards-el")
const sumEl = document.getElementById("sum-el")
const dealerCardsEl = document.getElementById("dealer-cards-el")
const dealerSumEl = document.getElementById("dealer-sum-el")
const hitBtn = document.getElementById("hit-btn")
const standBtn = document.getElementById("stand-btn")
const betEl = document.getElementById("bet-el")

playerEl.textContent = `${player.name}: $${player.chips}`

function getRandomCard() {
    let num = Math.floor(Math.random() * 13) + 1
    if (num > 10) return 10
    if (num === 1) return 11
    return num
}

function placeBet() {
    bet = Number(betEl.value)
    if (bet > 0 && bet <= player.chips) {
        messageEl.textContent = `Bet of $${bet} placed! Click Restart to start the game.`
    } else {
        alert("Invalid bet amount!")
    }
}

function startGame() {
    if (bet <= 0 || bet > player.chips) {
        alert("Place a valid bet first!")
        return
    }

    isAlive = true
    hasBlackJack = false
    playerCards = [getRandomCard(), getRandomCard()]
    dealerCards = [getRandomCard(), getRandomCard()]
    playerSum = calculateSum(playerCards)
    dealerSum = calculateSum(dealerCards)

    hitBtn.disabled = false
    standBtn.disabled = false

    renderGame()
}

function calculateSum(cards) {
    let sum = cards.reduce((a,b) => a+b, 0)
    let aceCount = cards.filter(c => c === 11).length
    while (sum > 21 && aceCount > 0) {
        sum -= 10
        aceCount--
    }
    return sum
}

function renderGame() {
    cardsEl.textContent = `Your Cards: ${playerCards.join(" ")}`
    sumEl.textContent = `Sum: ${playerSum}`

    dealerCardsEl.textContent = `Dealer Cards: ${dealerCards[0]} ?`
    dealerSumEl.textContent = `Dealer Sum: ?`

    if (playerSum === 21) {
        messageEl.textContent = "Blackjack! You win!"
        hasBlackJack = true
        endGame()
    } else if (playerSum > 21) {
        messageEl.textContent = "You busted!"
        endGame()
    } else {
        messageEl.textContent = "Hit or Stand?"
    }
}

function hit() {
    if (!isAlive || hasBlackJack) return
    let card = getRandomCard()
    playerCards.push(card)
    playerSum = calculateSum(playerCards)
    renderGame()
}

function stand() {
    hitBtn.disabled = true
    standBtn.disabled = true
    dealerPlay()
    determineWinner()
}

function dealerPlay() {
    dealerSum = calculateSum(dealerCards)
    while (dealerSum < 17) {
        dealerCards.push(getRandomCard())
        dealerSum = calculateSum(dealerCards)
    }
    dealerCardsEl.textContent = `Dealer Cards: ${dealerCards.join(" ")}`
    dealerSumEl.textContent = `Dealer Sum: ${dealerSum}`
}

function determineWinner() {
    if (playerSum > 21) {
        messageEl.textContent += " You lose the bet."
        player.chips -= bet
    } else if (dealerSum > 21 || playerSum > dealerSum) {
        messageEl.textContent = "You win the bet!"
        player.chips += bet
    } else if (playerSum === dealerSum) {
        messageEl.textContent = "It's a tie!"
    } else {
        messageEl.textContent = "Dealer wins! You lose the bet."
        player.chips -= bet
    }
    playerEl.textContent = `${player.name}: $${player.chips}`
    isAlive = false
}

function endGame() {
    hitBtn.disabled = true
    standBtn.disabled = true
    dealerPlay()
    determineWinner()
}
