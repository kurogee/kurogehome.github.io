document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const playerTurnDisplay = document.getElementById('player-turn');
    const player1ScoreDisplay = document.getElementById('player1-score');
    const player2ScoreDisplay = document.getElementById('player2-score');
    const resetButton = document.getElementById('resetButton');

    const gridSize = 5; // Number of dots per row/column (e.g., 5 dots = 4x4 boxes)
    const boxSize = 80; // Size of each box in pixels
    const dotRadius = 5;
    const lineWidth = 6;
    const hoverLineWidth = 4;
    const lineMargin = 15; // Clickable area around lines

    canvas.width = boxSize * (gridSize - 1) + dotRadius * 2 * gridSize;
    canvas.height = boxSize * (gridSize - 1) + dotRadius * 2 * gridSize;
    
    // Adjust canvas size for padding around dots
    const boardPadding = 30;
    canvas.width = boxSize * (gridSize - 1) + 2 * boardPadding;
    canvas.height = boxSize * (gridSize - 1) + 2 * boardPadding;


    let currentPlayer = 1; // Player 1 starts
    let player1Score = 0;
    let player2Score = 0;

    let horizontalLines = [];
    let verticalLines = [];
    let boxes = [];

    const playerColors = {
        1: '#E74C3C', // Red
        2: '#3498DB'  // Blue
    };
    const defaultLineColor = '#ddd'; // Light grey for unselected lines
    const hoverLineColor = '#bdc3c7'; // Slightly darker grey for hover

    function getDotPosition(row, col) {
        return {
            x: boardPadding + col * boxSize,
            y: boardPadding + row * boxSize
        };
    }
    
    function initGame() {
        currentPlayer = 1;
        player1Score = 0;
        player2Score = 0;

        horizontalLines = Array(gridSize).fill(null).map(() => Array(gridSize - 1).fill(0)); // 0: no line, 1: P1, 2: P2
        verticalLines = Array(gridSize - 1).fill(null).map(() => Array(gridSize).fill(0));
        boxes = Array(gridSize - 1).fill(null).map(() => Array(gridSize - 1).fill(0)); // 0: no owner, 1: P1, 2: P2
        
        updateStatusDisplay();
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw boxes
        for (let r = 0; r < gridSize - 1; r++) {
            for (let c = 0; c < gridSize - 1; c++) {
                if (boxes[r][c] !== 0) {
                    ctx.fillStyle = playerColors[boxes[r][c]] + '80'; // Semi-transparent
                    const dotTopLeft = getDotPosition(r,c);
                    ctx.fillRect(dotTopLeft.x + lineWidth / 2, dotTopLeft.y + lineWidth / 2, boxSize - lineWidth, boxSize - lineWidth);
                }
            }
        }
        
        // Draw horizontal lines
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize - 1; c++) {
                const dot1 = getDotPosition(r, c);
                const dot2 = getDotPosition(r, c + 1);
                ctx.strokeStyle = horizontalLines[r][c] ? playerColors[horizontalLines[r][c]] : defaultLineColor;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(dot1.x, dot1.y);
                ctx.lineTo(dot2.x, dot2.y);
                ctx.stroke();
            }
        }

        // Draw vertical lines
        for (let r = 0; r < gridSize - 1; r++) {
            for (let c = 0; c < gridSize; c++) {
                const dot1 = getDotPosition(r, c);
                const dot2 = getDotPosition(r + 1, c);
                ctx.strokeStyle = verticalLines[r][c] ? playerColors[verticalLines[r][c]] : defaultLineColor;
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(dot1.x, dot1.y);
                ctx.lineTo(dot2.x, dot2.y);
                ctx.stroke();
            }
        }

        // Draw dots
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const pos = getDotPosition(r, c);
                ctx.fillStyle = '#333'; // Dot color
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, dotRadius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    function drawHoverLine(lineInfo) {
        if (!lineInfo) return;
        drawBoard(); // Redraw base board first

        ctx.strokeStyle = hoverLineColor;
        ctx.lineWidth = hoverLineWidth;
        ctx.beginPath();
        if (lineInfo.type === 'h') {
            const dot1 = getDotPosition(lineInfo.r, lineInfo.c);
            const dot2 = getDotPosition(lineInfo.r, lineInfo.c + 1);
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
        } else { // type === 'v'
            const dot1 = getDotPosition(lineInfo.r, lineInfo.c);
            const dot2 = getDotPosition(lineInfo.r + 1, lineInfo.c);
            ctx.moveTo(dot1.x, dot1.y);
            ctx.lineTo(dot2.x, dot2.y);
        }
        ctx.stroke();
    }


    function updateStatusDisplay() {
        playerTurnDisplay.textContent = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Blue'})`;
        playerTurnDisplay.style.color = playerColors[currentPlayer];
        player1ScoreDisplay.textContent = `Player 1 (Red): ${player1Score}`;
        player2ScoreDisplay.textContent = `Player 2 (Blue): ${player2Score}`;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatusDisplay();
    }

    function checkForNewBoxes(r, c, lineType) {
        let newBoxesFormed = 0;

        if (lineType === 'h') { // Horizontal line at (r, c)
            // Check box above (if r > 0)
            if (r > 0 && horizontalLines[r-1]?.[c] && verticalLines[r-1]?.[c] && verticalLines[r-1]?.[c+1] && !boxes[r-1][c]) {
                boxes[r-1][c] = currentPlayer;
                newBoxesFormed++;
            }
            // Check box below (if r < gridSize - 1)
            if (r < gridSize - 1 && horizontalLines[r+1]?.[c] && verticalLines[r]?.[c] && verticalLines[r]?.[c+1] && !boxes[r][c]) {
                boxes[r][c] = currentPlayer;
                newBoxesFormed++;
            }
        } else { // Vertical line at (r, c) (lineType === 'v')
            // Check box to the left (if c > 0)
            if (c > 0 && verticalLines[r]?.[c-1] && horizontalLines[r]?.[c-1] && horizontalLines[r+1]?.[c-1] && !boxes[r][c-1]) {
                boxes[r][c-1] = currentPlayer;
                newBoxesFormed++;
            }
            // Check box to the right (if c < gridSize - 1)
            if (c < gridSize - 1 && verticalLines[r]?.[c+1] && horizontalLines[r]?.[c] && horizontalLines[r+1]?.[c] && !boxes[r][c]) {
                boxes[r][c] = currentPlayer;
                newBoxesFormed++;
            }
        }
        
        if (newBoxesFormed > 0) {
            if (currentPlayer === 1) player1Score += newBoxesFormed;
            else player2Score += newBoxesFormed;
            updateStatusDisplay();
        }
        return newBoxesFormed > 0;
    }
    
    function getClickedLine(mouseX, mouseY) {
        // Check horizontal lines
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize - 1; c++) {
                if (horizontalLines[r][c] === 0) { // Only check unselected lines
                    const dot1 = getDotPosition(r, c);
                    const dot2 = getDotPosition(r, c + 1);
                    // Check if click is near the horizontal line segment
                    if (mouseY >= dot1.y - lineMargin && mouseY <= dot1.y + lineMargin &&
                        mouseX >= dot1.x + lineMargin && mouseX <= dot2.x - lineMargin) {
                        return { type: 'h', r, c };
                    }
                }
            }
        }

        // Check vertical lines
        for (let r = 0; r < gridSize - 1; r++) {
            for (let c = 0; c < gridSize; c++) {
                 if (verticalLines[r][c] === 0) { // Only check unselected lines
                    const dot1 = getDotPosition(r, c);
                    const dot2 = getDotPosition(r + 1, c);
                    // Check if click is near the vertical line segment
                    if (mouseX >= dot1.x - lineMargin && mouseX <= dot1.x + lineMargin &&
                        mouseY >= dot1.y + lineMargin && mouseY <= dot2.y - lineMargin) {
                        return { type: 'v', r, c };
                    }
                }
            }
        }
        return null; // No line clicked
    }

    function checkGameOver() {
        let totalBoxes = (gridSize - 1) * (gridSize - 1);
        let capturedBoxes = player1Score + player2Score;
        if (capturedBoxes === totalBoxes) {
            let winnerMessage;
            if (player1Score > player2Score) {
                winnerMessage = "Player 1 (Red) Wins!";
            } else if (player2Score > player1Score) {
                winnerMessage = "Player 2 (Blue) Wins!";
            } else {
                winnerMessage = "It's a Draw!";
            }
            setTimeout(() => alert(`Game Over!\n${winnerMessage}`), 100); // Delay alert slightly
            return true;
        }
        return false;
    }

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const lineInfo = getClickedLine(mouseX, mouseY);
        if (lineInfo) {
            if (lineInfo.type === 'h' && horizontalLines[lineInfo.r][lineInfo.c] === 0) {
                 drawHoverLine(lineInfo);
            } else if (lineInfo.type === 'v' && verticalLines[lineInfo.r][lineInfo.c] === 0) {
                 drawHoverLine(lineInfo);
            } else {
                drawBoard(); // Redraw to remove hover if line is already taken or not a valid hover spot
            }
        } else {
            drawBoard(); // Redraw to remove any lingering hover effect
        }
    });
    
    canvas.addEventListener('mouseout', () => {
        drawBoard(); // Redraw to remove hover effect when mouse leaves canvas
    });


    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const lineInfo = getClickedLine(mouseX, mouseY);

        if (lineInfo) {
            let lineChanged = false;
            if (lineInfo.type === 'h' && horizontalLines[lineInfo.r][lineInfo.c] === 0) {
                horizontalLines[lineInfo.r][lineInfo.c] = currentPlayer;
                lineChanged = true;
            } else if (lineInfo.type === 'v' && verticalLines[lineInfo.r][lineInfo.c] === 0) {
                verticalLines[lineInfo.r][lineInfo.c] = currentPlayer;
                lineChanged = true;
            }

            if (lineChanged) {
                const scored = checkForNewBoxes(lineInfo.r, lineInfo.c, lineInfo.type);
                drawBoard();
                
                if (!scored) {
                    switchPlayer();
                } else {
                    // Player scored, gets another turn. Update display to reflect current player again.
                    updateStatusDisplay();
                }

                if (checkGameOver()) {
                    // Game over logic handled in checkGameOver
                }
            }
        }
    });

    resetButton.addEventListener('click', initGame);

    // Initialize
    initGame();
});