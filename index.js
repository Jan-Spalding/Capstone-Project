const socketio = require("socket.io")
const express = require("express")
const fs = require("node:fs")

let exp = express();

exp.use("/start", express.static("start"))
exp.use("/webroot", express.static("webroot"))

let text = ""
let server = ""

exp.get("/", async function(request, response) {

  const url = request.query.url

  if (url == undefined) {
    await response.sendFile(__dirname + "/start/index.html")
  } else { 
    try {
      const data = await fetch(url)
      server = data.headers.get("server")
      console.log(data)
      text = await data.text()
    } catch {
      response.send("Invalid URL")
    }
    

    await response.sendFile(__dirname + "/webroot/index.html")
  }
})

words = []
score = []

fs.readFile("./AFINN-111.txt", "utf8", function(error, data) {
  if (error) {
    console.log("File failed to load")
  }

  // console.log(data)
  start = 0
  for(let i = 0; i < data.length; i++) {

    if (data.charCodeAt(i) == 9) {// tab
      words.push(data.substring(start, i))

      index = i
      while(data.charCodeAt(index) != 10 && index < data.length) {
        index++
      }

      score.push(Number(data.substring(i+1, index)))

      start = index+1
    }

  }

  // console.log(words)
  // console.log(score)
})

let webapp = exp.listen(3000, "localhost", function() {
  console.log("Binding server to localhost on port 3000");
})

let io = socketio(webapp)

io.on("connection", function(socket) {
  socket.emit("HTMLdata", text, server)

  socket.on("analysis", function(unique, frequency) {

    let overallScore = 0
    let totalMarkedWords = 0

    for(let i = 0; i < unique.length; i++) {
      for(let j = 0; j < words.length; j++) {
        if (unique[i] == words[j]) {
          // console.log("word: " + words[j] + " | " + frequency[i])
          overallScore += frequency[i] * score[j]
          totalMarkedWords += frequency[i]
          break;
        }
      }
    }

    socket.emit("score", overallScore, totalMarkedWords)
  })
})
