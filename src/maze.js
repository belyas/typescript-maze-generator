"use strict";
/// <reference path="cell.ts"/>
var Maze = /** @class */ (function () {
    function Maze(_a) {
        var _b = _a.width, width = _b === void 0 ? 500 : _b, _c = _a.height, height = _c === void 0 ? 500 : _c, _d = _a.mazeLength, mazeLength = _d === void 0 ? 20 : _d, ctx = _a.ctx;
        this.data = [];
        this._width = width;
        this._height = height;
        this._mzLen = mazeLength;
        this._innerBisection = 3;
        this._ctx = ctx;
    }
    Maze.prototype.prepareData = function () {
        for (var r = 0; r < this._mzLen; r++) { // rows
            this.data[r] = []; // init data per row
            for (var c = 0; c < this._mzLen; c++) { // cols
                var cell = void 0;
                // add wall edges (top|left|bottom|right)
                if ((r === 0 || r === (this._mzLen - 1)) ||
                    (c === 0 || c === (this._mzLen - 1))) {
                    cell = new Cell('edge');
                }
                else {
                    // add routes
                    cell = new Cell('e');
                }
                cell.setPosition({ row: r, col: c });
                this.data[r][c] = cell;
            }
        }
    };
    /**
     * Divide & Conquer recursively
     *
     * @return void
     */
    Maze.prototype.carveRecursive = function (x1, x2, y1, y2) {
        var _width = x2 - x1;
        var _height = y2 - y1;
        if (_width >= _height) {
            // bisection vertically
            if (_width > this._innerBisection) {
                var _a = this.calcBisectionMinMax(x1, x2, y2, y1, 'vert'), min = _a.min, max = _a.max, bisection = _a.bisection, rand = _a.rand;
                for (var i = y1 + 1; i < y2; i++) {
                    if (this.data[y2][bisection].value === 'e' &&
                        this.data[y1][bisection].value === 'e') {
                        if (i === max || i === min) {
                            continue;
                        }
                    }
                    else if (i === rand) {
                        continue;
                    }
                    this.data[i][bisection].value = 'w';
                }
                this.carveRecursive(x1, bisection, y1, y2);
                this.carveRecursive(bisection, x2, y1, y2);
            }
        }
        else {
            // bisection horizontally
            if (_height > this._innerBisection) {
                var _b = this.calcBisectionMinMax(y1, y2, x2, x1), min = _b.min, max = _b.max, bisection = _b.bisection, rand = _b.rand;
                for (var i = x1 + 1; i < x2; i++) {
                    if (this.data[bisection][x2].value === 'e' &&
                        this.data[bisection][x1].value === 'e') {
                        if (i === max || i === min) {
                            continue;
                        }
                    }
                    else if (i === rand) {
                        continue;
                    }
                    this.data[bisection][i].value = 'w';
                }
                this.carveRecursive(x1, x2, y1, bisection);
                this.carveRecursive(x1, x2, bisection, y2);
            }
        }
    };
    /**
     * Create data and draw the maze
     */
    Maze.prototype.render = function () {
        // prepare maze data
        if (this.data.length === 0) {
            this.prepareData();
        }
        // generate data
        this.carveRecursive(0, this._mzLen - 1, 0, this._mzLen - 1);
        this._ctx.clearRect(0, 0, this._width, this._height);
        var numRows = this.data.length;
        if (!numRows) {
            return; // No data has been generated
        }
        var numCols = this.data[0].length;
        var cellWidth = this._width / numCols;
        var cellHeight = this._height / numRows;
        var cellLength = cellWidth > cellHeight ? cellHeight : cellWidth;
        // define start spot
        this.startPoint().value = 's';
        // define end spot
        this.endPoint().value = 'f';
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var rectX = col * cellLength;
                var rectY = row * cellLength;
                this._ctx.fillStyle = this.data[row][col].getColor();
                this._ctx.fillRect(rectX, rectY, cellLength, cellLength);
            }
        }
    };
    Maze.prototype.startPoint = function () {
        return this.data[1][1];
    };
    Maze.prototype.endPoint = function () {
        return this.data[this.data.length - 2][this.data.length - 2];
    };
    Maze.prototype.calcBisectionMinMax = function (a, b, c, d, mode) {
        if (mode === void 0) { mode = 'hor'; }
        var bisection = Math.ceil((a + b) / 2);
        var max = c - 1;
        var min = d + 1;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (mode === 'hor') {
            if (this.data[bisection][c].value === 'e') {
                random = max;
            }
            if (this.data[bisection][d].value === 'e') {
                random = min;
            }
        }
        else {
            if (this.data[c][bisection].value === 'e') {
                random = max;
            }
            if (this.data[d][bisection].value === 'e') {
                random = min;
            }
        }
        return {
            min: min,
            max: max,
            bisection: bisection,
            rand: random
        };
    };
    return Maze;
}());
;
