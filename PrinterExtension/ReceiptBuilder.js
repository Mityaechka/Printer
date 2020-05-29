class ReceiptBuilder {
    static dot = 0.12499975;
    static endPrint = [String.fromCharCode(0x01B), String.fromCharCode(0x064), String.fromCharCode(2)];
    static lineFeed = [String.fromCharCode(0x00A)];
    reciept = [];
    constructor() {
        this.Reset();
    }
    ContactSymbol(symbol) {
        this.reciept = this.reciept.concat(symbol);
        return this;
    }
    ContactString(str) {
        this.reciept = this.reciept.concat(str);
        return this;
    }
    ContactHexSymbols(...symbols) {
        for (let i = 0; i < symbols.length; i++) {
            var s = String.fromCharCode(symbols[i]);
            this.reciept = this.reciept.concat(s);
        }
        return this;
    }
    ContactSymbols(...symbols) {
        this.reciept = this.reciept.concat(String.fromCharCode(0x1D));
        for (let i = 0; i < symbols.length; i++) {
            this.reciept = this.reciept.concat(symbols[i]);
        }
        this.ContactHexSymbols(0x0A);
        return this;
    }
    ContactBarcode(code, height = 80, font = 0) {
        var barcode = [String.fromCharCode(0x1D),
            'h', chr(height), String.fromCharCode(0x1D),
            'f', chr(1), String.fromCharCode(0x1D),
            'k', chr(69), chr(code.length), code, chr(0)];
        this.reciept = this.reciept.concat(barcode);
        return this;
    }
    GetReciept() {
        this.ContactSymbol(ReceiptBuilder.endPrint);

        var str = "";
        for (let i = 0; i < this.reciept.length; i++) {
            str += this.reciept[i];
        }

        return str;
    }

    Reset() {
        this.ContactHexSymbols(0x1B, 0x40);
        return this;
    }
    /**
     * Select align mode
     * 0 - left,
     * 1 - center,
     * 2 - right
     * @param {number} align 
     */
    SetAlign(align) {
        this.ContactHexSymbols(0x01B, 0x061, align);
        return this;
    }
    SetLineFeed() {
        this.ContactHexSymbols(ReceiptBuilder.lineFeed);
        return this;
    }

    DrawTable(width,columnsCount,...data){
        var columnWidth = parseInt(width/ReceiptBuilder.dot);
        var dots = columnWidth/columnsCount;
        this.SetLeftMargin(dots+dots).SetPrintAreaWidth(dots).ContactString("12345");
        // for(var i = 1;i<=columnsCount;i++){
        //     this.SetLeftMargin(dots*(i-1)).SetPrintAreaWidth(dots*i).ContactString("12345");
        // }
        this.SetLineFeed();
        this.ContactString("12345");
        return this;
    }

    SetLeftMargin(margin = 0){
        var nH = parseInt(margin/256);
        var nL =margin%256;
        this.ContactHexSymbols(0x1D,0x4C,nL,nH);
        return this;
    }
    SetPrintAreaWidth(width){
        var nH = parseInt(width/256);
        var nL =width%256;
        this.ContactHexSymbols(0x1D,0x57,nL,nH);
        return this;

    }
}