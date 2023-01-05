// Buttons
var startBtn = document.getElementById("start-quiz-btn");
var viewHiScoresBtn = document.getElementById("view-high-scores-btn"); //a

// Timer is in a div, idk MM:SS text formatting so I put minutes and seconds
var timer = document.getElementById("timer"); //span

// Text elements
var titleText = document.getElementById("title-text");
var descText = document.getElementById("desc-text");

// creating list elements to be displayed as choices for current question
var body = document.body;
var quizBox = document.getElementById("quiz-container");
var optionList = document.createElement("ul");
var option1 = document.createElement("li");
var option2 = document.createElement("li");
var option3 = document.createElement("li");
var option4 = document.createElement("li"); // maximum 4 choices per question
var optionListItems = [option1, option2, option3, option4]; // placed into array for easier textContent-setting later

var timeLeft = 300;


// questions
var questions = [
    {
        questionText: "The \"+\" operator joins multiple values into one _____________ value.",
        options: ["array", "string", "integer", "regular expression"],
        answer: "string"
    }, {
        questionText: "How do you stop a setInterval() function from repeating?",
        options: ["break", "stopTimer()", "clearInterval()", "timer.remove()"],
        answer: "clearInterval()"
    }, {
        questionText: "When defining a function, its variables are called _____________ . When calling a function, they are _____________ .",
        options: ["parameters, arguments", "variables, values", "attributes, arguments", "properties, values"],
        answer: "parameters, arguments"
    }
];


// add event listener to landing page start button and begin the quiz!!
startBtn.addEventListener("click", startQuiz);

function startQuiz(event) {
    // prevent page reloading, remove Start Quiz button
    event.preventDefault();
    startBtn.remove();

    // enables "are you sure you want to leave?" prompt
    // window.onbeforeunload = function() {
    //     return false;
    // };

    // reinitilize timer
    timer.textContent = "05:00";
    timeLeft = 300;

    // begin quiz
    cycleQuestions();

}



// The main code of the quiz, handles displaying questions and their options,
// handles figuring out if user made correct guess.
function cycleQuestions() {
    // restyle textboxes to look less like quiz landing page
    //titleText = document.getElementById("title-text");
    titleText.setAttribute("style", "text-align: center; border-bottom: 1px solid gray; padding-bottom: 30px;");
    descText.setAttribute("style", "text-align: left;")
    descText.innerHTML = "";

    // start the timer
    // timer counts only counts in seconds. Timer will be reformatted into MM:SS separately.
    var timeLeft = 300; // 300 seconds = 5 minutes
    timer.textContent = toMMSS(timeLeft);
    var timerInterval = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            timer.textContent = toMMSS(timeLeft);
        } else {
            clearInterval(timerInterval);
            playerLoses();
        }
    }, 1000); // execute every 1 second

    // display the questions
    shuffQuestions = shuffle(questions); // shuffle questions array to ensure random order each time

    // load up first question object, display its question text
    var question = shuffQuestions[0];
    titleText.textContent = question.questionText;

    displayQuestion(shuffQuestions[0]);

}

function displayQuestion(question) {
    // load up shuffled version of question's options array, then display each option
    shuffOptions = shuffle(question.options);

    quizBox.appendChild(optionList);

    for (var i = 0; i < 4; i++) {
        optionList.appendChild(optionListItems[i]);
        optionListItems[i].textContent = shuffOptions[i];
        optionListItems[i].addEventListener("click", function(event) {
            var target = event.target;
            var isCorrect = target.innerHTML == question.answer;
            if (isCorrect) {
                console.log(target.innerHTML + " is right!");
                target.setAttribute("style", "background-color: #00AA00;");
            } else if (!isCorrect && target.getAttribute("style") == null) {
                timeLeft += 10;
                target.setAttribute("style", "background-color: red;");
                target.setAttribute("penalize", "false");
            }
        })
    }
}

function playerLoses() {
    console.log("time is up!! player lost!!");
    titleText = document.getElementById("title-text");
    titleText.textContent = "Time's up!";
    optionList.remove();
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
    // program fills the space with an extra 0.
    // Necessary when minutes or seconds is less than 10, or when seconds is a multiple of 60.
    // Thus it mimics the behavior of real digital clocks, which never display the number 60.
    var extraZeroM = "";
    var extraZeroS = "";
    if (minutes < 10) {
        extraZeroM = "0";
    }
    if (remainingSeconds < 10 || (remainingSeconds % 60) == 0) {
        extraZeroS = "0";
    }

    return extraZeroM + minutes + ":" + extraZeroS + remainingSeconds;
}


function addSecToTimer(timer, penaltySeconds) {
    tl = timer.innerHTML.split(":");
    console.log(tl);
    console.log("Gonna do this: startTimer(" + tl[0] + ", (" + tl[1] + penaltySeconds + "), playerLoses");
    startTimer(parseInt(tl[0]), (parseInt(tl[1]) + penaltySeconds), playerLoses);
}


// FISHER-YATES ARRAY SHUFFLE
// Credit for this code goes to Mike Bostock, https://bost.ocks.org/mike/shuffle/
// This algorithm shuffles the array in place by choosing a random index from the front of the array
// and sending it to the back of the array.
// The 'front' and 'back' are delimited by m, a number that decreases by 1 per random choosing,
// thus it acts as a current index marker. All random indexes chosen will be less than m, so no element
// can be selected twice.
// Once random element i is chosen, safely swap it with element m by means of temporary register t.
function shuffle(array) {
    // initialize m (total number of elements, total number of UNCHOSEN elements), plus undef variables t and i
    var m = array.length, t, i;

    // shuffle will cease when m == 0
    while (m) {
        // pick a random element that has not been picked yet (between index 0 and m-1)
        // this is the real meat of the algorithm; the rest is just safe swapping code
        i = Math.floor(Math.random() * m--);

        // safely swap two elements in an array
        // step 1: store element to swap in temporary register t
        t = array[m];
        // step 2: place randomly chosen element at position m
        array[m] = array[i];
        // step 3: replaced element is placed back into array from t into position i
        array[i] = t;
    }

    return array;
}