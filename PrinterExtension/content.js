console.log("hello");
function SendMessage(message) {
    var port = chrome.runtime.connectNative('com.printer_utility.printer');
    port.onMessage.addListener(function (msg) {
        console.log("Received" + msg);
    });
    port.onDisconnect.addListener(function () {
        console.log("Disconnected");
    });
    port.postMessage(message);
}

document.addEventListener("hello", function (data) {


    var canvas = document.getElementById("canvas");
    var dataURL = canvas.toDataURL("image/png");
    dataURL = dataURL.replace('data:image/png;base64,', '');

    message = {
        "commands": [
            //{ "print_string": "sdf" },
            { "print_canvas": dataURL },
            //{ "exit": "exit" }
        ]
    }
    chrome.extension.sendMessage(message);

});
