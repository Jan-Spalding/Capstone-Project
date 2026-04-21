const socketio = require("socket.io")
const express = require("express")

let exp = express();

exp.use("/start", express.static("start"))
exp.use("/webroot", express.static("webroot"))

let text = ""

exp.get("/", async function(request, response) {

  const url = request.query.url

  if (url == undefined) {
    await response.sendFile(__dirname + "/start/index.html")
  } else { 
    const data = await fetch(url)
    text = await data.text()

    await response.sendFile(__dirname + "/webroot/index.html")
  }
})

let webapp = exp.listen(3000, "localhost", function() {
  console.log("Binding server to localhost on port 3000");
})

let io = socketio(webapp)

io.on("connection", function(socket) {
  socket.emit("HTMLdata", text)
})
