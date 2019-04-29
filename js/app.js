(function (Cell) {
    if (typeof Cell === "undefined") {
        alert('Cell class is missing');
        return;
    }

    const regenerateMaze = document.getElementById('regenerateMaze');
    const canvas = document.getElementById('pp-maze');
    const ctx = canvas.getContext('2d');
    const MAZE_SIZE_LEN = 30;
    const WIDTH = 500;
    const HEIGHT = 500;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    class Maze {
        constructor({ width = 500, height = 500, mazeLength = 20 }) {
            this.data = [];
            this._width = width;
            this._height = height;
            this._mzLen = mazeLength;
            this._innerBisection = 3;
        }

        prepareData() {
            for (let r = 0; r < this._mzLen; r++) { // rows
                this.data[r] = []; // init data per row

                for (let c = 0; c < this._mzLen; c++) { // cols
                    let cell;
                    // add wall edges (top|left|bottom|right)
                    if ((r === 0 || r === (this._mzLen - 1))
                        || (c === 0 || c === (this._mzLen - 1))) {
                        cell = new Cell('edge');
                    } else {
                        // add routes
                        cell = new Cell('e');
                    }

                    cell.setPosition(r, c);
                    this.data[r][c] = cell;
                }
            }
        }

        carveRecursive(x1, x2, y1, y2) { // Divide & Conquer
            let _width = x2 - x1;
            let _height = y2 - y1;

            // prepare maze data
            if (this.data.length === 0) {
                this.prepareData();
            }

            if (_width >= _height) {
                // bisection vertically
                if (_width > this._innerBisection) {
                    let { min, max, bisection, rand } = this.calcBisectionMinMax(x1, x2, y2, y1, 'vert');

                    for (let i = y1 + 1; i < y2; i++) {
                        if (this.data[y2][bisection].value === "e"
                            && this.data[y1][bisection].value === "e") {
                            if (i === max || i === min) {
                                continue;
                            }
                        } else if (i === rand) {
                            continue;
                        }

                        this.data[i][bisection].value = "w";
                    }

                    this.carveRecursive(x1, bisection, y1, y2);
                    this.carveRecursive(bisection, x2, y1, y2);
                }
            } else {
                // bisection horizontally
                if (_height > this._innerBisection) {
                    let { min, max, bisection, rand } = this.calcBisectionMinMax(y1, y2, x2, x1);

                    for (let i = x1 + 1; i < x2; i++) {
                        if (this.data[bisection][x2].value === "e"
                            && this.data[bisection][x1].value === "e") {
                            if (i === max || i === min) {
                                continue;
                            }
                        } else if (i === rand) {
                            continue;
                        }

                        this.data[bisection][i].value = "w";
                    }

                    this.carveRecursive(x1, x2, y1, bisection);
                    this.carveRecursive(x1, x2, bisection, y2);
                }
            }
        }

        render() {
            // generate data
            this.carveRecursive(0, this._mzLen - 1, 0, this._mzLen - 1);

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            let numRows = this.data.length;

            if (!numRows) {
                return; // No data has been generated
            }

            let numCols = this.data[0].length;
            let cellWidth = WIDTH / numCols;
            let cellHeight = HEIGHT / numRows;
            let cellLength = cellWidth > cellHeight ? cellHeight : cellWidth;

            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    let rectX = col * cellLength;
                    let rectY = row * cellLength;
                    ctx.fillStyle = this.data[row][col].getColor();

                    ctx.fillRect(rectX, rectY, cellLength, cellLength);
                }
            }
        }

        calcBisectionMinMax (a, b, c, d, mode = 'hor') {
            let bisection = Math.ceil((a + b) / 2);
            let max = c - 1;
            let min = d + 1;
            let random = Math.floor(Math.random() * (max - min + 1)) + min;

            if (mode === 'hor') {
                if (this.data[bisection][c].value === "e") {
                    random = max;
                }
                
                if (this.data[bisection][d].value === "e") {
                    random = min;
                }
            } else {
                if (this.data[c][bisection].value === "e") {
                    random = max;
                }

                if (this.data[d][bisection].value === "e") {
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
    }

    const renderMaze = () => {
        const configs = {
            width: WIDTH,
            height: HEIGHT,
            mazeLength: MAZE_SIZE_LEN
        };
        const PpMaze = new Maze(configs);
        PpMaze.render();
    };

    renderMaze();

    regenerateMaze.addEventListener('click', renderMaze);
})(window.Cell);