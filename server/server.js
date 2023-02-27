'use strict'

const http = require('http')
const port = 8000
const host = 'localhost'
const { getThirdScore, refreshTopScore } = require('./score.js')

const server = http.createServer((request, response) => {
  const { pathname, searchParams } = new URL(
    `http://${request.headers.host}${request.url}`
  )
  const route = decodeURIComponent(pathname)
  if (route === '/score') {
    const object = {
      name: searchParams.get('name'),
      score: searchParams.get('score')
    }
    const data = refreshTopScore(object)
    sendJSON(response, data)
  } else if (route === '/third') {
    const data = getThirdScore()
    sendJSON(response, data)
  } else {
    sendJSON(response, { error: 'Not found' }, 404)
  }
})

server.listen(port, host, () =>
  console.log(`Highscoreserver serving at ${host}:${port}`)
)

function sendJSON(response, data, status = 200) {
  const jsonData = JSON.stringify(data)
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
  response.end(jsonData)
}
