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

// creating input field for entering your name when you get a high score
var hsForm = document.createElement("form");
hsForm.setAttribute("method", "POST");

var hsName = document.createElement("input");
hsName.setAttribute("type", "text");
hsName.setAttribute("name", "user-name");
hsName.setAttribute("placeholder", "Name");

var hsBtn = document.createElement("button");
hsBtn.setAttribute("type", "button");
hsBtn.textContent = "SUBMIT";

var hsList = document.createElement("section");

hsForm.appendChild(hsName);
hsForm.appendChild(hsBtn);

// questions
var questions = [
    {
        questionText: "Using the \"+\" operator joins multiple values into one _____________ value.",
        options: ["array", "string", "integer", "regular expression"],
        answer: "string"
    }//, {
    //     questionText: "How do you stop a setInterval() function from repeating?",
    //     options: ["break", "stopTimer()", "clearInterval()", "timer.remove()"],
    //     answer: "clearInterval()"
    // }, {
    //     questionText: "When defining a function, its variables are called _____________ . When calling a function, they are _____________ .",
    //     options: ["parameters, arguments", "variables, values", "attributes, arguments", "properties, values"],
    //     answer: "parameters, arguments"
    // }, {
    //     questionText: "What is the jQuery symbol?",
    //     options: ["%", "#", "$", "!"],
    //     answer: "$"
    // }, {
    //     questionText: "Which of these is NOT a valid EventListener type for an Element object?",
    //     options: ["wheel", "copy", "keydown", "rightclick"],
    //     answer: "rightclick"
    // }, {
    //     questionText: "What does \"href\" stand for?",
    //     options: ["href; it stands for nothing", "hypertext reference", "HTML reflow", "hypertext reflection"],
    //     answer: "hypertext reference"
    // }, {
    //     questionText: "jQuery is an example of a(n) _____________ .",
    //     options: ["GitHub repository", "3rd-Party API", "Webkit", "JS Development Kit"],
    //     answer: "3rd-Party API"
    // }, {
    //     questionText: "Which of these correctly \"grabs\" an HTML element for use in a script?",
    //     options: ["var element = document.getElementByID(\"box\");", "li = document.getElement(div a);", "var h1EL = document.html.body.h1;", "textBox = document.createElement(\"input\")"],
    //     answer: "var element = document.getElementByID(\"box\");"
    // }, {
    //     questionText: "Objects are initialized with _____________ .",
    //     options: ["curly braces", "square brackets", "parentheses", "angle brackets"],
    //     answer: "curly braces"
    // }, {
    //     questionText: "JavaScript was invented in which year?",
    //     options: ["1995", "1997", "1994", "1996"],
    //     answer: "1995"
    // }, {
    //     questionText: "TRUE OR FALSE: A string, being just an array of characters, has access to all of the native array methods.",
    //     options: ["true", "false"],
    //     answer: "false"
    /*}/*, {
        questionText: "",
        options: [""],
        answer: ""
    } */
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

    // reinitialize timer just in case
    // timer.textContent = "05:00";
    // timeLeft = 300;

    // erase title text, make sure option list elements are blank and append them to page
    titleText.textContent = "";
    descText.textContent = "";
    quizBox.appendChild(optionList);
    for (var i = 0; i < 4; i++) {
        optionListItems[i].textContent = "";
        optionList.appendChild(optionListItems[i]);
    }

    // begin quiz from the beginning
    var shuffQuestions = shuffle(questions); // suffles the question order. Random question order makes for a better quiz imo
    cycleQuestions(shuffQuestions, 0, 60); // questions list, start at question, seconds on the timer

}

var score; // stored outside the quiz function so as to not be overwritten by recursion

