;(function(exports) {

    // Panel class is a wrapper around DOM elements
    // that show status (with things like the most recent click and so on)
    // with some helper methods
    function Panel(DOMelements) {
        this.update = function(statusJSON) {
            this.statusPanel.style.display = "block";
            this.alert.style.display = "none";
            if (statusJSON["alreadyClicked"]) {
                this.input.value = statusJSON["username"];
                this.thebutton.innerText = "You clicked the button!";
                this.disableButton();
            } else {
                this.enableButton();
            }
            this.timer.innerText = statusJSON.mostRecentClick.time;
            this.clickerName.innerText = statusJSON.mostRecentClick.name;
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
            statusPanel: document.getElementById("status-panel"),
            timer: document.getElementById("timer"),
            clickerName: document.getElementById("clicker-name"),
            thebutton: document.getElementById("thebutton"),
            input: document.getElementById("username")
        });

        console.log("thebutton.js loaded");

        // update the info and set up periodic calls to sync up the changes
        syncUp(panel, new XMLHttpRequest());
        exports.setInterval(function() {
            syncUp(panel, new XMLHttpRequest());
        },500);

        panel.thebutton.onclick = function() {
            thebuttonClick(panel, new XMLHttpRequest());
        }
    };
    
})(this);