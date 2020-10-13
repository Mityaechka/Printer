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

document.addEventListener("printCanvas", function (data) {
    message = data.detail;
    console.log(message);
    chrome.extension.sendMessage(message);
});