// recursive function which displays a question, then 
function cycleQuestions(questionsList, questionNumber, timerSeconds) {

    console.log(questionsList);

    // START THE TIMER IF WE ARE ON THE FIRST QUESTION
    if (questionNumber == 0) {
        timer.textContent = toMMSS(timerSeconds); // format seconds into MM:SS
        timerInterval = setInterval(function() {
            if (timerSeconds > 0) {
                timerSeconds--;
                timer.textContent = toMMSS(timerSeconds);
            } else {
                score = 0;
                clearInterval(timerInterval);
                playerLoses();
            }
        }, 1000); // timer decrements by 1 every 1 second
    }
    
    if (questionNumber >= questionsList.length) {
        // execute when code attempts to display a question number outside the bounds of the questions list
        clearInterval(timerInterval);
        score = timerSeconds;
        console.log("player finished with " + score + " seconds left!");
        playerWins();
    } else {
        console.log("\nBEGIN DISPLAYING QUESTIONS[" + questionNumber + "]");
        // DISPLAY THE QUESTION AND OPTIONS
        titleText.textContent = questionsList[questionNumber].questionText;
        descText.textContent = "";

        shuffOptions = shuffle(questionsList[questionNumber].options);
        
        console.log("correct answer is now " + questionsList[questionNumber].answer);

        optionList.setAttribute("style", "margin-top: 100px;")

        if (questionsList[questionNumber].options.length == 2) {
            option3.setAttribute("style", "display: none;");
            option4.setAttribute("style", "display: none;");
        } else {
            for (var i = 0; i < questionsList[questionNumber].options.length; i++) {
                optionListItems[i].setAttribute("style", "display: visible;")
            }
        }

        // SET TEXT, STYLE, AND PLACE CLICK LISTENERS ON OPTIONS
        // this is the main logic of the quiz
        for (var i = 0; i < shuffOptions.length; i++) {

            optionListItems[i].textContent = shuffOptions[i];
            optionListItems[i].setAttribute("style", "background-color: var(--dark-purple);")
            optionListItems[i].setAttribute("advance", "true");
            optionListItems[i].setAttribute("penalize", "true");

            // add listeners to each option element
            optionListItems[i].addEventListener("click", function(event) {
                
                // var target = event.target;
                // var targetText = event.target.innerHTML;

                var penalizes = event.target.getAttribute("penalize") == "true";
                var advances = event.target.getAttribute("advance") == "true";

                console.log("user selected option " + event.target.innerHTML);
                console.log("that is " + (event.target.innerHTML == questionsList[questionNumber].answer));

                // On click, change top margin so that when INCORRECT or CORRECT text appears,
                // the list isn't shifted down. There's probably a better way to do this.
                optionList.setAttribute("style", "margin-top: 27px;");

                if (event.target.innerHTML == questionsList[questionNumber].answer && event.target.getAttribute("advance") == "true") {
                    score = timerSeconds;
                    descText.textContent = "CORRECT!";
                    console.log("that's right! advances!")
                    event.target.setAttribute("penalize", "false");
                    event.target.setAttribute("advance", "false");
                    event.target.setAttribute("style", "background: #00BB00;");
                    console.log("advancing to questions[" + (questionNumber + 1) + "]");

                    questionNumber++;

                    if (questionNumber <= questionsList.length) {
                        // wait 1.5 seconds after correct guess before advancing to the next question
                        setTimeout(function() {
                            // increment questionNumber argument, then recurse. Advances to next question.
                            cycleQuestions(questionsList, questionNumber, timerSeconds);
                        }, 1250);
                    } else {
                        score = timerSeconds;
                        playerWins();
                    }    
                }

                if (event.target.innerHTML != questionsList[questionNumber].answer && event.target.getAttribute("penalize") == "true") {
                    descText.textContent = "INCORRECT!";
                    descText.setAttribute("style", "background-color: --correct;");
                    console.log("wrong!!");
                    event.target.setAttribute("style", "background: red;");
                    event.target.setAttribute("penalize", "false");
                    event.target.setAttribute("advance", "false");
                    timerSeconds -= 10;
                } // else do nothing at all
            });
        }
    }    
}



function playerLoses() {
    console.log("time is up!! player lost!!");
    timer.textContent = "00:00";
    //titleText = document.getElementById("title-text");
    titleText.textContent = "Time's up!";
    descText.textContent = "";
    optionList.remove();
}

function playerWins() {
    console.log("player wins!");
    //titleText = document.getElementById("title-text");
    titleText.textContent = "You win!";
    descText.textContent = ("Final Score: " + toMMSS(score));
    optionList.remove();

    // APPEND THE HIGH SCORE FORM ELEMENTS TO THE PAGE
    quizBox.appendChild(hsForm);
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