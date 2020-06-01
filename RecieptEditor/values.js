class Field {
    changeFunctionName = "RedrawReciept";
    pattern = ``;

    options = {};
    element;
    constructor(options, defaults) {
        if (options) {
            for (var key in defaults) {
                this.options[key] = options.hasOwnProperty(key)
                    ? options[key]
                    : defaults[key];
            }
        } else {
            this.options = defaults;
        }
    }
    DrawFileld(canvas, startYPos) {
        return startYPos;
    }
    AddPattern(parentElement) {
        parentElement.innerHTML = this.pattern.replace(
            /{changeFunction}/g,
            this.changeFunctionName
        );
        this.element = parentElement;
    }
    FillPattern() {
        if (this.element) {
            for (var option in this.options) {
                var input = this.element.querySelector(`#${option}`);
                if (input) {
                    input.value = this.options[option];
                }
            }
        }
    }
}
class TextField extends Field {
    pattern = `
    <div class="input-area area">
        <label>Текст</label>
        <input id="text" type="text" onchange="{changeFunction}()">
    </div>
    <div class="input-area area">
        <label>Выравнивание</label>
        <div class="input">
            <select id="align" onchange="{changeFunction}()">
                <option value="left">Лево</option>
                <option value="center">Центр</option>
                <option value="right">Право</option>
            </select>
        </div>
    </div>
    <div class="input-area area">
        <label>Стиль</label>
        <div class="input">
            <select id="style" onchange="{changeFunction}()">
                <option value="normal">Обычный</option>
                <option value="italic">Курсив</option>
                <option value="bold">Жирный</option>
            </select>
        </div>
    </div>
    <div class="input-area area">
        <label>Подчеркивание</label>
        <input id="underline" type="checkbox" onchange="{changeFunction}()">
    </div>
    <div class="input-area area">
        <label>Размер шрифта</label>
        <input id="fontSize" type="number" min="10" max="50" value="10" onchange="{changeFunction}()">
    </div>
  `;
    constructor(options) {
        super(options, {
            align: "left",
            fontSize: 30,
            style: "normal",
            text: "Пример текста",
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        var newPos = CanvasTextWrapper(canvas,
            this.options.text,
            { x: 0, y: startYPos },
            { font: `${this.options.style} ${this.options.fontSize}px Times New Roman  `, textAlign: this.options.align });
        return startYPos + newPos.y;

    }
}

class ImageField extends Field {
    pattern = `
    <div class="input-area area">
        <label>Изображение</label>
        <input id="image" type="file"accept="image/*" onchange="{changeFunction}()">
    </div>
    <div class="input-area area">
        <label>Выравнивание</label>
        <div class="input">
            <select id="align" onchange="{changeFunction}()">
                <option value="left">Лево</option>
                <option value="center">Центр</option>
                <option value="right">Право</option>
            </select>
        </div>
    </div>
    <div class="input-area area">
        <label>Высота</label>
        <input id="height" type="number" min="1" value="100" onchange="{changeFunction}()">
    </div>
    <div class="input-area area">
        <label>Ширина</label>
        <input id="width" type="number" min="1" value="100" onchange="{changeFunction}()">
    </div>
  `;
    constructor(options) {
        super(options, {
            align: "left",
            height: 50,
            width: 50,
            image: "",
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");
        var xPos = 0;
        switch (this.options.align) {
            case "center":
                xPos = canvas.width / 2 - this.options.width / 2;
                break;
            case "left":
                xPos = 0;
                break;
            case "right":
                xPos = canvas.width - this.options.width;
                break;
        }
        ctx.drawImage(this.options.image, xPos, startYPos, this.options.width, this.options.height);
        return startYPos + parseInt(this.options.height);
    }
}
class IndentField extends Field {
    pattern = `
    <div class="input-area">
        <label>Отступ</label>
        <input id="indent" type="number" min="1" value="1" onchange="{changeFunction}()">
    </div>
  `;
    constructor(options) {
        super(options, {
            indent: 10
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");

        return startYPos + parseInt(this.options.indent);
    }
}
class LineField extends Field {
    pattern = `
    <div class="input-area">
        <label>Символ</label>
        <input id="symbol" value="-" onchange="{changeFunction}()">
    <div>
     `;
    constructor(options) {
        super(options, {
            symbol: "-"
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");
        var symbolWidth = getTextSize("Times New Roman", this.options.symbol, 10, "normal");
        startYPos += symbolWidth[1];
        var step = symbolWidth[0] * 2;
        ctx.font = `10px Times New Roman`;
        ctx.textAlign = "center";
        for (var i = 0; i < canvas.width; i += step) {
            ctx.fillText(this.options.symbol, i, startYPos);
        }
        return startYPos;
    }
}
class TableField extends Field {
    pattern = `
    <div class="inline-container">
        <div>
            <h4>Настройка таблицы</h4>
            <div class="inline-container">
                <div class="input-area">
                    <label>Показывать гранцу</label>
                    <input id="showBorder" type="checkbox" onchange="{changeFunction}()">
                </div>
                <div class="input-area area">
                    <label>Размер шрифта</label>
                    <input id="fontSize" type="number" min="10" max="50" value="10" onchange="{changeFunction}()">
                </div>
            </div>
        </div>
    </div>
    <div id="header">
        <h4>Шапка таблицы</h4>
        <button  id="addRowBtn" onclick="TableField.AddHeaderColumn();{changeFunction}()">Добавить колонку</button>
    </div>
    <div id="structure">
        <h4>Строение таблицы</h4>
        <button  onclick="TableField.AddRow();{changeFunction}()">Добавить строку</button>
    </div>
  `;
    static headerPattern = `
      <div class="input-area area">
          <label>Название</label>
          <input id="columnName" type="text">
      </div>
      <div class="input-area area">
          <label>Заполнение</label>
          <input id="columnWidth" min="0" value="1" type="number">
      </div>
      <button onclick="TableField.RemoveHeaderColumn()">Удалить колонку</button>        
  `;
    static rowPattern = `
        <button  onclick="TableField.AddColumn()">Добавить колонку</button>
        <button  onclick="TableField.RemoveRow()">Удалить строку</button>       
    `;
    static columnPattern = `
        <div class="input-area area">
            <label>Значения</label>
            <input id="columnValue" type="text">
        </div>
        <div class="input-area area">
            <label>Заполнение</label>
            <input id="columnWidth" min="0" value="1" type="number">
        </div>
        <button onclick="TableField.RemoveColumn()">Удалить колонку</button>        
    `;
    constructor(options) {
        super(options, {
            showBorder: true,
            fontSize: 15,
            headers: [],
            rows: [],
            data: []
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        var canvasWidth = canvas.width;
        var headerWidth = 0;
        this.options.headers.forEach(x => {
            headerWidth += parseInt(x.width);
        });

        var headerBorderPositions = [];
        var fitWidth = 0;
        var newYPos = startYPos;
        var headerColumnWidth = canvasWidth / headerWidth;
        for (let i = 0; i < this.options.headers.length; i++) {
            const header = this.options.headers[i];
            var width = headerColumnWidth * header.width;

            var newPos = CanvasTextWrapper(canvas, header.name, { x: fitWidth, y: startYPos }, { maxWidth: width, font: `${this.options.fontSize}px Times New Roman  ` });

            fitWidth += width;
            headerBorderPositions.push(newPos.x);
            if (newPos.y >= newYPos) {
                newYPos = newPos.y;
            }
        }

        if (this.options.showBorder) {
            ctx.beginPath();
            ctx.moveTo(0, newYPos);
            ctx.lineTo(canvasWidth, newYPos);
            ctx.stroke();
            for (let i = 1; i < headerBorderPositions.length; i++) {
                const border = headerBorderPositions[i];
                ctx.beginPath();
                ctx.moveTo(border, startYPos);
                ctx.lineTo(border, newYPos);
                ctx.stroke();
            }
        }
        startYPos = newYPos;
        for (let i = 0; i < this.options.rows.length; i++) {
            const row = this.options.rows[i];
            var rowsWidth = 0;
            var rowsBorderPosition = [];
            var fitWidth = 0;
            row.forEach(x => {
                rowsWidth += parseInt(x.width);
            });
            var rowWidth = canvasWidth / rowsWidth;

            for (let j = 0; j < row.length; j++) {
                const column = row[j];
                var width = rowWidth * column.width;
                var newPos = CanvasTextWrapper(canvas,
                    column.value, { x: fitWidth, y: startYPos }, { maxWidth: width, font: `${this.options.fontSize}px Times New Roman  ` });

                fitWidth += width;
                rowsBorderPosition.push(newPos.x);
                if (newPos.y >= newYPos) {
                    newYPos = newPos.y;
                }
            }
            if (this.options.showBorder) {
                ctx.beginPath();
                ctx.moveTo(0, newYPos);
                ctx.lineTo(canvasWidth, newYPos);
                ctx.stroke();
                for (let i = 1; i < rowsBorderPosition.length; i++) {
                    const border = rowsBorderPosition[i];
                    ctx.beginPath();
                    ctx.moveTo(border, startYPos);
                    ctx.lineTo(border, newYPos);
                    ctx.stroke();
                }
            }
            startYPos = newYPos;
        }

        return startYPos;
    }
    static AddHeaderColumn() {
        var header = event.target.closest("#header");

        var element = stringToHTML(TableField.headerPattern);
        element.setAttribute("id", "headerColumn");
        element.setAttribute("class", "inline-container");
        header.appendChild(element);
    }
    static RemoveHeaderColumn() {
        var column = event.target.closest("#headerColumn");
        column.remove();
    }
    static AddRow() {
        var structure = event.target.closest("#structure");

        var element = stringToHTML(TableField.rowPattern);
        element.setAttribute("id", "row");
        structure.appendChild(element);
    }
    static RemoveRow() {
        var row = event.target.closest("#row");
        row.remove();
    }
    static AddColumn() {
        var row = event.target.closest("#row");

        var element = stringToHTML(TableField.columnPattern);
        element.setAttribute("id", "column");
        element.setAttribute("class", "inline-container");
        row.appendChild(element);
    }
    static RemoveColumn() {
        var row = event.target.closest("#column");
        row.remove();
    }
}
class BaseField extends Field {
    pattern = `

    `;
    constructor(options) {
        super(options, {
            align: "left",
            height: 50,
            width: 50,
            image: undefined,
        });
    }
    DrawFileld(canvas, startYPos) {
        var ctx = canvas.getContext("2d");

        return startYPos;
    }
}

function getTextSize(font, text, size, fontWeight) {

    var div = document.createElement("div");
    div.innerHTML = text;
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.left = '-9999px';
    div.style.fontFamily = font;
    div.style.fontWeight = fontWeight;
    div.style.fontSize = size + 'px'; // or 'px'
    document.body.appendChild(div);
    var size = [div.offsetWidth, div.offsetHeight];
    document.body.removeChild(div);

    console.log(size);
    return size;
};

var stringToHTML = function (str) {
    var dom = document.createElement('div');
    dom.innerHTML = str;
    return dom;
};