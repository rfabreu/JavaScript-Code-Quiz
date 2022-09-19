var ready = function (fn) {
    if (typeof fn !== 'function') return;
    // If document is loaded, run method
    if (document.readyState === 'complete') {
        return fn();
    }
    // If not, wait until document loads
    document.addEventListener('DOMContentLoaded', fn, false);
};

ready(function () {
    var scoreListEl = document.getElementById("scoreList");
    // Retrieve High Score info from localstorage
    var Scores = JSON.parse(localStorage.getItem('highscores'));

    if (Scores !== null) {
        // Sort highscores in descending order
        Scores.sort(function (a, b) {
            var x = a.highscore;
            var y = b.highscore;
            if (x > y) { return -1; }
            if (x < y) { return 1; }
            return 0;
        });
        console.log(Scores);

        //display Highscore from localstorage on the screen element
        for (let i = 0; i < Scores.length; i++) {
            console.log(Scores[i].initials);

            var scoreEl = document.createElement("li");
            scoreEl.textContent = Scores[i].initials + " " + Scores[i].highscore;
            scoreListEl.appendChild(scoreEl);
        }
    }
});

document.getElementById("btnBack").onclick = function (event) {
    document.location.href = "../../index.html";
}

document.getElementById("btnClear").onclick = function (event) {
    // Clear local storage
    localStorage.removeItem("highscores");
    // Clear out ordered list items
    var ol = document.getElementById("scoreList");
    ol.innerHTML = "";
}
