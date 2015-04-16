;(function(exports) {
    var panel = {};

    // syncUp syncs up the info on the most recent click 
    var syncUp = function() {
        var request = new XMLHttpRequest();
        request.onload = function(data) {
            panel.timer.innerText = JSON.parse(data.target.responseText).time;
            panel.clickerName.innerText = JSON.parse(data.target.responseText).name;
        };
        request.open("GET", "/status.json", true);
        request.send();
    };

    var thebuttonClick = function() {
        console.log("hello from theButtonClick");
        var request = new XMLHttpRequest();
        request.open("POST", "/click", true);
        request.setRequestHeader("Content-type","application/json");
        request.send({
            username: panel.input.value
        });
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
        syncUp();
        exports.setInterval(syncUp,50000);
        panel.thebutton.onclick = thebuttonClick;

    };
    
})(this);