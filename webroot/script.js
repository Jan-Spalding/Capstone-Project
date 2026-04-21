let socket = io()

socket.on("HTMLdata", function(text) {
  // console.log(text)
  let parser = new DOMParser();
  let page = parser.parseFromString(text, "text/html")
  let html = page.body
  document.getElementById("webpage").appendChild(html)
  findArticle(html)
})


function findArticle(html) {
  console.log(html)

  html.style.cssText = "padding:0;margin:0;"

  let headers = html.getElementsByTagName("header")
  for(let i = 0; i < headers.length; i++) {
    headers[i].remove()
  }

  let footers = html.getElementsByTagName("footer")
  for(let i = 0; i < footers.length; i++) {
    footers[i].remove()
  }

  let pictures = html.getElementsByTagName("img")
  for(let i = 0; i < pictures.length; i++) {
    pictures[i].style.cssText = "width:50vw;height:calc(50vw/2);"
  }

  let words = ""

  let text = html.getElementsByTagName("p")
  for(let i = 0; i < text.length; i++) {
    console.log(text[i].textContent)
    words += text[i].textContent
  }

  summarise(words)
}

function sentenceToken(text) {
  sentence = []

  let start = 0;

  for(let i = 0; i < text.length; i++) {
    if (text[i] == ".") {
      sentence.push(text.slice(start, i).trim())
      start = i + 1
    }
  }

  return sentence;
}

function removeCharacters(sentence) {
  
  for(let i = 0; i < sentence.length; i++) {

  }
}

function summarise(text) {
  sentences = sentenceToken(text)
  stripped = [...sentence]
}