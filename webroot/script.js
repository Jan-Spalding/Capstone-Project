let socket = io()

socket.on("HTMLdata", function(text, source) {
  let parser = new DOMParser();
  let page = parser.parseFromString(text, "text/html")
  let html = page.body
  document.getElementById("webpage").appendChild(html)
  findArticle(html, source)
})

let pElements = []

function findArticle(html, source) {
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
    pictures[i].style.cssText = "width:40vw;height:calc(50vw/2);"
  }

  console.log(source)

  switch(source) {
    case "BBC-GTM":
      let aside = html.getElementsByTagName("aside")
      for(let i = aside.length-1; i >= 0; i--) {
        aside[i].remove()
      }

      let links = html.getElementsByTagName("a")
      for (let i = 0; i < links.length; i++) {
        let a = links[i].href
        a = a.slice(21)
        links[i].href = "http://localhost:3000/?url=https://www.bbc.co.uk" + a 
      }
      break;
  }

  let words = ""

  let text = html.getElementsByTagName("p")
  for(let i = 0; i < text.length; i++) {
    pElements.push(text[i])
    words += text[i].textContent + "."
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

function wordToken(sentence) {
  words = []

  for(let i = 0; i < sentence.length; i++) {
    for(let j = 0; j < sentence[i].length; j++) {
      if (sentence[i][j] != " ") {

        let index = j
        while(sentence[i][index] != " " && index < sentence[i].length) {
          index++
        }

        words.push(sentence[i].substring(j, index))
        j = index

      }
    }
  }


  return words
}

function removeCharacters(sentence) {

  for(let i = sentence.length-1; i >= 0; i--) {
    sentence[i] = sentence[i].toLowerCase()

    for(let j = sentence[i].length-1; j >= 0; j--) {
      asciiValue = sentence[i].charCodeAt(j)

      if (asciiValue >= 97 && asciiValue <= 122 || asciiValue == 32) {
        continue;
      } else {
        if (asciiValue == 45) {
          sentence[i] = sentence[i].slice(0, j) + " " + sentence[i].slice(j + 1, sentence[i].length)

        } else {
          sentence[i] = sentence[i].slice(0, j) + sentence[i].slice(j + 1, sentence[i].length)
        }

      }
    }

    if (sentence[i].length == 0) {
      sentence.splice(i, 1)
    }

  }

  return sentence;
}

function cleanSentence(sentence) {
  for(let i = sentence.length-1; i >= 0; i--) {
    if (sentence[i].length <= 5) {
      sentence.splice(i, 1)
    }
  }
}

let uniqueWords = []
let uniqueFrequency = []
let highestFrequency = 0
let totalWords = 0
let wordScores = []
let rawSentence
let sentences

function wordFreq(words) {
  for(let i = 0; i < words.length; i++) {
    unique = true;

    for(let j = 0; j < uniqueWords.length; j++) {
      if (words[i] == uniqueWords[j]) {
        unique = false;
        uniqueFrequency[j] += 1
        totalWords++

        if (uniqueFrequency[j] > highestFrequency) {
          highestFrequency = uniqueFrequency[j]
        }

        break;
      }
    }

    if (unique) {
      uniqueWords.push(words[i])
      uniqueFrequency.push(1)
      totalWords++
    }
  }

  for (let i = 0; i < uniqueFrequency.length; i++) {
    wordScores.push(uniqueFrequency[i] / highestFrequency)
  }

  // console.log(uniqueWords)
  // console.log(uniqueFrequency)
  // console.log(highestFrequency)
  // console.log(wordScores)
}

function summarise(text) {
  sentences = sentenceToken(text)
  cleanSentence(sentences)

  stripped = [...sentences]
  rawSentence = removeCharacters(stripped)

  document.getElementById("no_points").max = rawSentence.length
  
  words = wordToken(rawSentence)
  wordFreq(words)

  sentenceScores = []

  for(let i = 0; i < rawSentence.length; i++) {

    sentenceWords = wordToken([rawSentence[i]])
    sentenceScores.push(0)

    for(let j = 0; j < sentenceWords.length; j++) {
      for(let k = 0; k < uniqueWords.length; k++) {

        if (sentenceWords[j] == uniqueWords[k]) {
          sentenceScores[i] += wordScores[k]
          break
        }

      }
    }
  }

  // console.log(sentenceScores)
  // console.log(rawSentence)

  // BUBBLE SORT
  for(let i = 0; i < sentenceScores.length; i++) {
    for(let j = 0; j < (sentenceScores.length - i - 1); j++) {
      if (sentenceScores[j] > sentenceScores[j + 1]) {

        temp = sentenceScores[j]
        sentenceScores[j] = sentenceScores[j + 1]
        sentenceScores[j + 1] = temp

        temp = sentences[j]
        sentences[j] = sentences[j + 1]
        sentences[j + 1] = temp

        temp = pElements[j]
        pElements[j] = pElements[j + 1]
        pElements[j + 1] = temp
      }
    }
  }

  displayResults(sentences)
  socket.emit("analysis", uniqueWords, uniqueFrequency)
}

let ul
let points = 10
function displayResults(sentence) {
  ul = document.createElement("ul")

  for(let i = 0; i < points; i++) {
    let li = document.createElement("li")
    li.innerHTML = sentence[sentence.length-1 - i]
    li.classList = "listIndex"

    li.addEventListener("click", function() {
      pElements[sentence.length-1 - i].scrollIntoView({behavior: "smooth", block: "center"})
    })

    ul.appendChild(li)
  }

  document.getElementById("info").appendChild(ul)

  let time = Date.now() - startTime
  console.log("Processing Time: " + time + "ms")
}

document.getElementById("no_points").addEventListener("change", function(event) {
  points = event.target.value
  document.getElementById("pointText").innerHTML = event.target.value

  ul.remove()
  displayResults(sentences)
})

backPage = document.getElementsByClassName("backPage")
for(let i = 0; i < backPage.length; i++) {
  backPage[i].addEventListener("click", function() {
    url = window.location.href
    newUrl = url.slice(27)

    window.location.href = newUrl
  })
}

helpText = [
  "Sentiment Value shows the overall tone of the article.",
  "Emotional Density shows how many sentiment points are in the article.",
  "Change the slider to adjust how many summary points there are.",
  "Click on a summary point to view it in the article."
]

help = document.getElementsByClassName("help")
for(let i = 0; i < help.length; i++) {

  let container = document.createElement("div")
  container.className = "helpContainer center"

  let p = document.createElement("p")

  help[i].addEventListener("mouseenter", function(event) {
    p.innerHTML = helpText[i]

    offset = event.target.getBoundingClientRect()
    container.style.top = offset.top + "px"
    container.style.left = offset.left - 170 + "px"

    container.appendChild(p)
    document.body.appendChild(container)
  })

  help[i].addEventListener("mouseleave", function(event) {
    container.remove()
  })
}

console.log(pElements)

socket.on("score", function(score, totalMarkedWords) {
  sedimentalScore = (score/totalMarkedWords) / 5

  if (sedimentalScore > 0) {
    document.getElementById("sed_positive").style.width = sedimentalScore * 100 + "%"
  } else {
    document.getElementById("sed_negative").style.width = sedimentalScore * -100 + "%"
  }

  document.getElementById("sed_title").innerHTML = Math.floor(sedimentalScore * 100) + "%"

  densityScore = totalMarkedWords / totalWords
  document.getElementById("den_score").style.width = densityScore * 100 + "%"
  document.getElementById("den_title").innerHTML = Math.floor(densityScore * 100) + "%"
})

let startTime

window.onload = function() {
  startTime = Date.now()
}