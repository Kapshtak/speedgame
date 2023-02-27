const library = require('./highscore.json')
const FileSystem = require('fs')

function getThirdScore() {
  return library[2].score
}

function refreshTopScore(object) {
  const score = object.score
  if (score > library[2].score) {
    library[2] = object
    if (Number(library[0].score) <= Number(score)) {
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
  return library
}

module.exports = {
  getThirdScore,
  refreshTopScore
}
