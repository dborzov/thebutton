;(function(exports) {
    var panel = {};
    var syncUp = function() {
        var request = new XMLHttpRequest();
        request.onload = function(data) {
            panel.timer.innerText = JSON.parse(data.target.responseText).lastClick;
        };
        request.open("GET", "/update.json", true);
        request.send();
    };

    exports.onload = function() {
        panel = {
            timer: document.getElementById("timer"),
            username: document.getElementById("username")
        };

        console.log("thebutton.js loaded");
        syncUp();
        exports.setInterval(syncUp,500);
    };
    
})(this);