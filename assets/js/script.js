// Buttons
var startBtn = document.getElementById("start-quiz-btn");
var viewHiScoresBtn = document.getElementById("view-high-scores-btn"); //a

// Timer is in a div, idk MM:SS text formatting so I put minutes and seconds
// in separate span elements
var quizTimer = document.getElementById("timer"); //span

// Text elements
var titleText = document.getElementById("title-text");
var descText = document.getElementById("desc-text");

// 


// questions
var questions = [
    {
        question: "The \"+\" operator joins multiple values into one ________",
        options: ["array", "string", "integer", "regular expression"],
        answer: "string"
    }, {
        question: "How do you stop the repeated execution of code in a <code>setInterval()</code> function?",
        options: ["<code>break;</code>", "<code>stopTimer();</code>", "<code>clearInterval()</code>", "<code>timer.remove();</code>"]
    }, {
        question: ""
    }
];


startBtn.addEventListener("click", startQuiz);

function startQuiz(event) {
    // init and debug stuff
    event.preventDefault();
    startBtn.remove();

    // reinitilize timer, then start countdown
    timer.textContent = "05:00";
    startTimer(0,3, playerLoses);

    // change text boxes to the first or next question, and restyle appropriately to make it look less like the quiz landing page
    titleText.textContent = "wow";
    titleText.setAttribute("style", "text-align: left; margin-left: 25vw;");
    descText.textContent = "";
    descText.setAttribute("style", "text-align: left; margin-left: 25vw; padding-right: 20vw;")

}


function startTimer(minutes, seconds, doWhenOver) {
    // timer counts only counts in seconds. Timer will be reformatted into MM:SS separately
    // total seconds (timeLeft) converts minutes into seconds then adds it to 'seconds' argument
    var timeLeft = seconds + (minutes * 60);
    timer.textContent = toMMSS(timeLeft);
    var timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            timer.textContent = toMMSS(timeLeft);
        } else {
            doWhenOver();
            clearInterval(timerInterval);
        }
    }, 1000);
}

function playerLoses() {
    console.log("time is up!! player lost!!");
    titleText.textContent = "Time's up!";
}

// toMMSS() takes an integer seconds and converts it to a string in MM:SS format
function toMMSS(seconds) {
    var minutes = Math.trunc(seconds / 60);
    var remainingSeconds = seconds % 60;

    // this is a bit hacky but let me explain what it is
    // if number on either side of colon is not big enough to take two spaces,
    // which only happens in a few specific instances, program fills the space with a 0
    // Happens when minutes is less than 10. For seconds, happens when it is less than 10
    // or when it is a multiple of 60 (which case mimics the behavior of real timers and clocks)
    var extraZeroM = "";
    var extraZeroS = "";
    if (minutes < 10) {
        extraZeroM = "0";
    }
    if (seconds < 10 || (seconds % 60) == 0) {
        extraZeroS = "0";
    }

    return extraZeroM + minutes + ":" + extraZeroS + remainingSeconds;
}

// toSeconds() takes a number of type unit and returns its value in seconds
// startTimer function only takes seconds as argument, so I created this function
// to allow you to pass
function toSeconds(unit, value) {
    switch (unit) {
        case "hour":
            return value * 3600;
        case "minute":
            return value * 60;
        default:
            return null;
    }
}