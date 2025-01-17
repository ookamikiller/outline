const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = [
    null,
    "cyan",
    "blue",
    "orange",
    "yellow",
    "green",
    "purple",
    "red"
];

const SHAPES = [
    [],
    [[1, 1, 1, 1]],                            // I
    [[2, 0, 0], [2, 2, 2]],                    // J
    [[0, 0, 3], [3, 3, 3]],                    // L
    [[4, 4], [4, 4]],                          // O
    [[0, 5, 5], [5, 5, 0]],                    // S
    [[0, 6, 0], [6, 6, 6]],                    // T
    [[7, 7, 0], [0, 7, 7]]                     // Z
];

let board = createBoard();
let currentPiece = randomPiece();
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function drawBlock(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(x, y, COLORS[value]);
            }
        });
    });
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(piece.x + x, piece.y + y, COLORS[value]);
            }
        });
    });
}

function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = value;
            }
        });
    });
}

function collide() {
    return currentPiece.shape.some((row, y) =>
        row.some((value, x) =>
            value &&
            (board[currentPiece.y + y] && board[currentPiece.y + y][currentPiece.x + x]) !== 0
        )
    );
}

function rotatePiece(piece) {
    const rotated = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );
    piece.shape = rotated;
}

function movePiece(dir) {
    currentPiece.x += dir;
    if (collide()) currentPiece.x -= dir;
}

function dropPiece() {
    currentPiece.y++;
    if (collide()) {
        currentPiece.y--;
        mergePiece();
        currentPiece = randomPiece();
        if (collide()) {
            board = createBoard(); // ゲームオーバー
        }
    }
    dropCounter = 0;
}

function randomPiece() {
    const typeId = Math.floor(Math.random() * (SHAPES.length - 1)) + 1;
    return {
        shape: SHAPES[typeId],
        x: Math.floor(COLS / 2) - 1,
        y: 0
    };
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        dropPiece();
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece);

    requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") movePiece(-1);
    else if (event.key === "ArrowRight") movePiece(1);
    else if (event.key === "ArrowDown") dropPiece();
    else if (event.key === "ArrowUp") rotatePiece(currentPiece);
});

update();