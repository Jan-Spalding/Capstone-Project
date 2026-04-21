let socket = io()

socket.on("HTMLdata", function(text) {
  console.log(text)
})
