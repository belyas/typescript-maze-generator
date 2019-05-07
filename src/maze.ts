/// <reference path="cell.ts"/>

interface MazeInterface {
    readonly width: number;
    readonly height: number;
    readonly mazeLength: number;
    ctx: any;
}

class Maze {
    /** @var any holds maze's positions */
    data: any[];
    /** @var number maze's width */
    _width: number;
    /** @var number maze's height */
    _height: number;
    /** @var number cell's length */
    _mzLen: number;
    /** @var number min division */
    _innerBisection: number;
    /** @var any|object Canvas context */
    _ctx: any;

    constructor ({ width = 500, height = 500, mazeLength = 20, ctx }: MazeInterface) {
        this.data = [];
        this._width = width;
        this._height = height;
        this._mzLen = mazeLength;
        this._innerBisection = 3;
        this._ctx = ctx;
    }

    prepareData () {
        for (let r = 0; r < this._mzLen; r++) { // rows
            this.data[r] = []; // init data per row

            for (let c = 0; c < this._mzLen; c++) { // cols
                let cell;
                // add wall edges (top|left|bottom|right)
                if ((r === 0 || r === (this._mzLen - 1)) ||
                    (c === 0 || c === (this._mzLen - 1))) {
                    cell = new Cell('edge');
                } else {
                    // add routes
                    cell = new Cell('e');
                }

                cell.setPosition({ row: r, col: c });
                this.data[r][c] = cell;
            }
        }
    }

    /**
     * Divide & Conquer recursively
     * 
     * @return void
     */
    carveRecursive (x1: number, x2: number, y1: number, y2: number): void {
        let _width = x2 - x1;
        let _height = y2 - y1;

        if (_width >= _height) {
            // bisection vertically
            if (_width > this._innerBisection) {
                let { min, max, bisection, rand } = this.calcBisectionMinMax(x1, x2, y2, y1, 'vert');

                for (let i = y1 + 1; i < y2; i++) {
                    if (this.data[y2][bisection].value === 'e' &&
                        this.data[y1][bisection].value === 'e') {
                        if (i === max || i === min) {
                            continue;
                        }
                    } else if (i === rand) {
                        continue;
                    }

                    this.data[i][bisection].value = 'w';
                }

                this.carveRecursive(x1, bisection, y1, y2);
                this.carveRecursive(bisection, x2, y1, y2);
            }
        } else {
            // bisection horizontally
            if (_height > this._innerBisection) {
                let { min, max, bisection, rand } = this.calcBisectionMinMax(y1, y2, x2, x1);

                for (let i = x1 + 1; i < x2; i++) {
                    if (this.data[bisection][x2].value === 'e' &&
                        this.data[bisection][x1].value === 'e') {
                        if (i === max || i === min) {
                            continue;
                        }
                    } else if (i === rand) {
                        continue;
                    }

                    this.data[bisection][i].value = 'w';
                }

                this.carveRecursive(x1, x2, y1, bisection);
                this.carveRecursive(x1, x2, bisection, y2);
            }
        }
    }

    /**
     * Create data and draw the maze
     */
    render (): void {
        // prepare maze data
        if (this.data.length === 0) {
            this.prepareData();
        }

        // generate data
        this.carveRecursive(0, this._mzLen - 1, 0, this._mzLen - 1);

        this._ctx.clearRect(0, 0, this._width, this._height);

        let numRows = this.data.length;

        if (!numRows) {
            return; // No data has been generated
        }

        let numCols = this.data[0].length;
        let cellWidth = this._width / numCols;
        let cellHeight = this._height / numRows;
        let cellLength = cellWidth > cellHeight ? cellHeight : cellWidth;

        // define start spot
        this.startPoint().value = 's';

        // define end spot
        this.endPoint().value = 'f';

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let rectX = col * cellLength;
                let rectY = row * cellLength;

                this._ctx.fillStyle = this.data[row][col].getColor();
                this._ctx.fillRect(rectX, rectY, cellLength, cellLength);
            }
        }
    }

    startPoint () {
        return this.data[1][1];
    }

    endPoint () {
        return this.data[this.data.length - 2][this.data.length - 2];
    }

    calcBisectionMinMax (a: number, b: number, c: number, d: number, mode: string = 'hor') {
        let bisection = Math.ceil((a + b) / 2);
        let max = c - 1;
        let min = d + 1;
        let random = Math.floor(Math.random() * (max - min + 1)) + min;

        if (mode === 'hor') {
            if (this.data[bisection][c].value === 'e') {
                random = max;
            }

            if (this.data[bisection][d].value === 'e') {
                random = min;
            }
        } else {
            if (this.data[c][bisection].value === 'e') {
                random = max;
            }

            if (this.data[d][bisection].value === 'e') {
                random = min;
            }
        }

        return {
            min,
            max,
            bisection,
            rand: random
        };
    }
};
