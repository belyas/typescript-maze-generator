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
  _cellLength: number;
  start: Cell | null;
  end: Cell | null;

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
    this._cellLength = 0;
    this.start = null;
    this.end = null;
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
  }

  pathfinderBfs() {
    let start = this.end;

    if (!start) return;

    start.next = null;
    let queue: Cell[] = [start];

    while (queue.length > 0) {
      let currentCell = queue.shift();

      if (currentCell) {
        let neighbors = currentCell.getNeighbors();

        for (let neighbor of neighbors) {
          let row = neighbor[0];
          let col = neighbor[1];

          if (
            row >= 1 &&
            col >= 1 &&
            row < this.data.length - 1 &&
            col < this.data[0].length - 1
          ) {
            let cell = this.data[row][col];

            if (
              cell.bgColor === TRANSPARENT_COLOR_NAME &&
              (cell.value === ROUTE_WALL || cell.value === STARTER_WALL)
            ) {
              cell.bgColor = ORANGE_COLOR_NAME;
              cell.next = currentCell;
              queue.push(cell);
            }
          }
        }

        currentCell.bgColor = NONE_COLOR_NAME;
      }
    }
  }

  pathfinderDfs(root: Cell) {
    if (this.isStarterArrived(root)) {
      return;
    }

    if (!root.visited) {
      let neighbors = root.getNeighbors();
      for (let neighbor of neighbors) {
        let row = neighbor[0];
        let col = neighbor[1];

        if (
          row >= 1 &&
          col >= 1 &&
          row < this.data.length - 1 &&
          col < this.data[0].length - 1
        ) {
          let cell = this.data[row][col];

          if (
            cell.bgColor === TRANSPARENT_COLOR_NAME &&
            cell.value === ROUTE_WALL
          ) {
            if (root.value !== STARTER_WALL) {
              root.visited = true;
            }

            cell.bgColor = BLUE_COLOR_NAME;
            this.pathfinderDfs(cell);
          }
        }
      }
    }
  }

  draw(numRows: number, numCols: number, cellLength: number) {
    this._ctx.clearRect(0, 0, this._width, this._height);

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        let rectX = col * cellLength;
        let rectY = row * cellLength;
        let currentCell = this.data[row][col];

        this._ctx.fillStyle = currentCell.getColor();

        this._ctx.fillRect(rectX, rectY, cellLength, cellLength);
      }
    }
  }

  startPoint(): void {
    this.start = this.data[1][1];
  }

  endPoint(): void {
    this.end = this.data[this.data.length - 2][this.data[0].length - 2];
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

  move(numRows: number, numCols: number, cellLength: number): void {
    const starter = this.start;
    const _self = this;

    if (!starter) return;

    document.addEventListener("keyup", function(e) {
      let hasMoved = false;
      switch (e.keyCode) {
        case TOP_ARROW:
          const topCell = _self.data[starter.y - 1][starter.x];

          if (topCell.value !== EDGE_WALL && topCell.value !== BLACK_WALL) {
            starter.row -= cellLength;
            starter.y -= 1;
            hasMoved = true;
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
            hasMoved = true;
          }
          break;
        case LEFT_ARROW:
          const leftCell = _self.data[starter.y][starter.x - 1];

          if (leftCell.value !== EDGE_WALL && leftCell.value !== BLACK_WALL) {
            starter.col -= cellLength;
            starter.x -= 1;
            hasMoved = true;
          }
          break;
        case RIGHT_ARROW:
          const rightCell = _self.data[starter.y][starter.x + 1];

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
  }

  isStarterArrived(starter: Cell): boolean {
    const endPoint = this.end;
    const hasArrived = this.isAtSamePosition(starter, endPoint);

    if (hasArrived) {
      console.log("Congrats, you did it :)");
    }

    return hasArrived;
  }

  isAtSamePosition(starter: Cell, currentPos: Cell | null): boolean {
    if (!currentPos) return false;
    return starter.x === currentPos.x && starter.y === currentPos.y;
  }
}
