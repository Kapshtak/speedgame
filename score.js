const library = require('./highscore.json')
const FileSystem = require('fs')

function getTrirdScore() {
  return library[2].score
}

function refreshTopScore(object) {
  const score = object.score
  if (score > library[2].score) {
    library[2] = object
    if (library[0].score <= score) {
      const temp = library[0]
      library[0] = library[2]
      library[2] = library[1]
      library[1] = temp
    } else if (library[1].score <= score) {
      const temp = library[1]
      library[1] = library[2]
      library[2] = temp
    }
  }
  FileSystem.writeFile('highscore.json', JSON.stringify(library), (error) => {
    if (error) throw error
  })
}

module.exports = {
  getTrirdScore,
  refreshTopScore
}


function getTrirdScore(arr) {
  return arr[2].score
}

const newScore = { name: 'Arsen', score: 25 }

function refreshTopScore(object, arr) {
  const score = object.score
  if (score > arr[2].score) {
    arr[2] = object
    if (arr[0].score <= score) {
      const temp = arr[0]
      arr[0] = arr[2]
      arr[2] = arr[1]
      arr[1] = temp
    } else if (arr[1].score <= score) {
      const temp = arr[1]
      arr[1] = arr[2]
      arr[2] = temp
    }
  }
  /*   FileSystem.writeFile('highscore.json', JSON.stringify(library), (error) => {
    if (error) throw error
  }) */
}

let temp = fetch('./highscore.json')
  .then((response) => response.json())
  .then((data) => {
    const arr = []
    for (const person of data) arr.push(person)
    refreshTopScore(newScore, arr)
    console.log(arr)
  })