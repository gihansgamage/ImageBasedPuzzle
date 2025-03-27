const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");
const imageUpload = document.getElementById("imageUpload");

let img = new Image();
let gridSize = 3; // 3x3 puzzle
let pieces = [];
let pieceSize;
let emptyPiece; // Stores the empty space

imageUpload.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

img.onload = function () {
    canvas.width = 300;
    canvas.height = 300;
    pieceSize = canvas.width / gridSize;
    createPuzzlePieces();
    shufflePuzzle();
};

// Create puzzle pieces with an empty space
function createPuzzlePieces() {
    pieces = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            let piece = {
                x: col * pieceSize,
                y: row * pieceSize,
                correctX: col * pieceSize,
                correctY: row * pieceSize
            };
            pieces.push(piece);
        }
    }
    emptyPiece = pieces[pieces.length - 1]; // Set the last piece as empty space
}

// Shuffle puzzle pieces, ensuring solvability
function shufflePuzzle() {
    for (let i = 0; i < 100; i++) {
        let neighbors = getMovablePieces();
        let randomPiece = neighbors[Math.floor(Math.random() * neighbors.length)];
        swapPieces(randomPiece, emptyPiece);
    }
    drawPuzzle();
}

// Get pieces adjacent to the empty space
function getMovablePieces() {
    let neighbors = [];
    pieces.forEach(piece => {
        if (
            (piece.x === emptyPiece.x && Math.abs(piece.y - emptyPiece.y) === pieceSize) ||
            (piece.y === emptyPiece.y && Math.abs(piece.x - emptyPiece.x) === pieceSize)
        ) {
            neighbors.push(piece);
        }
    });
    return neighbors;
}

// Swap two puzzle pieces
function swapPieces(piece1, piece2) {
    let tempX = piece1.x;
    let tempY = piece1.y;
    piece1.x = piece2.x;
    piece1.y = piece2.y;
    piece2.x = tempX;
    piece2.y = tempY;
}

// Draw puzzle pieces, leaving one empty space
function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(piece => {
        if (piece !== emptyPiece) {
            ctx.drawImage(img, piece.correctX, piece.correctY, pieceSize, pieceSize,
                          piece.x, piece.y, pieceSize, pieceSize);
        }
    });
}

// Handle tile movement with mouse click
canvas.addEventListener("click", (e) => {
    let x = e.offsetX, y = e.offsetY;
    let clickedPiece = pieces.find(piece =>
        x > piece.x && x < piece.x + pieceSize &&
        y > piece.y && y < piece.y + pieceSize
    );

    if (clickedPiece && getMovablePieces().includes(clickedPiece)) {
        swapPieces(clickedPiece, emptyPiece);
        drawPuzzle();
        checkSolution();
    }
});

// Check if the puzzle is solved
function checkSolution() {
    let isSolved = pieces.every(piece =>
        piece.x === piece.correctX && piece.y === piece.correctY
    );

    if (isSolved) {
        alert("🎉 Puzzle Solved!");
    }
}

// Reset puzzle to original position
function resetPuzzle() {
    createPuzzlePieces();
    drawPuzzle();
}
