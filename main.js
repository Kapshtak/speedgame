/* eslint-disable space-before-function-paren */
/* eslint-disable promise/param-names */
/* Game preferences */
let score = 0
let counter = 0
let gameStatus = false
let gamePace = 1000
let lastCircleNumber = -1
let lastClickedCircleIndex = -1
let gameMaxSpeed = 750
let gameStep = 0.98
let gameDifficulty = 'easy'
let startingDiameter = 150

/* Elements */
let heroName
let champ
const chickens = document.querySelectorAll('.chicken')
const circles = document.querySelectorAll('.circle')
const startButton = document.querySelector('.start')
const stopButton = document.querySelector('.stop')
const restartButton = document.querySelector('.restart')
const heroButton = document.querySelector('.heroname')
const scores = document.querySelectorAll('.score')
const champions = document.querySelector('.modal-champion') // TODO: fix an auto-refresh issue
const modal = document.querySelector('.modal')
const modalHeader = document.querySelector('.modal-header')
const modalBody = document.querySelector('.modal-body')
const difficulty = document.querySelector('.difficulty')
const easy = document.querySelector('#easy')
const medium = document.querySelector('#medium')
const hard = document.querySelector('#hard')
const modalAnimationDuration =
  getComputedStyle(document.documentElement)
    .getPropertyValue('--modalAnimationDuration')
    .slice(0, -1) * 1000

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
let vol = 0.8
let finalMessage = '|'
let lettersIndex = 0

/* Sompentitive features  */
function isNewChampion() {
  const xmlHttp = new XMLHttpRequest()
  const heroName = document.getElementById('name').value
  alert(heroName)
  xmlHttp.open('POST', 'http://127.0.0.1:8000/score/', false)
  xmlHttp.setRequestHeader('Content-Type', 'application/json')
  xmlHttp.send(JSON.stringify({ name: heroName, score, difficulty: gameDifficulty }))
}

function getChampions() {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.open('GET', 'http://127.0.0.1:8000/score/', false)
  xmlHttp.send(null)
  return xmlHttp.response
}

