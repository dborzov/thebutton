;(function(exports) {

    // syncUp syncs up the info on the most recent click 
    var syncUp = function(panel, syncRequest) {
        syncRequest.onload = function(data) {
            panel.timer.innerText = JSON.parse(data.target.responseText).time;
            panel.clickerName.innerText = JSON.parse(data.target.responseText).name;
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
        panel = {
            timer: document.getElementById("timer"),
            clickerName: document.getElementById("clicker-name"),
            thebutton: document.getElementById("thebutton"),
            input: document.getElementById("username")
        };

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