const regenerateMaze = document.getElementById("maze");
const pathSolver = document.getElementById("path-solver");
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

const pathSolverFn = () => {
  PpMaze.pathfinder();

  if (!PpMaze.data.length || !PpMaze.start) return;

  let currentCell = PpMaze.start.prev;

  function drawPath() {
    if (currentCell && !PpMaze.isAtSamePosition(currentCell, PpMaze.end)) {
      currentCell.value = PATH_WALL;

      PpMaze.draw(
        PpMaze.data.length,
        PpMaze.data[0].length,
        PpMaze._cellLength
      );

      if (!currentCell.prev) {
        return;
      }

      currentCell = currentCell.prev;
      requestAnimationFrame(drawPath);
    }
  }

  requestAnimationFrame(drawPath);
};

renderMaze();

regenerateMaze.addEventListener("click", renderMaze);
pathSolver.addEventListener("click", pathSolverFn);
