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

// creating form for submitting a high score
var hsForm = document.createElement("form");
hsForm.setAttribute("method", "POST");

var hsName = document.createElement("input");
hsName.required = true;
hsName.setAttribute("type", "text");
hsName.setAttribute("name", "user-name");
hsName.setAttribute("placeholder", "Name");

var hsBtn = document.createElement("button");
hsBtn.setAttribute("type", "button");
hsBtn.textContent = "SUBMIT";

hsForm.appendChild(hsName);
hsForm.appendChild(hsBtn);

// creating box to display list of high scores
var hsContainer = document.createElement("section");
hsContainer.setAttribute("class", "high-score-container");

var hsFirstPlace = document.createElement("div");
var hsSecondPlace = document.createElement("div");
var hsThirdPlace = document.createElement("div");
var hsFourthPlace = document.createElement("div");
var hsFifthPlace = document.createElement("div");

var score; // stored outside the quiz function so as to not be overwritten by recursion

// questions
var questions = [
    {
        questionText: "Using the \"+\" operator joins multiple values into one _____________ value.",
        options: ["array", "string", "integer", "undefined; the \"+\" operator can only be used on strings"],
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



// SETTING DEFAULT HIGH SCORES
// If there are no high scores set by the user, these dummy scores will be there
var defaultHighScores = [
    {name: "Mary", score: 35},
    {name: "Lucas", score: 30},
    {name: "John", score: 25},
    {name: "Lucy", score: 15},
    {name: "Eric", score: 10}
];
if (localStorage.getItem("high-scores") == null || localStorage.getItem("high-scores") == []) {
    localStorage.setItem("high-scores", JSON.stringify(defaultHighScores));
}


// add event listener to landing page start button and begin the quiz!!
startBtn.addEventListener("click", startQuiz);

// this is the "main" or "master" function that initiates the different sections of the quiz
function startQuiz(event) {
    // prevent page reloading, remove Start Quiz button
    event.preventDefault();
    startBtn.remove();

    // disables "are you sure you want to leave?" prompt
    setWarningPrompt(false);

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

    setWarningPrompt(false); // was set to true during quiz, turn it back off

}


// recursive function which displays a question, then 
function cycleQuestions(questionsList, questionNumber, timerSeconds) {

    //console.log(questionsList);

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
                return;
            }
        }, 1000); // timer decrements by 1 every 1 second
    } else {
        // enables "are you sure you want to leave?" prompt
        // only activates after question 1, or in other words, after the user has made progress on the quiz
        setWarningPrompt(false);
    }
    
    if (questionNumber >= questionsList.length) {
        // PLAYER WINS
        // Execute when code attempts to display a question number outside the bounds of the questions list.
        // This case means player wins, having answered all of the questions correctly.
        clearInterval(timerInterval);
        score = toMMSS(timerSeconds);
        console.log("player finished with " + score + " seconds left!");
        playerWins(score);
        return;
    } else {
        //console.log("\nBEGIN DISPLAYING QUESTIONS[" + questionNumber + "]");
        // display the question
        titleText.textContent = questionsList[questionNumber].questionText;
        descText.textContent = "";

        // give space for the Correct!/Incorrect! text box to appear
        optionList.setAttribute("style", "margin-top: 100px;")

        // We need to hide the last two list items for true/false questions.
        // There's probably a better way to do this, like setting all list items to display:none
        // and only revealing the same number of them as there are options for the current question.
        if (questionsList[questionNumber].options.length == 2) {
            option3.setAttribute("style", "display: none;");
            option4.setAttribute("style", "display: none;");
        } else { // set all 4 option elements to visible, resets any invisibility applied regardless of when
            for (var i = 0; i < questionsList[questionNumber].options.length; i++) {
                optionListItems[i].setAttribute("style", "display: visible;")
            }
        }

        // randomize each question's available options
        shuffOptions = shuffle(questionsList[questionNumber].options);

        // SET TEXT, STYLE, AND PLACE CLICK LISTENERS ON OPTIONS
        // this is the main logic of the quiz
        for (var i = 0; i < shuffOptions.length; i++) {

            optionListItems[i].textContent = shuffOptions[i];
            optionListItems[i].setAttribute("style", "background-color: var(--dark-purple);")
            optionListItems[i].setAttribute("advance", "true");
            optionListItems[i].setAttribute("penalize", "true");

            // add listeners to each option element
            optionListItems[i].addEventListener("click", function(event) {

                // debug stuff
                //console.log("user selected option " + event.target.innerHTML);
                //console.log("that is " + (event.target.innerHTML == questionsList[questionNumber].answer));

                // On click, change top margin so that when INCORRECT or CORRECT text appears,
                // the list isn't shifted down. There's probably a better way to do this.
                optionList.setAttribute("style", "margin-top: 27px;");

                if (event.target.innerHTML == questionsList[questionNumber].answer && event.target.getAttribute("advance") == "true") {
                    score = timerSeconds;
                    descText.textContent = "CORRECT!";
                    //console.log("that's right! advances!")
                    event.target.setAttribute("penalize", "false");
                    event.target.setAttribute("advance", "false");
                    event.target.setAttribute("style", "background: #00BB00;");
                    //console.log("advancing to questions[" + (questionNumber + 1) + "]");

                    questionNumber++;

                    // wait 1.5 seconds after correct guess before advancing to the next question
                    setTimeout(function() {
                        // increment questionNumber argument, then recurse. Advances to next question.
                        cycleQuestions(questionsList, questionNumber, timerSeconds);
                    }, 1250);
                }

                if (event.target.innerHTML != questionsList[questionNumber].answer && event.target.getAttribute("penalize") == "true") {
                    descText.textContent = "INCORRECT!";
                    descText.setAttribute("style", "background-color: --correct;");
                    //console.log("wrong!!");
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
    //console.log("time is up!! player lost!!");
    timer.textContent = "00:00";
    titleText.textContent = "Time's up!";
    descText.textContent = "";
    optionList.remove();
    checkForHighScore(timer.textContent);
}

function playerWins(userScore) {
    //console.log("player wins!");
    titleText.textContent = "You win!";
    console.log("Final score: " + userScore);
    descText.textContent = ("Final Score: " + userScore);
    optionList.remove();
    checkForHighScore(userScore);

    // APPEND THE HIGH SCORE FORM ELEMENTS TO THE PAGE
    quizBox.appendChild(hsForm);


    // APPEND HIGH SCORES LIST
    // Step 1: make sure there's something in localstorage so we can read it and display it to the page
    

    hsBtn.addEventListener("click", function(event) {
        event.preventDefault();
        var highScoreEntry = {
            name: hsName.value,
            score: userScore
        }

        console.log(highScoreEntry);

        

        // APPEND HIGH SCORES LIST
        // Only the top 5 places will display, so we'll need 5 divs.
        // Each of those divs will have two children divs; the first has the name, the second their score
        quizBox.append(hsContainer);
    });

    
}

// Handles all highscore-related actions, including displaying new elements on the page.
function checkForHighScore(scoreString) {
    // GET SCORE
    var scoreSplit = scoreString.split(":");
    var finalScore = ((scoreSplit[0] * 60) + scoreSplit[1]); // converts MM:SS to total seconds

    // CHECK IF SCORE IS A HIGH SCORE

}

function appendToLocalStorage(name, data) {

}

// returns void. takes user score and places it on leaderboard, which is stored in Local Storage
function placeUserScore(score) {

}





/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// ANCILLARY FUNCTIONS BELOW /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


// takes boolean and enables or disables the window prompt "Are you sure you want to leave this page?"
function setWarningPrompt(state) {
    window.onbeforeunload = function() {
        return state;
    };
}


// toMMSS() takes an integer seconds and converts it to a string in MM:SS format
function toMMSS(seconds) {
    var minutes = Math.trunc(seconds / 60);
    var remainingSeconds = seconds % 60;

    // this is a bit hacky but let me explain what it is.
    // If number on either side of colon is not big enough to take two spaces,
    // program fills the space with an extra 0.
    // Necessary when minutes or seconds is less than 10, or when seconds is a multiple of 60.
    // Thus it mimics the behavior of real digital clocks, which never display 60 in the seconds place.
    var extraZeroM = "";
    var extraZeroS = "";
    if (minutes < 10) {
        extraZeroM = "0";
    }
    if (remainingSeconds < 10 || (remainingSeconds % 60 == 0)) {
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