/* Sounds and messages */
audioBackground.volume = 0.8

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
  } else if (score === 25) {
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
    if (typeof msg[lettersIndex] !== 'undefined') {
      finalMessage += msg[lettersIndex++] + '|'
      modalBody.textContent = finalMessage
    }
  } else {
    clearInterval(messageSetInterval)
    finalMessage = finalMessage.replace('|', '')
    modalBody.textContent = finalMessage
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
function setupGameDifficulty() {
  switch (gameDifficulty) {
    case 'easy':
      gameMaxSpeed = 750
      gameStep = 0.98
      break
    case 'medium':
      gameMaxSpeed = 650
      gameStep = 0.95
      break
    case 'hard':
      gameMaxSpeed = 550
      gameStep = 0.92
      break
  }
}

function manageLives() {
  const difference = counter - score
  if (difference !== 0) {
    chickens[3 - difference].classList.add('hide')
    chickens[6 - difference].classList.add('hide')
    setTimeout(() => {
      chickens[3 - difference].style.display = 'none'
    }, 350)
    setTimeout(() => {
      chickens[6 - difference].style.display = 'none'
    }, 350)
  }
}

function activateCircle() {
  circles[getActiveCircle()].classList.add('active')
  circles[lastCircleNumber].removeEventListener('click', gameOver)
  circles[lastCircleNumber].addEventListener('click', manageScore)
  manageLives()
  counter++
}

function deactivateCircle() {
  circles[lastCircleNumber].classList.remove('active')
  circles[lastCircleNumber].removeEventListener('click', manageScore)
  circles[lastCircleNumber].addEventListener('click', gameOver)
}

function toggleModal() {
  modal.classList.toggle('visible')
}

function manageScore() {
  score++
  scores.forEach((v, i) => {
    v.textContent = `current score: ${score}`
  })
  chickenSound()
  deactivateCircle()
  if (score >= 10) {
    funnySounds()
  }
}

const gameOver = () => {
  gameStatus = false
  modalHeader.textContent = `Your total score is ${score}`
  if (
    lastCircleNumber !== lastClickedCircleIndex &&
    lastClickedCircleIndex >= 0
  ) {
    circles[lastClickedCircleIndex].style.backgroundColor = '#d2691e'
  }
  deactivateCircle()
  stopButton.style.display = 'none'
  backgroundMusicFadeout()
  if (score >= champ) {
    isNewChampion()
    toggleModal()
  } else {
    toggleModal()
  }
  circles.forEach((circle, i) => {
    circle.removeEventListener('click', gameOver)
  })
  calculateFinalMessageSpeed()
  setTimeout(intervalTyping, modalAnimationDuration)
}

function manageCircles() {
  lastClickedCircleIndex = -1
  if (lastCircleNumber !== -1) {
    deactivateCircle()
  }
  activateCircle()
  if (gameDifficulty === 'hard' && counter > 0 && startingDiameter >= 75) {
    circles.forEach((circle, i) => {
      startingDiameter *= 0.995
      circle.style.width = `${startingDiameter}px`
      circle.style.height = `${startingDiameter}px`
    })
  }
}

function manageGame() {
  if (!gameStatus) {
    return
  }
  if (counter - score === 3) {
    manageLives()
    gameOver()
    return
  }
  setTimeout(manageGame, gamePace)
  if (gamePace > gameMaxSpeed) {
    gamePace *= gameStep
    manageCircles()
  } else {
    manageCircles()
  }
}

const startGame = () => {
  heroName = document.getElementById('name').value
  if (heroName) {
    champ = JSON.parse(getChampions())[2].score
    alert(heroName)
  } else {
    alert('nameless hero')
  }
  if (easy.checked) {
    gameDifficulty = 'easy'
  } else if (medium.checked) {
    gameDifficulty = 'medium'
  } else if (hard.checked) {
    gameDifficulty = 'hard'
  }
  setupGameDifficulty()
  difficulty.style.display = 'none'
  gameStatus = true
  startButton.style.display = 'none'
  stopButton.style.display = 'inline-block'
  manageGame()
  audioBackground.play()
}

const stopGame = () => {
  gameStatus = false
  gameOver()
}

const restartGame = () => {
  gameStatus = false
  score = 0
  counter = 0
  gamePace = 1000
  lastCircleNumber = -1
  lastClickedCircleIndex = -1
  startingDiameter = 150
  modal.classList.toggle('visible')
  startButton.style.display = 'inline-block'
  stopButton.style.display = 'none'
  scores.forEach((v, i) => {
    v.textContent = `current score: ${score}`
  })
  vol = audioBackground.volume = 0.8
  circles.forEach((circle, i) => {
    circle.style.backgroundColor = null
  })
  modalBody.textContent = ''
  finalMessage = '|'
  lettersIndex = 0
  chickens.forEach((chicken, i) => {
    chicken.classList.remove('hide')
    chicken.style.display = 'block'
  })
  circles.forEach((circle, i) => {
    circle.addEventListener('click', gameOver)
  })
  circles.forEach((circle, i) => {
    circle.style.width = `${startingDiameter}px`
    circle.style.height = `${startingDiameter}px`
  })
  difficulty.style.display = 'block'
}

/* Initialize necessary event listeners */
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

startButton.addEventListener('click', startGame)
stopButton.addEventListener('click', stopGame)
restartButton.addEventListener('click', restartGame)
heroButton.addEventListener('click', isNewChampion)
heroButton.addEventListener('submit', (event) => {
  event.preventDefault()
})

/* Fix below in according to the style.css file */
if (window.innerHeight > window.innerWidth) {
  if (window.innerWidth < 620 && window.innerHeight >= 620) {
    alert('Please rotate the device to play.')
  } else {
    alert('Your device cannot be used to play the game.')
  }
}
