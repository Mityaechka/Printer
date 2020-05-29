function SendMessage(message) {
  var port = chrome.runtime.connectNative('com.printer_utility.print');
  port.onMessage.addListener(function (msg) {
    console.log("Received" + msg);
  });
  port.onDisconnect.addListener(function () {
    console.log("Disconnected");
  });
  port.postMessage(message);
}

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
      return;

  if (event.data.type && (event.data.type == "FROM_PAGE")) {
      console.log("Content script received message: " + event.data.text);
  }
});

