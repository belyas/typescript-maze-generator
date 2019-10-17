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

class Cell {
  /** @var string holds cell's value to be colored */
  value: string;
  /** @var number cell's row position */
  row: number;
  /** @var number cell's column position */
  col: number;
  x: number;
  y: number;

  constructor(type: string) {
    this.value = type;
    this.row = 0;
    this.col = 0;
    this.x = 0;
    this.y = 0;
  }

  /**
   * Get cell specific color
   *
   * @return string
   */
  getColor(): string {
    let color: string;

    switch (this.value) {
      case "w":
        color = "#212121";
        break;
      case "e":
        color = "#fff";
        break;
      case "s":
        color = "#22cc5b";
        break;
      case "f":
        color = "#e52727";
        break;
      default:
        color = "gray";
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
}
