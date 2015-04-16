;(function(exports) {

    // Panel class is a wrapper around DOM elements
    // that show status (with things like the most recent click and so on)
    // with some helper methods
    var Panel = function(DOMelements) {
        this.prototype = DOMelements;
        this.update = function(statusJson) {
            panel.timer.innerText = statusJSON.time;
            panel.clickerName.innerText = statusJSON.name;
        };
    };


    // syncUp syncs up the info on the most recent click 
    var syncUp = function(panel, syncRequest) {
        syncRequest.onload = function(data) {
            panel.update(JSON.parse(data.target.responseText));
        };
        syncRequest.open("GET", "/status.json", true);
        syncRequest.send();
    };

    // thebuttonClick is the callback for button being clicked: it hides the button 
    // to prevent double clicks and sends the post request reporting the click
    var thebuttonClick = function(panel, clickRequest) {
        clickRequest.open("POST", "/click", true);
        clickRequest.setRequestHeader("Content-type","application/json");
        clickRequest.send(JSON.stringify({
            username: panel.input.value
        }));
    }

    exports.onload = function() {
        panel = Panel({
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