var russian = [String.fromCharCode(0x1B), String.fromCharCode(0x74), String.fromCharCode(0x11)];
var alignLeft = [String.fromCharCode(0x01B), String.fromCharCode(0x061), String.fromCharCode(0)];
var alignCenter = [String.fromCharCode(0x01B), String.fromCharCode(0x061), String.fromCharCode(1)];
var alignRight = [String.fromCharCode(0x01B), String.fromCharCode(0x061), String.fromCharCode(2)];
var endPrint = [String.fromCharCode(0x01B), String.fromCharCode(0x064), String.fromCharCode(2)];

var lineFeed = [String.fromCharCode(0x00A)];

var drawLineMiddle = "________________________________________________";
var drawLineSmall = "________________________________";
var horizontalTab = [String.fromCharCode(0x009)];
var cutpaperFull = [String.fromCharCode(0x01D), String.fromCharCode(0x056), String.fromCharCode(1)];
var cutpaperPartial = [String.fromCharCode(0x01D), String.fromCharCode(0x056), String.fromCharCode(0)];


var chr = function (n) { return String.fromCharCode(n); };
//var code = '12345';
function PrintBarcode(code){
    var barcode = [String.fromCharCode(0x1D), 'h', chr(120) +   //barcode height
    String.fromCharCode(0x1D), 'f', chr(0),              //font for printed number
String.fromCharCode(0x1D), 'k', chr(69), chr(code.length), code, chr(0)]; //code39
return barcode;
}
function SetCommand(...symbols){
    var str = [];
    symbols.forEach(element => {
        str = str.concat(String.fromCharCode(element));
    });
    return str;
}
function createAnything() {
    var anything = alignCenter;
    anything = anything.concat("Привет мир!");
    anything = anything.concat(lineFeed);
    anything= anything.concat(SetCommand(0x1D,0x42,0x01));
    anything = anything.concat("Привет мир!");
    //anything = anything.concat(PrintBarcode("12345"));

    // anything = anything.concat("Привет мир!");
    // anything = anything.concat(lineFeed);

    // anything = anything.concat(alignLeft);
    // anything = anything.concat("Привет мир x2!");

    // anything = anything.concat(lineFeed);

    // anything = anything.concat(alignRight);
    // anything = anything.concat("Hello world");

    // anything = anything.concat(lineFeed);

    // anything = anything.concat(drawLineMiddle);
    // anything = anything.concat(lineFeed);
    return anything;
}

function printReceipt() {
    var data = [];
    data = data.concat(createAnything());
    data = data.concat(endPrint);
    //data = data.concat(cutpaperPartial);

    var str = "";
    for (let i = 0; i < data.length; i++) {
        const s = data[i];
        str += s;
    }

    return str;
}

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