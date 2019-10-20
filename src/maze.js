"use strict";
/// <reference path="cell.ts"/>
// directtions
var TOP_ARROW = 38;
var DOWN_ARROW = 40;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var Maze = /** @class */ (function () {
    function Maze(_a) {
        var _b = _a.width, width = _b === void 0 ? 500 : _b, _c = _a.height, height = _c === void 0 ? 500 : _c, _d = _a.mazeLength, mazeLength = _d === void 0 ? 20 : _d, ctx = _a.ctx;
        this.data = [];
        this._width = width;
        this._height = height;
        this._mzLen = mazeLength;
        this._innerBisection = 3;
        this._ctx = ctx;
        this._cellLength = 0;
        this.start = null;
        this.end = null;
    }
    Maze.prototype.prepareData = function () {
        for (var r = 0; r < this._mzLen; r++) {
            // rows
            this.data[r] = []; // init data per row
            for (var c = 0; c < this._mzLen; c++) {
                // cols
                var cell = void 0;
                // add wall edges (top|left|bottom|right)
                if (r === 0 ||
                    r === this._mzLen - 1 ||
                    (c === 0 || c === this._mzLen - 1)) {
                    cell = new Cell(EDGE_WALL);
                }
                else {
                    // add routes
                    cell = new Cell(ROUTE_WALL);
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
                var _a = this.calcBisectionMinMax(x1, x2, y2, y1, "vert"), min = _a.min, max = _a.max, bisection = _a.bisection, rand = _a.rand;
                for (var i = y1 + 1; i < y2; i++) {
                    if (this.data[y2][bisection].value === ROUTE_WALL &&
                        this.data[y1][bisection].value === ROUTE_WALL) {
                        if (i === max || i === min) {
                            continue;
                        }
                    }
                    else if (i === rand) {
                        continue;
                    }
                    this.data[i][bisection].value = BLACK_WALL;
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
                    if (this.data[bisection][x2].value === ROUTE_WALL &&
                        this.data[bisection][x1].value === ROUTE_WALL) {
                        if (i === max || i === min) {
                            continue;
                        }
                    }
                    else if (i === rand) {
                        continue;
                    }
                    this.data[bisection][i].value = BLACK_WALL;
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
        var cellWidth = Math.floor(this._width / numCols);
        var cellHeight = Math.floor(this._height / numRows);
        var cellLength = cellWidth > cellHeight ? cellHeight : cellWidth;
        this._cellLength = cellLength;
        this.startPoint();
        this.endPoint();
        // define start spot
        if (this.start) {
            this.start.value = STARTER_WALL;
            this.start.row = cellLength;
            this.start.col = cellLength;
        }
        // define end spot
        if (this.end) {
            this.end.value = END_WALL;
        }
        this.draw(numRows, numCols, cellLength);
        // this.move(numRows, numCols, cellLength);
    };
    Maze.prototype.pathfinderBfs = function () {
        var start = this.end;
        if (!start)
            return;
        start.next = null;
        var queue = [start];
        while (queue.length > 0) {
            var currentCell = queue.shift();
            if (currentCell) {
                var neighbors = currentCell.getNeighbors();
                for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
                    var neighbor = neighbors_1[_i];
                    var row = neighbor[0];
                    var col = neighbor[1];
                    if (row >= 1 &&
                        col >= 1 &&
                        row < this.data.length - 1 &&
                        col < this.data[0].length - 1) {
                        var cell = this.data[row][col];
                        if (cell.bgColor === TRANSPARENT_COLOR_NAME &&
                            (cell.value === ROUTE_WALL || cell.value === STARTER_WALL)) {
                            cell.bgColor = ORANGE_COLOR_NAME;
                            cell.next = currentCell;
                            queue.push(cell);
                        }
                    }
                }
                currentCell.bgColor = NONE_COLOR_NAME;
            }
        }
    };
    Maze.prototype.pathfinderDfs = function (root) {
        if (this.isStarterArrived(root)) {
            return;
        }
        if (!root.visited) {
            var neighbors = root.getNeighbors();
            for (var _i = 0, neighbors_2 = neighbors; _i < neighbors_2.length; _i++) {
                var neighbor = neighbors_2[_i];
                var row = neighbor[0];
                var col = neighbor[1];
                if (row >= 1 &&
                    col >= 1 &&
                    row < this.data.length - 1 &&
                    col < this.data[0].length - 1) {
                    var cell = this.data[row][col];
                    if (cell.bgColor === TRANSPARENT_COLOR_NAME &&
                        cell.value === ROUTE_WALL) {
                        if (root.value !== STARTER_WALL) {
                            root.visited = true;
                        }
                        cell.bgColor = BLUE_COLOR_NAME;
                        this.pathfinderDfs(cell);
                    }
                }
            }
        }
    };
    Maze.prototype.draw = function (numRows, numCols, cellLength) {
        this._ctx.clearRect(0, 0, this._width, this._height);
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var rectX = col * cellLength;
                var rectY = row * cellLength;
                var currentCell = this.data[row][col];
                this._ctx.fillStyle = currentCell.getColor();
                this._ctx.fillRect(rectX, rectY, cellLength, cellLength);
            }
        }
    };
    Maze.prototype.startPoint = function () {
        this.start = this.data[1][1];
    };
    Maze.prototype.endPoint = function () {
        this.end = this.data[this.data.length - 2][this.data[0].length - 2];
    };
    Maze.prototype.calcBisectionMinMax = function (a, b, c, d, mode) {
        if (mode === void 0) { mode = "hor"; }
        var bisection = Math.ceil((a + b) / 2);
        var max = c - 1;
        var min = d + 1;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        if (mode === "hor") {
            if (this.data[bisection][c].value === ROUTE_WALL) {
                random = max;
            }
            if (this.data[bisection][d].value === ROUTE_WALL) {
                random = min;
            }
        }
        else {
            if (this.data[c][bisection].value === ROUTE_WALL) {
                random = max;
            }
            if (this.data[d][bisection].value === ROUTE_WALL) {
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
    Maze.prototype.move = function (numRows, numCols, cellLength) {
        var starter = this.start;
        var _self = this;
        if (!starter)
            return;
        document.addEventListener("keyup", function (e) {
            var hasMoved = false;
            switch (e.keyCode) {
                case TOP_ARROW:
                    var topCell = _self.data[starter.y - 1][starter.x];
                    if (topCell.value !== EDGE_WALL && topCell.value !== BLACK_WALL) {
                        starter.row -= cellLength;
                        starter.y -= 1;
                        hasMoved = true;
                    }
                    break;
                case DOWN_ARROW:
                    var bottomCell = _self.data[starter.y + 1][starter.x];
                    if (bottomCell.value !== EDGE_WALL &&
                        bottomCell.value !== BLACK_WALL) {
                        starter.row += cellLength;
                        starter.y += 1;
                        hasMoved = true;
                    }
                    break;
                case LEFT_ARROW:
                    var leftCell = _self.data[starter.y][starter.x - 1];
                    if (leftCell.value !== EDGE_WALL && leftCell.value !== BLACK_WALL) {
                        starter.col -= cellLength;
                        starter.x -= 1;
                        hasMoved = true;
                    }
                    break;
                case RIGHT_ARROW:
                    var rightCell = _self.data[starter.y][starter.x + 1];
                    if (rightCell.value !== EDGE_WALL && rightCell.value !== BLACK_WALL) {
                        starter.col += cellLength;
                        starter.x += 1;
                        hasMoved = true;
                    }
                    break;
            }
            if (hasMoved && starter) {
                // _self.draw(numRows, numCols, cellLength, starter);
                _self.isStarterArrived(starter);
            }
        });
    };
    Maze.prototype.isStarterArrived = function (starter) {
        var endPoint = this.end;
        var hasArrived = this.isAtSamePosition(starter, endPoint);
        if (hasArrived) {
            console.log("Congrats, you did it :)");
        }
        return hasArrived;
    };
    Maze.prototype.isAtSamePosition = function (starter, currentPos) {
        if (!currentPos)
            return false;
        return starter.x === currentPos.x && starter.y === currentPos.y;
    };
    return Maze;
}());
