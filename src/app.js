const regenerateMaze = document.getElementById("maze");
const bfsPathSolver = document.getElementById("bfs-path-solver");
const dfsPathSolver = document.getElementById("dfs-path-solver");
const pathClearer = document.getElementById("path-clearer");
const canvas = document.getElementById("pp-maze");
const ctx = canvas.getContext("2d");
const MAZE_SIZE_LEN = 30;
const WIDTH = 500;
const HEIGHT = 500;
canvas.width = WIDTH;
canvas.height = HEIGHT;
let PpMaze;

const configs = {
  width: WIDTH,
  height: HEIGHT,
  mazeLength: MAZE_SIZE_LEN,
  ctx
};

const renderMaze = () => {
  PpMaze = new Maze(configs);
  PpMaze.render();
};

const pathSolverBfsFn = () => {
  pathClearerFn();
  PpMaze.pathfinderBfs();

  if (!PpMaze.data.length || !PpMaze.start) return;

  let currentCell = PpMaze.start.next;

  function drawPath() {
    if (currentCell && !PpMaze.isAtSamePosition(currentCell, PpMaze.end)) {
      currentCell.value = PATH_WALL;

      PpMaze.draw(
        PpMaze.data.length,
        PpMaze.data[0].length,
        PpMaze._cellLength
      );

      if (!currentCell.next) {
        return;
      }

      currentCell = currentCell.next;
      requestAnimationFrame(drawPath);
    }
  }

  requestAnimationFrame(drawPath);
};

const pathClearerFn = () => {
  PpMaze._ctx.clearRect(0, 0, PpMaze._width, PpMaze._height);

  for (let row = 0, rowsLen = PpMaze.data.length; row < rowsLen; row++) {
    for (let col = 0, numCols = PpMaze.data[0].length; col < numCols; col++) {
      let rectX = col * PpMaze._cellLength;
      let rectY = row * PpMaze._cellLength;
      let currentCell = PpMaze.data[row][col];

      if (
        currentCell.value === PATH_WALL ||
        currentCell.value === DFS_PATH_WALL
      ) {
        currentCell.value = ROUTE_WALL;
      }

      currentCell.visited = false;
      currentCell.bgColor = TRANSPARENT_COLOR_NAME;

      PpMaze._ctx.fillStyle = currentCell.getColor();

      PpMaze._ctx.fillRect(
        rectX,
        rectY,
        PpMaze._cellLength,
        PpMaze._cellLength
      );
    }
  }
};

const pathSolverDfsFn = () => {
  pathClearerFn();
  PpMaze.startPoint();

  if (!PpMaze.data.length || !PpMaze.start) return;

  PpMaze.pathfinderDfs(PpMaze.start);

  let counter = 1;
  let interVal;

  function drawPath() {
    if (MAZE_SIZE_LEN === counter) {
      counter = 1;
      clearInterval(interVal);
      return false;
    }

    for (let index = 1; index < MAZE_SIZE_LEN; index++) {
      const currentCell = PpMaze.data[index][counter];

      if (currentCell.visited || currentCell.bgColor === BLUE_COLOR_NAME) {
        currentCell.value = DFS_PATH_WALL;
      }

      PpMaze.draw(
        PpMaze.data.length,
        PpMaze.data[0].length,
        PpMaze._cellLength
      );
    }
    counter++;
  }

  interVal = setInterval(() => {
    drawPath();
  }, 1000 / 10);
};

renderMaze();

regenerateMaze.addEventListener("click", renderMaze);
bfsPathSolver.addEventListener("click", pathSolverBfsFn);
dfsPathSolver.addEventListener("click", pathSolverDfsFn);
pathClearer.addEventListener("click", pathClearerFn);
