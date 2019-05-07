const regenerateMaze = document.getElementById('regenerateMaze');
const canvas = document.getElementById('pp-maze');
const ctx = canvas.getContext('2d');
const MAZE_SIZE_LEN = 30;
const WIDTH = 500;
const HEIGHT = 500;
canvas.width = WIDTH;
canvas.height = HEIGHT;

const renderMaze = () => {
    const configs = {
        width: WIDTH,
        height: HEIGHT,
        mazeLength: MAZE_SIZE_LEN,
        ctx
    };
    const PpMaze = new Maze(configs);
    PpMaze.render();
};

renderMaze();

regenerateMaze.addEventListener('click', renderMaze);
