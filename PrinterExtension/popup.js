document.addEventListener('DOMContentLoaded', function () { // Аналог $(document).ready(function(){
    document.getElementById("btn").addEventListener("click", function () {

        chrome.storage.sync.get(['dataUrl'], function(result) {
            console.log('Value currently is ' + result.key);
          });


        // var canvas = document.getElementById('myCanvas');
        // var context = canvas.getContext('2d');

        // context.fillStyle = "white";
        // context.fillRect(0, 0, canvas.width, canvas.height);

        // context.beginPath();
        // context.moveTo(170, 80);
        // context.bezierCurveTo(130, 100, 130, 150, 230, 150);
        // context.bezierCurveTo(250, 180, 320, 180, 340, 150);
        // context.bezierCurveTo(420, 150, 420, 120, 390, 100);
        // context.bezierCurveTo(430, 40, 370, 30, 340, 50);
        // context.bezierCurveTo(320, 5, 250, 20, 250, 50);
        // context.bezierCurveTo(200, 5, 150, 20, 170, 80);
        // context.closePath();
        // context.lineWidth = 5;
        // context.fillStyle = 'black';
        // context.fill();

        // var dataURL = canvas.toDataURL("image/png");


        // document.getElementById('canvasImg').src = dataURL;
        // dataURL = dataURL.replace('data:image/png;base64,', '');
        
        // var all = new ReceiptBuilder().DrawTable(110,3).GetReciept();
        // message = {
        //     "commands": [
        //        { "print_canvas": dataURL },
        //         { "exit": "exit" }
        //     ]
        // };
        // SendMessage(message);
    });
});




// document.getElementById("btn").addEventListener("click", function () {
//     var example = document.getElementById("example"),
//         ctx = example.getContext('2d');
//     example.width = 50;
//     example.height = 50;
//     ctx.strokeRect(10, 10, 25, 25);

//     var imageData = ctx.getImageData(0, 0, 50, 50);
//     var buffer = imageData.data.buffer;  // ArrayBuffer

//     var port = chrome.runtime.connectNative('com.printer_utility.print');
//     port.onMessage.addListener(function (msg) {
//         console.log("Received" + msg);
//     });
//     port.onDisconnect.addListener(function () {
//         console.log("Disconnected");
//     });

//     function bufferToBase64(buf) {
//         var binstr = Array.prototype.map.call(buf, function (ch) {
//             return String.fromCharCode(ch);
//         }).join('');
//         return btoa(binstr);
//     }
//     var image_NEW = document.getElementById("example").toDataURL("image/png");     
//     document.getElementById("img").setAttribute('src',image_NEW);
//           image_NEW = image_NEW.replace('data:image/png;base64,', ''); 

//           document.getElementById("img").setAttribute('src',image_NEW);
//     message = {
//         "command": {
//             "print_canvas": image_NEW
//             // "print": ";;;;;"
//         }
//     };

//     var b = bufferToBase64(new Uint8Array(buffer));
//     port.postMessage(message);