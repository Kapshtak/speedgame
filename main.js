/* eslint-disable promise/param-names */
let score = 0
let counter = 0
let gameStatus = true
let interval = 1000
let lastCircleNumber = 0
const gameSpeed = 600
const firstCircle = document.getElementById('1')
const secondCircle = document.getElementById('2')
const thirdCircle = document.getElementById('3')
const fourthCircle = document.getElementById('4')
const firstLive = document.getElementById('1st_chicken')
const secondLive = document.getElementById('2nd_chicken')
const trirdLive = document.getElementById('3rd_chicken')
const startButton = document.querySelector('.start')
const closeButton = document.querySelector('.close')
const overlay = document.querySelector('.overlay')
const modal = document.querySelector('.modal')
const audioChicken = new Audio('media/sounds/chicken.wav')
const audioBackground = new Audio('media/sounds/haisenberg.wav')
let vol = audioBackground.volume = 0.8
const soundInterval = 200
let xCoord = 0
let yCoord = 0

window.addEventListener('mousemove', mouseCoordinates)

const circleArray = {
  1: firstCircle,
  2: secondCircle,
  3: thirdCircle,
  4: fourthCircle
}

function chickenSound () {
  const cloneSound = audioChicken.cloneNode()
  if (audioChicken.duration > 0) {
    cloneSound.play()
  } else {
    audioChicken.play()
  }
}

function backgroundMusic () {
  audioBackground.play()
}

function fadeout () {
  if (vol >= 0.02) {
    setTimeout(fadeout, soundInterval)
    audioBackground.volume = vol
    vol -= 0.04
  } else {
    audioBackground.volume = 0
  }
}

function getActiveCircle () {
  let activeCircle = lastCircleNumber
  while (activeCircle === lastCircleNumber) {
    activeCircle = Math.floor(Math.random() * 4) + 1
  }
  lastCircleNumber = activeCircle
  return activeCircle
}

function activate () {
  circleArray[getActiveCircle()].classList.add('active')
  circleArray[lastCircleNumber].removeEventListener('click', gameOver)
  circleArray[lastCircleNumber].removeEventListener('click', makeBlood)
  circleArray[lastCircleNumber].addEventListener('click', scoreCounter)
}

function deactivate () {
  circleArray[lastCircleNumber].classList.remove('active')
  circleArray[lastCircleNumber].removeEventListener('click', scoreCounter)
  circleArray[lastCircleNumber].addEventListener('click', gameOver)
  circleArray[lastCircleNumber].addEventListener('click', makeBlood)
}

function toggleOverlay () {
  overlay.classList.toggle('visible')
}

function lives () {
  if (counter - score === 1) {
    trirdLive.classList.add('hide')
  } else if (counter - score === 2) {
    secondLive.classList.add('hide')
  } else if (counter - score === 3) {
    firstLive.classList.add('hide')
  }
}

function scoreCounter () {
  score += 1
  document.querySelector('.score').innerHTML = 'current score: ' + score
  chickenSound()
  deactivate()
}

const gameOver = () => {
  modal.innerHTML = 'Your total score is ' + score
  gameStatus = false
  deactivate()
  fadeout()
  toggleOverlay()
}

const makeBlood = () => {
  document.elementFromPoint(xCoord, yCoord).style.backgroundColor = 'red'
}

function circlesManager () {
  if (lastCircleNumber !== 0) {
    deactivate()
  }
  activate()
  counter += 1
}

function gameManager () {
  if (!gameStatus) {
    return
  }
  if (counter - score === 3) {
    gameOver()
    return
  }
  setTimeout(gameManager, interval)
  if (interval > gameSpeed) {
    interval *= 0.97
    lives()
    circlesManager()
  } else {
    lives()
    circlesManager()
  }
}

const play = () => {
  gameManager()
  backgroundMusic()
}

for (const property in circleArray) {
  circleArray[property].addEventListener('click', gameOver)
  circleArray[property].addEventListener('click', makeBlood)
}

function mouseCoordinates (event) {
  xCoord = event.pageX
  yCoord = event.pageY
}

startButton.addEventListener('click', play)
closeButton.addEventListener('click', toggleOverlay)
