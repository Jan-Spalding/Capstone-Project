let socket = io()

socket.on("HTMLdata", function(text) {
  let parser = new DOMParser();
  let page = parser.parseFromString(text, "text/html")
  let html = page.body
  document.getElementById("webpage").appendChild(html)
  findArticle(html)
})


function findArticle(html) {
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

  let words = ""

  let text = html.getElementsByTagName("p")
  for(let i = 0; i < text.length; i++) {
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

let uniqueWords = []
let uniqueFrequency = []
let highestFrequency = 0
let wordScores = []
let rawSentence

function wordFreq(words) {
  for(let i = 0; i < words.length; i++) {
    unique = true;

    for(let j = 0; j < uniqueWords.length; j++) {
      if (words[i] == uniqueWords[j]) {
        unique = false;
        uniqueFrequency[j] += 1

        if (uniqueFrequency[j] > highestFrequency) {
          highestFrequency = uniqueFrequency[j]
        }

        break;
      }
    }

    if (unique) {
      uniqueWords.push(words[i])
      uniqueFrequency.push(1)
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
  console.log(sentences)
  stripped = [...sentence]
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

        temp = rawSentence[j]
        rawSentence[j] = rawSentence[j + 1]
        rawSentence[j + 1] = temp

      }
    }
  }

  // console.log(sentenceScores)
  // console.log(rawSentence)


  displayResults(rawSentence)
}

let ul

function displayResults(sentence) {
  ul = document.createElement("ul")

  for(let i = 0; i < points; i++) {
    let li = document.createElement("li")
    li.innerHTML = sentence[sentence.length-1 - i]
    li.classList = "listIndex"
    ul.appendChild(li)
  }

  document.getElementById("info").appendChild(ul)
}

let points = 10
document.getElementById("no_points").addEventListener("change", function(event) {
  points = event.target.value
  document.getElementById("pointText").innerHTML = event.target.value

  ul.remove()
  displayResults(rawSentence)
})