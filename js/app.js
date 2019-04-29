(function(Cell){
    const canvas = document.getElementById("pp-maze");
    const ctx = canvas.getContext("2d");
    const MAZE_SIZE_LEN = 30;
    const WIDTH = 500;
    const HEIGHT = 500;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    class Maze {
        constructor ({width = 500, height = 500, mazeLength = 20}) {
            this.data = [];
            this._width = width;
            this._height = height;
            this._mzLen = mazeLength;
            this._innerBisection = 3;
        }

        prepareData () {
            for (let r = 0; r < this._mzLen; r++) { // rows
                this.data.push([]); // init data per row
    
                for (let c = 0; c < this._mzLen; c++) { // cols
                    // add wall edges (top|left|bottom|right)
                    if ((r === 0 || r === (this._mzLen - 1) )
                        || (c === 0 || c === (this._mzLen - 1))) {
                        let cell = new Cell('edge');
                        cell.setPosition(r, c);
                        this.data[r].push(cell);
                    } else {
                        // add routes
                        let cell = new Cell('e');
                        cell.setPosition(r, c);
                        this.data[r].push(cell);
                    }
                }
            }
        }

        carveRecursive (x1, x2, y1, y2) { // Divide & Conquer
            let _width = x2 - x1;
            let _height = y2 - y1;
    
            // prepare maze data
            if (this.data.length === 0) {
                this.prepareData();
            }
    
            if (_width >= _height) {
                // bisection vertically
                if (_width > this._innerBisection) {
                    // get the bisection of the current width
                    let bisection = Math.ceil((x1 + x2) / 2);
                    let max = y2 - 1;
                    let min = y1 + 1;
                    let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
    
                    if (this.data[y2][bisection].value === "e") {
                        randomPassage = max;
                    }
                    if (this.data[y1][bisection].value === "e") {
                        randomPassage = min;
                    }

                    for (let i = y1 + 1; i < y2; i++) {
                        if (this.data[y2][bisection].value === "e"
                            && this.data[y1][bisection].value === "e") {
                            if (i === max || i === min) {
                                continue;
                            }
                        }  else if (i === randomPassage) {
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
                    let bisection = Math.ceil((y1 + y2) / 2);
                    let max = x2 - 1;
                    let min = x1 + 1;
                    let randomPassage = Math.floor(Math.random() * (max - min + 1)) + min;
    
                    if (this.data[bisection][x2].value === "e") {
                        randomPassage = max;
                    }
    
                    if (this.data[bisection][x1].value === "e") {
                        randomPassage = min;
                    }
    
                    for (let i = x1+1; i < x2; i++) {
                        if (this.data[bisection][x2].value === "e"
                            && this.data[bisection][x1].value === "e") {
                            if (i === max || i === min){
                                continue;
                            }
                        } else if (i === randomPassage){
                            continue;
                        }

                        this.data[bisection][i].value = "w";
                    }

                    this.carveRecursive(x1, x2, y1, bisection);
                    this.carveRecursive(x1, x2, bisection, y2);
                }
            }
        }

        render () {
            // generate data
            this.carveRecursive(0, this._mzLen - 1, 0, this._mzLen - 1);

            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            let numRows = this.data.length;
    
            if (!numRows) {
                return; // No data has been genereated
            }
    
            let numCols    = this.data[0].length;
            let cellWidth  = WIDTH / numCols;
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
    }

    const configs = {
        width: WIDTH,
        height: HEIGHT,
        mazeLength: MAZE_SIZE_LEN
    };
    const PpMaze = new Maze(configs);

    PpMaze.render();
})(window.Cell);