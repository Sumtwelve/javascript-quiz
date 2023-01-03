// Buttons
var startBtn = document.getElementById("start-quiz-btn");
var viewHiScoresBtn = document.getElementById("view-high-scores-btn"); //a

// Timer is in a div, idk MM:SS text formatting so I put minutes and seconds
// in separate span elements
var quizTimer = document.getElementById("timer"); //span

// Text elements
var titleText = document.getElementById("title-text");
var descText = document.getElementById("desc-text");

console.log(Math.floor(Math.random() * 5));

// questions
var questions = [
    {
        questionText: "The \"+\" operator joins multiple values into one ________",
        options: ["array", "string", "integer", "regular expression"],
        answer: "string"
    }, {
        questionText: "How do you stop the repeated execution of code in a <code>setInterval()</code> function?",
        options: ["<code>break;</code>", "<code>stopTimer();</code>", "<code>clearInterval()</code>", "<code>timer.remove();</code>"],
        answer: "<code>clearInterval()</code>"
    }, {
        questionText: "The variables between parentheses in a function definition are ________ , and when calling a function, you pass in matching values as ________",
        options: ["parameters, arguments", "variables, values", "attributes, arguments", "properties, values"],
        answer: "parameters, arguments"
    }
];


// add event listener to landing page start button and begin the quiz!!
startBtn.addEventListener("click", startQuiz);

function startQuiz(event) {
    // init and debug stuff
    event.preventDefault();
    startBtn.remove();

    // reinitilize timer, then start countdown
    timer.textContent = "05:00";
    startTimer(0,3, playerLoses);

    // display question
    cycleQuestions();

    // change text boxes to the first or next question, and restyle appropriately to make it look less like the quiz landing page
    

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


function cycleQuestions() {
    // restyle textboxes to look less like quiz landing page
    titleText.setAttribute("style", "text-align: left; margin-left: 25vw;");
    descText.setAttribute("style", "text-align: left; margin-left: 25vw; padding-right: 20vw;")
    descText.textContent = "";

    // display the questions
    var question = questions[0];
    titleText.textContent = question.questionText;
}


function playerLoses() {
    console.log("time is up!! player lost!!");
    titleText.textContent = "Time's up!";
}





/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// ANCILLARY FUNCTIONS BELOW /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


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


// FISHER-YATES ARRAY SHUFFLE
// Credit for this code goes to Mike Bostock, https://bost.ocks.org/mike/shuffle/
// This algorithm shuffles the array in place by choosing a random index from the front of the array
// and sending it to the back of the array.
// The 'front' and 'back' are delimited by m, a number that decreases by 1 per random choosing,
// thus it acts as a current index marker. All random indexes chosen will be less than m, so no element
// can be selected twice.
// 
function shuffle(array) {
    // initialize m (total number of elements), plus undef variables t and i
    var m = array.length, t, i;

    // shuffle will cease when m == 0
    while (m) {
        // pick a random element that has not been picked yet
        i = Math.floor(Math.random() * m--);

        // temporarily store final 'front' element
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}