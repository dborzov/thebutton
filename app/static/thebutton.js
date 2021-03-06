;(function(exports) {

    // Panel class is a wrapper around DOM elements
    // that show status (with things like the most recent click and so on)
    // with some helper methods
    function Panel(DOMelements) {
        this.update = function(statusJSON) {
            this.statusPanel.style.display = "block";
            this.alert.style.display = "none";
            if (statusJSON["alreadyClicked"]) {
                this.scorePanel.style.display = "block";
                this.input.value = statusJSON["username"];
                this.thebutton.innerText = "You clicked the button!";
                this.score.innerText = statusJSON["score"];
                this.disableButton();
            } else {
                this.scorePanel.style.display = "none";
                this.enableButton();
            }
            this.timer.innerText = statusJSON.mostRecentClick.time;
            console.log("nost recent clickers name:", statusJSON.mostRecentClick.name);
            console.log("nost recent clickers names DOM element:", this.clickerName);
            this.clickerName.innerText = statusJSON.mostRecentClick.name;


            leaderboardHTML = "";
            for (var i=0; i<statusJSON.leaderboard.length; i++) {
                leaderboardHTML += "<tr><td>" + statusJSON.leaderboard[i].name +
                            "</td><td>" + statusJSON.leaderboard[i].score +
                            "</td></tr>";
            }
            this.leaderboard.innerHTML = leaderboardHTML;
        };

        this.clickFail = function(error) {
            this.failedClick.innerText = "Ooops, that did not work. " + error.error;
            this.failedClick.style.display = "block";
        };

        this.updatingFailed = function() {
            this.alert.style.display = "block";
            this.statusPanel.style.display = "none";
            this.disableButton();
        };

        this.disableButton = function() {
            this.input.disabled = true;
            this.thebutton.disabled = true;
        };

        this.enableButton = function() {
            this.input.disabled = false;
            this.thebutton.disabled = false;
        };

        for (var prop in DOMelements) {
            if (!DOMelements.hasOwnProperty(prop)) {
                continue
            }
            this[prop] = DOMelements[prop];
        }
    };


    // syncUp syncs up the info on the most recent click
    var syncUp = function(panel, syncRequest) {
        syncRequest.onload = function(data) {
            panel.update(JSON.parse(data.target.responseText));
        };
        syncRequest.onerror = function() {
            panel.updatingFailed();
        }
        syncRequest.open("GET", "/status.json", true);
        syncRequest.send();
    };

    // thebuttonClick is the callback for button being clicked: it hides the button
    // to prevent double clicks and sends the post request reporting the click
    var thebuttonClick = function(panel, clickRequest) {
        clickRequest.onload = function(data) {
            panel.failedClick.style.display = "none";
            if (data.target.status !=200) {
                panel.clickFail(JSON.parse(data.target.responseText));
            } else {
                panel.update(JSON.parse(data.target.responseText));
            }
        }

        clickRequest.open("POST", "/click", true);
        panel.disableButton();
        clickRequest.setRequestHeader("Content-type","application/json");
        clickRequest.send(JSON.stringify({
            username: panel.input.value
        }));
    }

    exports.onload = function() {
        var panel = new Panel({
            alert: document.getElementById("server-down-alert"),
            failedClick: document.getElementById("failed-click-alert"),
            statusPanel: document.getElementById("status-panel"),
            scorePanel: document.getElementById("score-panel"),
            score: document.getElementById("score"),
            timer: document.getElementById("timer"),
            clickerName: document.getElementById("clicker-name"),
            thebutton: document.getElementById("thebutton"),
            leaderboard: document.getElementById("leaderboard"),
            input: document.getElementById("username")
        });


        // update the info and set up periodic calls to sync up the changes
        syncUp(panel, new XMLHttpRequest());
        exports.setInterval(function() {
            syncUp(panel, new XMLHttpRequest());
        },5000);

        panel.thebutton.onclick = function() {
            thebuttonClick(panel, new XMLHttpRequest());
        }
    };

})(this);
