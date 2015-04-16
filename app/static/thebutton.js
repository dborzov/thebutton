;(function(exports) {
    var panel = {};

    // syncUp syncs up the info on the most recent click 
    var syncUp = function() {
        var request = new XMLHttpRequest();
        request.onload = function(data) {
            panel.timer.innerText = JSON.parse(data.target.responseText).time;
            panel.username.innerText = JSON.parse(data.target.responseText).name;
        };
        request.open("GET", "/status.json", true);
        request.send();
    };


    exports.onload = function() {
        panel = {
            timer: document.getElementById("timer"),
            username: document.getElementById("clicker-name")
        };

        console.log("thebutton.js loaded");

        // update the info and set up periodic calls to sync up the changes
        syncUp();
        exports.setInterval(syncUp,500);
    };
    
})(this);