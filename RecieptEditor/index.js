window.postMessage("message", "*");

        // for (let i = 0; i < chars.length; i++) {
        //     var char = chars[i];
        //     var charSize = getTextSize("Comic Sans MS", char, fontSize, style);

        //     var xPos = fillWidth;
        //     switch (align) {
        //         case "center":
        //             xPos = canvas.width / 2;
        //             break;
        //         case "left":
        //             xPos = 0;
        //             break;
        //         case "right":
        //             xPos = canvas.width;
        //             break;
        //     }
        //     if (charSize[0] + fillWidth <= canvas.width) {
        //         ctx.fillText(char, xPos+fillWidth, prevYPos);
        //         fillWidth = charSize[0] + fillWidth;
        //     } else {
        //         fillWidth = 0;
        //         prevYPos += textSize[1];
        //         ctx.fillText(char, xPos, prevYPos);
        //         fillWidth = charSize[0] + fillWidth;
        //     }
        // }

        // if (textSize[0] <= canvas.width) {
           
        //     ctx.fillText(text, xPos, prevYPos);
        // }
        // else {
        //     var chars = text.split("");
        //     var fillWidth = 0;
        //     var words = text.split(' ');
        //     var line = '';

        //     for (var n = 0; n < words.length; n++) {
        //         var testLine = line + words[n] + ' ';
        //         var metrics = ctx.measureText(testLine);
        //         var testWidth = metrics.width;
        //         if (testWidth > canvas.width && n > 0) {
        //             ctx.fillText(line, xPos, prevYPos);
        //             line = words[n] + ' ';
        //             y += lineHeight;
        //         }
        //         else {
        //             line = testLine;
        //         }
        //     }
        //     ctx.fillText(line, xPos, prevYPos);
        // }