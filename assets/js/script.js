var timeEl = document.getElementById('timer');
var remainingTime = 70;
var timerInterval;

var qTitle = document.getElementById('Question');
var c1El = document.getElementById('btnA1');
var c2El = document.getElementById('btnA2');
var c3El = document.getElementById('btnA3');
var c4El = document.getElementById('btnA4');
var sTakeQ = document.getElementById('takeQuiz');
var sScore = document.getElementById('finalScore');
var sMain = document.getElementById('startQuiz');
var msgEl = document.getElementById('result');
var msgDone = document.getElementById('msgQuizDone');
var msgScoreEl = document.getElementById('msgScore');

var numCorrectAnswers = 0;
var numTotalQuestions = 0;
// First question starts at index zero
var idxQuestion = 0;
var blnCorrect = false;
var finalScore = 0;
var blnFinalQuestion = false;

sTakeQ.addEventListener("click", function (event) {
    var element = event.target;

    if (element.matches("button")) {
        msgEl.textContent = element.getAttribute("data-answered");
        msgEl.style.color = "red";
        if (element.getAttribute("data-answered") === "Correct") {
            blnCorrect = true;
            msgEl.style.color = "green";
            numCorrectAnswers++;
        } else {
            remainingTime -= 15;
            checkTimeRemaining();
        }
        idxQuestion++;
        loadQuestion();
    }
});

function loadQuestion() {
    var idxQuestion = -99;

    if (questions[idxQuestion] === undefined) {
        blnFinalQuestion = true;
        disableQuiz();
        return;
    }
    var correctAnswer = questions[idxQuestion].answer;
    numTotalQuestions++;

    qTitle.textContent = questions[idxQuestion].title;

    questions[idxQuestion].choices.sort(function () {
        return 0.5 - Math.random();
    });

    for (i = 0; i < questions[idxQuestion].choices.length; i++) {
        if (questions[idxQuestion].choices[i] === correctAnswer) {
            idxQuestion = i;
        }
    }

    c1El.textContent = questions[idxQuestion].choices[0];
    c2El.textContent = questions[idxQuestion].choices[1];
    c3El.textContent = questions[idxQuestion].choices[2];
    c4El.textContent = questions[idxQuestion].choices[3];

    c1El.setAttribute("data-answered", "Incorrect");
    c2El.setAttribute("data-answered", "Incorrect");
    c3El.setAttribute("data-answered", "Incorrect");
    c4El.setAttribute("data-answered", "Incorrect");

    switch (idxQuestion) {
        case 0:
            c1El.setAttribute("data-answered", "Correct");
            break;
        case 1:
            c2El.setAttribute("data-answered", "Correct");
            break;
        case 2:
            c3El.setAttribute("data-answered", "Correct");
            break;
        case 3:
            c4El.setAttribute("data-answered", "Correct");
            break;
    }
};

function setTime() {
    timerInterval = setInterval(function () {
        remainingTime--;

        if (!remainingTime > 0) {
            remainingTime = 0;
        }
        timeEl.textContent = "Time: " + remainingTime.toString().padStart(2, '0');
        checkTimeRemaining();
    }, 1000);
};

function checkTimeRemaining() {
    if (remainingTime <= 0 || blnFinalQuestion) {
        disableQuiz();
        clearInterval(timerInterval);

        showFinalScore();
    }
};

function showFinalScore() {
    // hide main section and Quiz section
    sTakeQ.classList.add("d-done");
    sScore.classList.remove("d-done");
    document.getElementById("msgQuizDone").textContent = "All done!";

    if (!remainingTime > 0) {
        remainingTime = 0;
    }

    finalScore = 0;
    if (numCorrectAnswers > 0) {
        finalScore = Math.round(100 * (numCorrectAnswers / numTotalQuestions) + (0.2 * remainingTime));
        if (finalScore > 100) {
            finalScore = 100;
        }
    }
    console.log("note: Total questions= " + numTotalQuestions + "\n correct answers= " + numCorrectAnswers + "\n time remaining= " + remainingTime + "\n final score= " + finalScore);

    document.getElementById("msgScore").textContent = "Your final score is " + finalScore;
};

function takeQuiz() {
    // Calls first quiz question
    idxQuestion = 0;
    loadQuestion();

    sMain.classList.add("d-done");
    sTakeQ.classList.remove("d-done");

    // Start timer
    setTime();
};

function disableQuiz() {
    c1El.disabled = true;
    c1El.classList.remove("btn-primary");
    c1El.classList.add("btn-secondary");

    c2El.disabled = true;
    c2El.classList.remove("btn-primary");
    c2El.classList.add("btn-secondary");

    c3El.disabled = true;
    c3El.classList.remove("btn-primary");
    c3El.classList.add("btn-secondary");

    c4El.disabled = true;
    c4El.classList.remove("btn-primary");
    c4El.classList.add("btn-secondary");
};

document.querySelector("#startBtn").onclick = function (event) {
    if (event === null) {
        return;
    }
    takeQuiz();
};

document.querySelector("#submitBtn").onclick = function (event) {
    if (event === null) {
        return;
    }
    if (document.getElementById("xInitials").value.length === 0) {
        alert("Enter your initials to save your scores.");
        return;
    }
    if (finalScore === 0) {
        alert("Your score must be higher than zero to be saved. Try again!");
        return;
    }

    Scores = JSON.parse(localStorage.getItem('highscores'));
    if (Scores !== null) {
        Scores.push({
            'initials': document.getElementById("xInitials").value,
            'highscore': finalScore
        });
    } else {
        Scores = [];
        Scores.push({
            'initials': document.getElementById("xInitials").value,
            'highscore': finalScore
        });
    }
    localStorage.setItem('highscores', JSON.stringify(Scores));
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("submitBtn").remove("btn-primary");
    sScore.classList.add("d-done");
    document.location.href = "index.html";
};