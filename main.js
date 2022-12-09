const RANDOM_QUOTE_URL = "http://api.quotable.io/random";

const quoteDisplay = document.querySelector(".quoteDisplay");
const quoteInput = document.querySelector(".quoteInput");

let test_time = 60;
let initial_test_time = test_time;
let correct_words = 0;
let incorrect_words = 0;
let gross_words = 0;
let gross_words_per_min = 0;
let net_words_per_min = 0;
let accuracy = 0; // calculated as nwpm*100 / gwpm

quoteDisplay.addEventListener("click", () => {
    quoteInput.focus();
});

async function getRandomQuote() {
    try {
        const response = await fetch(RANDOM_QUOTE_URL);
        const data = await response.json();
        return data.content;
    } catch {
        return "The quick brown fox jumps over the lazy dog.";
    }
}

async function renderNextQuote() {
    let letterCount = 0;
    quoteDisplay.innerHTML = "";
    // quoteDisplay.innerHTML = "<span class='blink-cursor'></span>";
    let quote = await getRandomQuote();
    quote = quote.substring(0, 150);
    const words = quote.split(" ");
    words.forEach((word) => {
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word");
        word.split("").forEach((letter) => {
            const letterSpan = document.createElement("span");
            letterSpan.classList.add("letter");
            letterSpan.innerText = letter;
            wordSpan.appendChild(letterSpan);
        });
        quoteDisplay.appendChild(wordSpan);
        quoteDisplay.innerHTML += "<span class='white-space letter'> </span>";
    });
    quoteInput.value = null;
}

renderNextQuote();

// displaying input

let timer_called = false;

quoteInput.addEventListener("input", keyDown);

function keyDown() {
    if (!timer_called) {
        timer();
        timer_called = true;
    }
    const quoteDisplayLetters = document.querySelectorAll(".letter");
    const quoteInputValue = document
        .querySelector(".quoteInput")
        .value.split("");

    quoteDisplayLetters.forEach((letterSpan, index) => {
        const character = quoteInputValue[index];
        const letterSpanParent = letterSpan.parentNode;
        if (character == null) {
            if (letterSpanParent.classList.contains("word")) {
                letterSpanParent.classList.remove("right");
                letterSpanParent.classList.remove("wrong");
            }
            letterSpan.classList.remove("incorrect");
            letterSpan.classList.remove("correct");
        } else if (letterSpan.textContent === character) {
            if (letterSpanParent.classList.contains("word")) {
                if (!letterSpanParent.classList.contains("wrong")) {
                    letterSpanParent.classList.add("right");
                }
            }
            letterSpan.classList.add("correct");
        } else {
            if (letterSpanParent.classList.contains("word")) {
                letterSpanParent.classList.add("wrong");
                letterSpanParent.classList.remove("right");
            }
            letterSpan.classList.add("incorrect");
        }
        if (quoteInputValue.length == quoteDisplayLetters.length) {
            correct_words += document.querySelectorAll(".right").length;
            incorrect_words += document.querySelectorAll(".wrong").length;
            renderNextQuote();
        }
    });
}

function result() {
    correct_words += document.querySelectorAll(".right").length;
    incorrect_words += document.querySelectorAll(".wrong").length;
    gross_words = correct_words + incorrect_words;
    gross_words_per_min = (gross_words * 60) / initial_test_time;
    net_words_per_min = (correct_words * 60) / initial_test_time;
    accuracy = ((net_words_per_min * 100) / gross_words_per_min).toFixed(2);
    console.log(correct_words);
    console.log(incorrect_words);
    console.log(gross_words);
    console.log(gross_words_per_min);
    console.log(net_words_per_min);
    console.log(accuracy);
    document.getElementById("correct_words").textContent = correct_words;
    document.getElementById("incorrect_words").textContent = incorrect_words;
    document.getElementById("gross_typing_speed").textContent =
        gross_words_per_min;
    document.getElementById("net_typing_speed").textContent = net_words_per_min;
    document.getElementById("accuracy").textContent = accuracy + "%";

    document.querySelector(".result").style.display = "flex";
}

const timerDial = document.querySelector(".time-dial");

function timer() {
    const timeInterval = setInterval(() => {
        test_time -= 1;
        timerDial.textContent = test_time;
        if (test_time < 1) {
            clearInterval(timeInterval);
            quoteInput.removeEventListener("input", keyDown);
            result();
        }
    }, 1000);
}

document.querySelectorAll(".btn").forEach((ele) => {
    ele.addEventListener("click", () => {
        window.location.reload();
    });
});
