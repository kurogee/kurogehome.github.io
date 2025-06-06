document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('game-board');
    const p1ScoreElement = document.getElementById('p1-score');
    const p2ScoreElement = document.getElementById('p2-score');
    const roundNumberElement = document.getElementById('round-number');
    const connectionInfoElement = document.getElementById('connection-info');
    const chainLengthElement = document.getElementById('chain-length');
    const chainScoreElement = document.getElementById('chain-score');
    const p1TurnIndicator = document.querySelector('.p1-turn');
    const p2TurnIndicator = document.querySelector('.p2-turn');

    const currentNextPieceContainer = document.getElementById('current-next-piece-container');
    const upcomingPiece2Container = document.getElementById('upcoming-piece-2-container'); // This is the piece-stack div
    const upcomingPiece3Container = document.getElementById('upcoming-piece-3-container'); // This is the piece-stack div


    const gameOverMessageElement = document.getElementById('game-over-message');
    const winnerMessageElement = document.getElementById('winner-message');
    const restartButton = document.getElementById('restart-button');


    const ROWS = 6;
    const COLS = 7;
    const PLAYER1_SYMBOL = 'O';
    const PLAYER2_SYMBOL = 'X';
    const PLAYER1_COLOR = 'red';
    const PLAYER2_COLOR = 'blue';

    let board = [];
    let currentPlayer = 1;
    let scores = { 1: 0, 2: 0 };
    let round = 1;
    let nextPiecesQueue = [];
    let currentlyHighlightedCells = [];
    let isGameOver = false;

    function createBoard() {
        boardElement.innerHTML = '';
        board = Array(ROWS).fill(null).map(() => Array(COLS).fill(null));
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', () => handleCellClick(c));
                boardElement.appendChild(cell);
            }
        }
    }

    function generatePiecePair() {
        const typeRoll = Math.random();
        const s1 = Math.random() < 0.5 ? PLAYER1_SYMBOL : PLAYER2_SYMBOL;
        const s2 = Math.random() < 0.5 ? PLAYER1_SYMBOL : PLAYER2_SYMBOL;

        if (typeRoll < 0.7) { 
            return { type: 'vertical', top: s1, bottom: s2 };
        } else { 
            return { type: 'horizontal', left: s1, right: s2 };
        }
    }

    function initializeNextPieces() {
        nextPiecesQueue = [];
        for (let i = 0; i < 3; i++) {
            nextPiecesQueue.push(generatePiecePair());
        }
        updateNextPiecesDisplay();
    }

    function updateNextPiecesDisplay() {
        // Current piece display
        if (nextPiecesQueue.length > 0) {
            const currentPair = nextPiecesQueue[0];
            currentNextPieceContainer.innerHTML = ''; 
            currentNextPieceContainer.classList.remove('horizontal', 'vertical'); // Remove both for clean slate

            const piece1El = document.createElement('div');
            piece1El.classList.add('piece');
            const piece2El = document.createElement('div');
            piece2El.classList.add('piece');

            if (currentPair.type === 'vertical') {
                currentNextPieceContainer.classList.add('vertical'); // Could be default, but explicit
                piece1El.textContent = currentPair.top;
                piece1El.style.color = currentPair.top === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                piece2El.textContent = currentPair.bottom;
                piece2El.style.color = currentPair.bottom === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
            } else { // Horizontal
                currentNextPieceContainer.classList.add('horizontal'); 
                piece1El.textContent = currentPair.left;
                piece1El.style.color = currentPair.left === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                piece2El.textContent = currentPair.right;
                piece2El.style.color = currentPair.right === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
            }
            currentNextPieceContainer.appendChild(piece1El);
            currentNextPieceContainer.appendChild(piece2El);
        } else {
            currentNextPieceContainer.innerHTML = ''; // Clear if no pieces
        }

        // Update upcoming pieces
        [upcomingPiece2Container, upcomingPiece3Container].forEach((container, index) => {
            container.innerHTML = ''; // Clear previous content of the piece-stack
            container.classList.remove('horizontal', 'vertical'); // Clean slate for orientation class
            const pieceData = nextPiecesQueue[index + 1];

            if (pieceData) {
                const p1 = document.createElement('div');
                p1.classList.add('small-piece');
                const p2 = document.createElement('div');
                p2.classList.add('small-piece');

                if (pieceData.type === 'vertical') {
                    container.classList.add('vertical'); // Could be default for piece-stack
                    p1.textContent = pieceData.top;
                    p1.style.color = pieceData.top === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                    p2.textContent = pieceData.bottom;
                    p2.style.color = pieceData.bottom === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                } else { // Horizontal
                    container.classList.add('horizontal');
                    p1.textContent = pieceData.left;
                    p1.style.color = pieceData.left === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                    p2.textContent = pieceData.right;
                    p2.style.color = pieceData.right === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
                }
                container.appendChild(p1);
                container.appendChild(p2);
            }
        });
    }


    function handleCellClick(col) {
        if (isGameOver || nextPiecesQueue.length === 0) return;

        const pieceToDrop = nextPiecesQueue[0];
        let piecePlacedThisTurn = false;

        if (pieceToDrop.type === 'vertical') {
            let rowToPlaceBottom = -1;
            for (let r = ROWS - 1; r >= 0; r--) { // Find lowest empty cell for bottom piece
                if (!board[r][col]) {
                    rowToPlaceBottom = r;
                    break;
                }
            }
            if (rowToPlaceBottom === -1) return; // Column is full to the brim

            if (rowToPlaceBottom === 0) { // Trying to place bottom at row 0
                // This means top piece would be at -1, which is only allowed if board[ -1 ] is conceptually fine
                // For a 2-piece vertical, this means the top piece is off-board, which is game over.
                // However, the canPlayerMakeMove should catch this.
                // If we reach here, it means a single column is full at the top.
                return; // Cannot place here if it means top piece is off.
            }
             // Ensure there's space for the top piece as well
            if (rowToPlaceBottom < 1 || board[rowToPlaceBottom-1]?.[col]) { // Check if cell above is occupied or out of bounds for top
                 // This column cannot take this vertical piece.
                 // Player might be able to place it in another column.
                 return;
            }


            board[rowToPlaceBottom][col] = pieceToDrop.bottom;
            updateCellDisplay(rowToPlaceBottom, col, pieceToDrop.bottom, true);
            checkAndScoreConnection(rowToPlaceBottom, col, pieceToDrop.bottom);
            piecePlacedThisTurn = true;

            const rowToPlaceTop = rowToPlaceBottom - 1;
            board[rowToPlaceTop][col] = pieceToDrop.top;
            updateCellDisplay(rowToPlaceTop, col, pieceToDrop.top, true);
            checkAndScoreConnection(rowToPlaceTop, col, pieceToDrop.top);

        } else { // Horizontal piece
            if (col >= COLS - 1) return; 

            let rowToPlace = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (!board[r][col] && !board[r][col + 1]) {
                    rowToPlace = r;
                    break;
                }
            }
            if (rowToPlace === -1) return; 

            board[rowToPlace][col] = pieceToDrop.left;
            updateCellDisplay(rowToPlace, col, pieceToDrop.left, true);
            checkAndScoreConnection(rowToPlace, col, pieceToDrop.left);
            piecePlacedThisTurn = true;

            board[rowToPlace][col + 1] = pieceToDrop.right;
            updateCellDisplay(rowToPlace, col + 1, pieceToDrop.right, true);
            checkAndScoreConnection(rowToPlace, col + 1, pieceToDrop.right);
        }
        
        if (!piecePlacedThisTurn) return;

        nextPiecesQueue.shift();
        nextPiecesQueue.push(generatePiecePair());
        updateNextPiecesDisplay();
        
        if (Math.random() < 0.10) { 
            triggerThunderChanger();
        }

        switchPlayer(); 
    }

    function checkAndScoreConnection(r, c, symbol) {
        const playerSymbol = currentPlayer === 1 ? PLAYER1_SYMBOL : PLAYER2_SYMBOL;
        if (symbol === playerSymbol) { 
            const connectionResult = checkForConnections(r, c, symbol);
            if (connectionResult) {
                const points = 100 * (connectionResult.chainLength - 2);
                scores[currentPlayer] += points;
                updateScores();
                showConnectionInfo(connectionResult.chainLength, points, symbol, connectionResult.cells);
            }
        }
    }
    
    function showConnectionInfo(length, score, symbol, connectedCells) {
        currentlyHighlightedCells.forEach(cellEl => cellEl.classList.remove('highlighted'));
        currentlyHighlightedCells = [];

        chainLengthElement.textContent = length - 2; 
        chainScoreElement.textContent = score;
        connectionInfoElement.style.color = symbol === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
        connectionInfoElement.style.visibility = 'visible';
        
        if (connectedCells && connectedCells.length > 0) {
            connectedCells.forEach(cellCoords => {
                const cellEl = boardElement.querySelector(`.grid-cell[data-row='${cellCoords.r}'][data-col='${cellCoords.c}']`);
                if (cellEl) {
                    cellEl.classList.add('highlighted');
                    currentlyHighlightedCells.push(cellEl); 
                }
            });
        }

        setTimeout(() => {
            connectionInfoElement.style.visibility = 'hidden';
            currentlyHighlightedCells.forEach(cellEl => cellEl.classList.remove('highlighted'));
            currentlyHighlightedCells = []; 
        }, 2000);
    }

    function updateCellDisplay(r, c, symbol, animate = false) { 
        const cell = boardElement.querySelector(`.grid-cell[data-row='${r}'][data-col='${c}']`);
        if (cell) {
            const pieceSpan = document.createElement('span');
            pieceSpan.textContent = symbol;
            pieceSpan.style.color = symbol === PLAYER1_SYMBOL ? PLAYER1_COLOR : PLAYER2_COLOR;
            
            if (animate) {
                pieceSpan.classList.add('piece-fall-animation');
                pieceSpan.addEventListener('animationend', () => {
                    pieceSpan.classList.remove('piece-fall-animation');
                }, {once: true});
            }
            
            cell.innerHTML = ''; 
            cell.appendChild(pieceSpan);
        }
    }

    function checkForConnections(r, c, symbol) {
        const directions = [
            { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, 
            { dr: 1, dc: 1 }, { dr: 1, dc: -1 }  
        ];
        let overallMaxChainLength = 0;
        let cellsOfOverallMaxChain = [];

        for (const { dr, dc } of directions) {
            let currentLineCells = [{ r, c }]; 
            let currentLineLength = 1;

            for (let i = 1; i < Math.max(ROWS, COLS); i++) {
                const nr = r + dr * i;
                const nc = c + dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === symbol) {
                    currentLineLength++;
                    currentLineCells.push({ r: nr, c: nc });
                } else {
                    break;
                }
            }

            for (let i = 1; i < Math.max(ROWS, COLS); i++) {
                const nr = r - dr * i;
                const nc = c - dc * i;
                if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === symbol) {
                    currentLineLength++;
                    currentLineCells.push({ r: nr, c: nc }); 
                } else {
                    break;
                }
            }

            if (currentLineLength > overallMaxChainLength) {
                overallMaxChainLength = currentLineLength;
                cellsOfOverallMaxChain = currentLineCells; 
            }
        }

        if (overallMaxChainLength >= 3) {
            return { connected: true, chainLength: overallMaxChainLength, cells: cellsOfOverallMaxChain };
        }
        return null;
    }

    function canPlayerMakeMove(player, piece) {
        if (!piece) return false; 
        for (let c = 0; c < COLS; c++) {
            if (piece.type === 'vertical') {
                // Check if there's space for two pieces: board[r][c] and board[r-1][c] must be empty
                // Lowest possible r for bottom piece is 1 (so top piece is at 0)
                for (let r = ROWS - 1; r >= 1; r--) { 
                    if (!board[r][c] && !board[r-1][c]) {
                         return true; // Found a valid spot for vertical
                    }
                }
            } else { // Horizontal
                if (c < COLS - 1) { 
                    for (let r = ROWS - 1; r >= 0; r--) {
                        if (!board[r][c] && !board[r][c + 1]) {
                            return true; // Found a valid spot for horizontal
                        }
                    }
                }
            }
        }
        return false; 
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        p1TurnIndicator.style.visibility = currentPlayer === 1 ? 'visible' : 'hidden';
        p2TurnIndicator.style.visibility = currentPlayer === 2 ? 'visible' : 'hidden';
        
        if (currentPlayer === 1) {
            round++; 
            updateRoundDisplay();
        }

        if (nextPiecesQueue.length > 0 && !canPlayerMakeMove(currentPlayer, nextPiecesQueue[0])) {
            isGameOver = true;
            let winner;
            if (scores[1] > scores[2]) winner = "Player 1 Wins!";
            else if (scores[2] > scores[1]) winner = "Player 2 Wins!";
            else winner = "It's a Tie!";
            endGame(winner + " (No more moves for Player " + currentPlayer + ")");
        }
    }

    function endGame(message) {
        isGameOver = true;
        winnerMessageElement.textContent = message;
        gameOverMessageElement.style.display = 'block';
    }


    function updateScores() {
        p1ScoreElement.textContent = String(scores[1]).padStart(4, '0');
        p2ScoreElement.textContent = String(scores[2]).padStart(4, '0');
    }
    
    function updateRoundDisplay() {
        roundNumberElement.textContent = round;
    }
    
    function triggerThunderChanger() {
        if (isGameOver) return;
        console.log("Thunder Changer Event Triggered!");

        const nonEemptyCells = [];
        for(let r=0; r<ROWS; r++) {
            for(let c=0; c<COLS; c++) {
                if(board[r][c]) {
                    nonEemptyCells.push({r,c, symbol: board[r][c]});
                }
            }
        }

        if(nonEemptyCells.length < 2) return; 

        const numChanges = Math.min(nonEemptyCells.length, Math.floor(Math.random() * 2) + 2); 

        for(let i=0; i<numChanges; i++) {
            if (nonEemptyCells.length === 0) break; 
            const randIndex = Math.floor(Math.random() * nonEemptyCells.length);
            const cellToChange = nonEemptyCells.splice(randIndex, 1)[0]; 
            
            const newSymbol = cellToChange.symbol === PLAYER1_SYMBOL ? PLAYER2_SYMBOL : PLAYER1_SYMBOL;
            board[cellToChange.r][cellToChange.c] = newSymbol;
            
            const cellElement = boardElement.querySelector(`.grid-cell[data-row='${cellToChange.r}'][data-col='${cellToChange.c}']`);
            const pieceSpan = cellElement ? cellElement.querySelector('span') : null;

            if (pieceSpan) {
                 pieceSpan.classList.add('thunder-change-animation');
                 pieceSpan.addEventListener('animationend', () => {
                    updateCellDisplay(cellToChange.r, cellToChange.c, newSymbol, false); 
                    pieceSpan.classList.remove('thunder-change-animation'); 

                    const p1Connection = checkForConnections(cellToChange.r, cellToChange.c, PLAYER1_SYMBOL);
                    if (p1Connection && newSymbol === PLAYER1_SYMBOL) { 
                        const points = 100 * (p1Connection.chainLength - 2);
                        scores[1] += points;
                        showConnectionInfo(p1Connection.chainLength, points, PLAYER1_SYMBOL, p1Connection.cells);
                    }
                    const p2Connection = checkForConnections(cellToChange.r, cellToChange.c, PLAYER2_SYMBOL);
                     if (p2Connection && newSymbol === PLAYER2_SYMBOL) { 
                        const points = 100 * (p2Connection.chainLength - 2);
                        scores[2] += points;
                        showConnectionInfo(p2Connection.chainLength, points, PLAYER2_SYMBOL, p2Connection.cells);
                    }
                    updateScores();
                 }, { once: true }); 
            } else { 
                 updateCellDisplay(cellToChange.r, cellToChange.c, newSymbol, false);
                const p1Connection = checkForConnections(cellToChange.r, cellToChange.c, PLAYER1_SYMBOL);
                if (p1Connection && newSymbol === PLAYER1_SYMBOL) { scores[1] += 100 * (p1Connection.chainLength - 2); showConnectionInfo(p1Connection.chainLength, 100 * (p1Connection.chainLength - 2) , PLAYER1_SYMBOL, p1Connection.cells); }
                const p2Connection = checkForConnections(cellToChange.r, cellToChange.c, PLAYER2_SYMBOL);
                if (p2Connection && newSymbol === PLAYER2_SYMBOL) { scores[2] += 100 * (p2Connection.chainLength - 2); showConnectionInfo(p2Connection.chainLength, 100 * (p2Connection.chainLength - 2), PLAYER2_SYMBOL, p2Connection.cells); }
                updateScores();
            }
        }
        boardElement.style.boxShadow = '0 0 35px 10px gold, inset 0 0 20px gold';
        boardElement.style.transition = 'box-shadow 0.3s ease-out';
        setTimeout(() => { 
            boardElement.style.boxShadow = '';
        }, 800); 
    }


    function initGame() {
        isGameOver = false;
        scores = { 1: 0, 2: 0 }; 
        round = 1; 
        currentPlayer = 1; 
        gameOverMessageElement.style.display = 'none';

        createBoard(); 
        initializeNextPieces();
        updateScores();
        updateRoundDisplay();

        p1TurnIndicator.style.visibility = 'visible';
        p2TurnIndicator.style.visibility = 'hidden';
        connectionInfoElement.style.visibility = 'hidden'; 
        currentlyHighlightedCells.forEach(cellEl => cellEl.classList.remove('highlighted')); 
        currentlyHighlightedCells = [];
    }
    
    restartButton.addEventListener('click', initGame);

    initGame();
});
