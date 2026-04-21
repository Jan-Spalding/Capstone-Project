input = document.getElementById("input")

input.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        getURL(input.value)
    }
})

document.getElementById("findURL").addEventListener("click", function() {
    getURL(input.value)
})

function getURL(url) {
    window.location.href = "http://localhost:3000?url=" + url
}