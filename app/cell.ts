interface CellPosition {
  readonly row: number;
  readonly col: number;
}

// spots
const STARTER_WALL = "s";
const END_WALL = "f";
const ROUTE_WALL = "e";
const BLACK_WALL = "w";
const EDGE_WALL = "edge";
const PATH_WALL = "p";
const DFS_PATH_WALL = "dp";
// colors
const BLACK_COLOR = "#212121";
const WHITE_COLOR = "#ffffff";
const GREEN_COLOR = "#22cc5b";
const RED_COLOR = "#e52727";
const ORANGE_COLOR = "#FFA500";
const BLUE_COLOR = "#87CEEB";
const GRAY_COLOR = "#808080";

const TRANSPARENT_COLOR_NAME = "trans";
const BLUE_COLOR_NAME = "blue";
const ORANGE_COLOR_NAME = "orange";
const NONE_COLOR_NAME = "none";

class Cell {
  /** @var string holds cell's value to be colored */
  value: string;
  /** @var number cell's row position */
  row: number;
  /** @var number cell's column position */
  col: number;
  x: number;
  y: number;
  bgColor: string;
  next: Cell | null;
  visited: boolean;

  constructor(type: string) {
    this.value = type;
    this.row = 0;
    this.col = 0;
    this.x = 0;
    this.y = 0;
    this.next = null;
    this.bgColor = "trans";
    this.visited = false;
  }

  /**
   * Get cell specific color
   *
   * @return string
   */
  getColor(): string {
    let color: string;

    switch (this.value) {
      case BLACK_WALL:
        color = BLACK_COLOR;
        break;
      case ROUTE_WALL:
        color = WHITE_COLOR;
        break;
      case STARTER_WALL:
        color = GREEN_COLOR;
        break;
      case END_WALL:
        color = RED_COLOR;
        break;
      case PATH_WALL:
        color = ORANGE_COLOR;
        break;
      case DFS_PATH_WALL:
        color = BLUE_COLOR;
        break;
      default:
        color = GRAY_COLOR;
        break;
    }

    return color;
  }

  /**
   * Set cell's row|colun
   *
   * @return void
   */
  setPosition(position: CellPosition): void {
    this.row = position.row;
    this.col = position.col;
    this.x = position.col;
    this.y = position.row;
  }

  getNeighbors(): number[][] {
    return [
      [this.y - 1, this.x],
      [this.y, this.x - 1],
      [this.y, this.x + 1],
      [this.y + 1, this.x]
    ];
  }
}
