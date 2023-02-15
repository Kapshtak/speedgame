/* eslint-disable space-before-function-paren */
/* eslint-disable promise/param-names */
/* Game preferences */
let score = 0
let counter = 0
let gameStatus = false
let gamePace = 1000
let lastCircleNumber = -1
let lastClickedCircleIndex = -1
const gameMaxSpeed = 750

/* Elements */
const chickens = document.querySelectorAll('.chicken')
const circles = document.querySelectorAll('.circle')
const startButton = document.querySelector('.start')
const closeButton = document.querySelector('.close')
const modal = document.querySelector('.modal')
const modalHeader = document.querySelector('.modal-header')
const modalBody = document.querySelector('.modal-body')

/* Messages and sounds */
const audioChicken = new Audio('media/sounds/chicken.wav')
const audioBackground = new Audio('media/sounds/haisenberg.wav')
const fasterSound = new Audio('media/sounds/faster.m4a')
const slayerSound = new Audio('media/sounds/hen_slayer.m4a')
const whatAreYou = new Audio('media/sounds/what_are_you.m4a')
const megaKill = new Audio('media/sounds/mega_kill.m4a')
const rampage = new Audio('media/sounds/rampage.m4a')
const messagesArray = {
  1: 'To survive, you should click faster!',
  2: 'You are the great hen slayer!',
  3: 'What are you? Could you really be stopped?'
}
let messageSetInterval
let finalMessageSpeed
let vol = (audioBackground.volume = 0.8)
let finalMessage = '|'
let lettersIndex = 0

/* Sounds and messages */
function chickenSound() {
  const cloneSound = audioChicken.cloneNode()
  if (audioChicken.duration > 0) {
    cloneSound.play()
  } else {
    audioChicken.play()
  }
}

function backgroundMusicFadeout() {
  if (vol >= 0.02) {
    setTimeout(backgroundMusicFadeout, 200)
    audioBackground.volume = vol
    vol -= 0.04
  } else {
    audioBackground.volume = 0
  }
}

function funnySounds() {
  if (score === 15) {
    megaKill.play()
  } else if (score === 20) {
    rampage.play()
  }
}

function getFinalMessage() {
  if (score < 10) {
    fasterSound.play()
    return messagesArray[1]
  } else if (score < 20) {
    slayerSound.play()
    return messagesArray[2]
  } else {
    whatAreYou.play()
    return messagesArray[3]
  }
}

function showFinalMessage(msg) {
  if (finalMessage.length < msg.length + 1) {
    finalMessage = finalMessage.replace('|', '')
    finalMessage += msg[lettersIndex++] + '|'
    modalBody.innerHTML = finalMessage
  } else {
    clearInterval(messageSetInterval)
    finalMessage = finalMessage.replace('|', '')
    modalBody.innerHTML = finalMessage
  }
}

const calculateFinalMessageSpeed = () => {
  if (score < 10) {
    finalMessageSpeed = (fasterSound.duration / messagesArray[1].length) * 1000
  } else if (score < 20) {
    finalMessageSpeed = (slayerSound.duration / messagesArray[2].length) * 1000
  } else {
    finalMessageSpeed = (whatAreYou.duration / messagesArray[3].length) * 1000
  }
}

function intervalTyping() {
  messageSetInterval = setInterval(
    showFinalMessage,
    finalMessageSpeed,
    getFinalMessage(score)
  )
}

function getActiveCircle() {
  let activeCircle = lastCircleNumber
  while (activeCircle === lastCircleNumber) {
    activeCircle = Math.floor(Math.random() * 4)
  }
  lastCircleNumber = activeCircle
  return activeCircle
}

/* Game management */
function lives() {
  const difference = counter - score
  if (difference !== 0) {
    chickens[3 - difference].classList.add('hide')
    setTimeout(() => {
      chickens[3 - difference].style.display = 'none'
    }, 350)
  }
}

function activateCircle() {
  circles[getActiveCircle()].classList.add('active')
  circles[lastCircleNumber].removeEventListener('click', gameOver)
  circles[lastCircleNumber].addEventListener('click', scoreManager)
  lives()
  counter++
}

function deactivateCircle() {
  circles[lastCircleNumber].classList.remove('active')
  circles[lastCircleNumber].removeEventListener('click', scoreManager)
  circles[lastCircleNumber].addEventListener('click', gameOver)
}

function togglemodal() {
  modal.classList.toggle('visible')
}

function scoreManager() {
  score++
  document.querySelector('.score').innerHTML = 'current score: ' + score
  chickenSound()
  deactivateCircle()
  if (score >= 10) {
    funnySounds()
  }
}

const gameOver = () => {
  gameStatus = false
  modalHeader.innerHTML = 'Your total score is ' + score
  if (
    lastCircleNumber !== lastClickedCircleIndex &&
    lastClickedCircleIndex >= 0
  ) {
    circles[lastClickedCircleIndex].style.backgroundColor = '#d2691e'
  }
  deactivateCircle()
  backgroundMusicFadeout()
  togglemodal()
  circles.forEach((circle, i) => {
    circle.removeEventListener('click', gameOver)
  })
  calculateFinalMessageSpeed()
  /* Interval is based on the duration of the animation */
  setTimeout(intervalTyping, 900)
}

function circlesManager() {
  lastClickedCircleIndex = -1
  if (lastCircleNumber !== -1) {
    deactivateCircle()
  }
  activateCircle()
}

function gameManager() {
  if (!gameStatus) {
    return
  }
  if (counter - score === 3) {
    lives()
    gameOver()
    return
  }
  setTimeout(gameManager, gamePace)
  if (gamePace > gameMaxSpeed) {
    gamePace *= 0.97
    circlesManager()
  } else {
    circlesManager()
  }
}

const play = () => {
  gameStatus = true
  gameManager()
  audioBackground.play()
}

/* Initialize necessary event listener */
const circleClicked = (e) => {
  if (gameStatus) {
    lastClickedCircleIndex = e.target.id - 1
  }
}

circles.forEach((circle, i) => {
  circle.addEventListener('click', circleClicked)
})

circles.forEach((circle, i) => {
  circle.addEventListener('click', gameOver)
})

startButton.addEventListener('click', play)
/* closeButton.addEventListener('click', togglemodal) */
