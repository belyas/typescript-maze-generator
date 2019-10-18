/// <reference path="cell.ts"/>

interface MazeInterface {
  readonly width: number;
  readonly height: number;
  readonly mazeLength: number;
  ctx: any;
}

// directtions
const TOP_ARROW = 38;
const DOWN_ARROW = 40;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;

class Maze {
  /** @var any holds maze's positions */
  data: Cell[][];
  /** @var number maze's width */
  _width: number;
  /** @var number maze's height */
  _height: number;
  /** @var number cell's length */
  _mzLen: number;
  /** @var number min division */
  _innerBisection: number;
  /** @var any|object Canvas context */
  _ctx: CanvasRenderingContext2D;

  constructor({
    width = 500,
    height = 500,
    mazeLength = 20,
    ctx
  }: MazeInterface) {
    this.data = [];
    this._width = width;
    this._height = height;
    this._mzLen = mazeLength;
    this._innerBisection = 3;
    this._ctx = ctx;
  }

  prepareData() {
    for (let r = 0; r < this._mzLen; r++) {
      // rows
      this.data[r] = []; // init data per row

      for (let c = 0; c < this._mzLen; c++) {
        // cols
        let cell: Cell;

        // add wall edges (top|left|bottom|right)
        if (
          r === 0 ||
          r === this._mzLen - 1 ||
          (c === 0 || c === this._mzLen - 1)
        ) {
          cell = new Cell(EDGE_WALL);
        } else {
          // add routes
          cell = new Cell(ROUTE_WALL);
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
  carveRecursive(x1: number, x2: number, y1: number, y2: number): void {
    let _width = x2 - x1;
    let _height = y2 - y1;

    if (_width >= _height) {
      // bisection vertically
      if (_width > this._innerBisection) {
        let { min, max, bisection, rand } = this.calcBisectionMinMax(
          x1,
          x2,
          y2,
          y1,
          "vert"
        );

        for (let i = y1 + 1; i < y2; i++) {
          if (
            this.data[y2][bisection].value === ROUTE_WALL &&
            this.data[y1][bisection].value === ROUTE_WALL
          ) {
            if (i === max || i === min) {
              continue;
            }
          } else if (i === rand) {
            continue;
          }

          this.data[i][bisection].value = BLACK_WALL;
        }

        this.carveRecursive(x1, bisection, y1, y2);
        this.carveRecursive(bisection, x2, y1, y2);
      }
    } else {
      // bisection horizontally
      if (_height > this._innerBisection) {
        let { min, max, bisection, rand } = this.calcBisectionMinMax(
          y1,
          y2,
          x2,
          x1
        );

        for (let i = x1 + 1; i < x2; i++) {
          if (
            this.data[bisection][x2].value === ROUTE_WALL &&
            this.data[bisection][x1].value === ROUTE_WALL
          ) {
            if (i === max || i === min) {
              continue;
            }
          } else if (i === rand) {
            continue;
          }

          this.data[bisection][i].value = BLACK_WALL;
        }

        this.carveRecursive(x1, x2, y1, bisection);
        this.carveRecursive(x1, x2, bisection, y2);
      }
    }
  }

  /**
   * Create data and draw the maze
   */
  render(): void {
    // prepare maze data
    if (this.data.length === 0) {
      this.prepareData();
    }

    // generate data
    this.carveRecursive(0, this._mzLen - 1, 0, this._mzLen - 1);

    this._ctx.clearRect(0, 0, this._width, this._height);

    const numRows = this.data.length;

    if (!numRows) {
      return; // No data has been generated
    }

    let numCols = this.data[0].length;
    let cellWidth = Math.floor(this._width / numCols);
    let cellHeight = Math.floor(this._height / numRows);
    let cellLength = cellWidth > cellHeight ? cellHeight : cellWidth;

    // define start spot
    const starter = this.startPoint();
    starter.value = STARTER_WALL;
    starter.row = cellLength;
    starter.col = cellLength;

    // define end spot
    this.endPoint().value = END_WALL;

    this.draw(numRows, numCols, cellLength, starter);

    this.move(this._width, this._height, numRows, numCols, cellLength);
  }

  draw(
    numRows: number,
    numCols: number,
    cellLength: number,
    starterPosition: Cell
  ) {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        let rectX = col * cellLength;
        let rectY = row * cellLength;
        let currentCell = this.data[row][col];

        if (currentCell.value === STARTER_WALL) {
          currentCell = starterPosition;
          rectY = currentCell.row;
          rectX = currentCell.col;
        }

        if (currentCell.value === ROUTE_WALL) {
          this._ctx.fillStyle = "transparent";
        } else {
          this._ctx.fillStyle = currentCell.getColor();
        }

        this._ctx.fillRect(rectX, rectY, cellLength, cellLength);
      }
    }
  }

  startPoint() {
    return this.data[1][1];
  }

  endPoint() {
    return this.data[this.data.length - 2][this.data.length - 2];
  }

  calcBisectionMinMax(
    a: number,
    b: number,
    c: number,
    d: number,
    mode: string = "hor"
  ) {
    let bisection = Math.ceil((a + b) / 2);
    let max = c - 1;
    let min = d + 1;
    let random = Math.floor(Math.random() * (max - min + 1)) + min;

    if (mode === "hor") {
      if (this.data[bisection][c].value === ROUTE_WALL) {
        random = max;
      }

      if (this.data[bisection][d].value === ROUTE_WALL) {
        random = min;
      }
    } else {
      if (this.data[c][bisection].value === ROUTE_WALL) {
        random = max;
      }

      if (this.data[d][bisection].value === ROUTE_WALL) {
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

  move(
    width: number,
    height: number,
    numRows: number,
    numCols: number,
    cellLength: number
  ): void {
    const starter = this.startPoint();
    const _self = this;

    document.addEventListener("keyup", function(e) {
      switch (e.keyCode) {
        case TOP_ARROW:
          const topCell = _self.data[starter.y - 1][starter.x];

          if (topCell.value !== EDGE_WALL && topCell.value !== BLACK_WALL) {
            starter.row -= cellLength;
            starter.y -= 1;

            _self._ctx.clearRect(0, 0, width, height);
            _self.draw(numRows, numCols, cellLength, starter);

            _self.isStarterArrived(starter);
          }
          break;
        case DOWN_ARROW:
          const bottomCell = _self.data[starter.y + 1][starter.x];

          if (
            bottomCell.value !== EDGE_WALL &&
            bottomCell.value !== BLACK_WALL
          ) {
            starter.row += cellLength;
            starter.y += 1;

            _self._ctx.clearRect(0, 0, width, height);
            _self.draw(numRows, numCols, cellLength, starter);

            _self.isStarterArrived(starter);
          }
          break;
        case LEFT_ARROW:
          const leftCell = _self.data[starter.y][starter.x - 1];

          if (leftCell.value !== EDGE_WALL && leftCell.value !== BLACK_WALL) {
            starter.col -= cellLength;
            starter.x -= 1;

            _self._ctx.clearRect(0, 0, width, height);
            _self.draw(numRows, numCols, cellLength, starter);

            _self.isStarterArrived(starter);
          }
          break;
        case RIGHT_ARROW:
          const rightCell = _self.data[starter.y][starter.x + 1];

          if (rightCell.value !== EDGE_WALL && rightCell.value !== BLACK_WALL) {
            starter.col += cellLength;
            starter.x += 1;

            _self._ctx.clearRect(0, 0, width, height);
            _self.draw(numRows, numCols, cellLength, starter);

            _self.isStarterArrived(starter);
          }
          break;
      }
    });
  }

  isStarterArrived(starter: Cell): boolean {
    const endPoint: Cell = this.endPoint();
    const hasArrived = starter.x === endPoint.x && starter.y === endPoint.y;

    if (hasArrived) {
      alert("Congrats, you did it :)");
    }

    return hasArrived;
  }
}
