document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameBoard');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('score');
    const nextBlocksContainer = document.getElementById('nextBlocks');
    const resetButton = document.getElementById('resetButton');
    const gameOverMessage = document.getElementById('gameOverMessage');

    const COLS = 10;
    const ROWS = 10;
    const BLOCK_SIZE = canvas.width / COLS; // canvasサイズ変更に伴い自動調整
    const EMPTY_COLOR = '#eee';
    const BORDER_COLOR = '#ccc';

    let board = [];
    let currentScore = 0;
    let availableBlocks = [];
    let selectedBlock = null;
    let selectedBlockIndex = -1;
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    let gameOver = false;
    let isAnimatingClear = false; // アニメーション中フラグ

    const BLOCK_DEFINITIONS = [
        { shape: [[0,0], [1,0], [2,0], [3,0]], color: 'cyan', id: 'I4h' },
        { shape: [[0,0], [0,1], [0,2], [0,3]], color: 'cyan', id: 'I4v' },
        { shape: [[0,0], [1,0], [2,0]], color: 'blue', id: 'I3h' },
        { shape: [[0,0], [0,1], [0,2]], color: 'blue', id: 'I3v' },
        { shape: [[0,0], [1,0]], color: 'orange', id: 'I2h' },
        { shape: [[0,0], [0,1]], color: 'orange', id: 'I2v' },
        { shape: [[0,0]], color: 'yellow', id: 'O1' },
        { shape: [[0,0], [0,1], [0,2], [1,2]], color: 'purple', id: 'L1' },
        { shape: [[1,0], [1,1], [1,2], [0,2]], color: 'purple', id: 'L2' },
        { shape: [[0,0], [1,0], [2,0], [2,1]], color: 'green', id: 'L3' },
        { shape: [[2,0], [1,0], [0,0], [0,1]], color: 'green', id: 'L4' },
        { shape: [[0,0], [1,0], [0,1], [1,1]], color: 'red', id: 'O2' },
    ];

    function initBoard() {
        board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        // 各セルに { color: 0, clearingInfo: null } のようなオブジェクトを持たせる
        for (let r = 0; r < ROWS; r++) {
            board[r] = [];
            for (let c = 0; c < COLS; c++) {
                board[r][c] = { color: 0, clearingStartTime: null, originalColor: null };
            }
        }
        drawBoard();
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let activeAnimation = false;
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const cell = board[row][col];
                let colorToDraw = cell.color === 0 ? EMPTY_COLOR : cell.color;
                let alpha = 1;

                if (cell.clearingStartTime) {
                    activeAnimation = true;
                    const elapsedTime = Date.now() - cell.clearingStartTime;
                    const animationDuration = 500; // 0.5秒で消える
                    if (elapsedTime < animationDuration) {
                        alpha = 1 - (elapsedTime / animationDuration);
                        colorToDraw = cell.originalColor; // 消えるときは元の色でフェードアウト
                    } else {
                        // アニメーション終了後、実質的に透明（描画しないか、背景色で）
                        // この段階ではまだデータは残っているが、次のclearLinesの完了処理で消される
                        colorToDraw = EMPTY_COLOR; // or skip drawing
                        alpha = 0;
                    }
                }
                drawBlock(col, row, colorToDraw, true, alpha);
            }
        }
        if (activeAnimation && isAnimatingClear) {
            requestAnimationFrame(drawBoard); // アニメーションが続くなら再描画
        }
    }

    function drawBlock(x, y, color, isGrid = false, alpha = 1) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        if (isGrid) {
            ctx.strokeStyle = BORDER_COLOR;
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
        ctx.globalAlpha = 1; // 他の描画に影響しないように戻す
    }

    function generateNextBlocks() {
        availableBlocks = [];
        nextBlocksContainer.innerHTML = '';
        const numberOfBlocksToPresent = 3;
        for (let i = 0; i < numberOfBlocksToPresent; i++) {
            const randomIndex = Math.floor(Math.random() * BLOCK_DEFINITIONS.length);
            const blockDef = JSON.parse(JSON.stringify(BLOCK_DEFINITIONS[randomIndex]));
            availableBlocks.push(blockDef);

            const previewCanvas = document.createElement('canvas');
            previewCanvas.classList.add('block-preview');
            previewCanvas.dataset.blockIndex = i;
            let maxX = 0, maxY = 0;
            blockDef.shape.forEach(p => {
                if (p[0] > maxX) maxX = p[0];
                if (p[1] > maxY) maxY = p[1];
            });
            // プレビューブロックのサイズもBLOCK_SIZEに依存するので自動調整
            const previewBlockSize = BLOCK_SIZE * 0.5; // 少し小さめに調整
            previewCanvas.width = (maxX + 1) * previewBlockSize;
            previewCanvas.height = (maxY + 1) * previewBlockSize;
            const previewCtx = previewCanvas.getContext('2d');

            blockDef.shape.forEach(part => {
                previewCtx.fillStyle = blockDef.color;
                previewCtx.fillRect(part[0] * previewBlockSize, part[1] * previewBlockSize, previewBlockSize, previewBlockSize);
                previewCtx.strokeStyle = BORDER_COLOR;
                previewCtx.strokeRect(part[0] * previewBlockSize, part[1] * previewBlockSize, previewBlockSize, previewBlockSize);
            });
            nextBlocksContainer.appendChild(previewCanvas);

            previewCanvas.addEventListener('mousedown', (e) => {
                if (gameOver || isAnimatingClear) return; // ゲームオーバー中またはアニメーション中は操作不可
                selectedBlockIndex = parseInt(e.target.dataset.blockIndex);
                selectedBlock = JSON.parse(JSON.stringify(availableBlocks[selectedBlockIndex]));
                const rect = e.target.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
                isDragging = true;
                e.target.style.cursor = 'grabbing';
                createDragGhost(e.clientX, e.clientY);
            });
        }
    }

    let dragGhost = null;
    function createDragGhost(initialX, initialY) {
        if (dragGhost) document.body.removeChild(dragGhost);
        if (!selectedBlock) return;
        dragGhost = document.createElement('canvas');
        let maxX = 0, maxY = 0;
        selectedBlock.shape.forEach(p => {
            if (p[0] > maxX) maxX = p[0];
            if (p[1] > maxY) maxY = p[1];
        });
        dragGhost.width = (maxX + 1) * BLOCK_SIZE;
        dragGhost.height = (maxY + 1) * BLOCK_SIZE;
        const ghostCtx = dragGhost.getContext('2d');
        selectedBlock.shape.forEach(part => {
            ghostCtx.fillStyle = selectedBlock.color;
            ghostCtx.globalAlpha = 0.7;
            ghostCtx.fillRect(part[0] * BLOCK_SIZE, part[1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ghostCtx.strokeStyle = BORDER_COLOR;
            ghostCtx.strokeRect(part[0] * BLOCK_SIZE, part[1] * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        });
        dragGhost.style.position = 'absolute';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.left = (initialX - dragOffsetX) + 'px';
        dragGhost.style.top = (initialY - dragOffsetY) + 'px';
        document.body.appendChild(dragGhost);
    }

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !selectedBlock || !dragGhost || isAnimatingClear) return;
        dragGhost.style.left = (e.clientX - dragOffsetX) + 'px';
        dragGhost.style.top = (e.clientY - dragOffsetY) + 'px';
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const boardCol = Math.floor(mouseX / BLOCK_SIZE);
        const boardRow = Math.floor(mouseY / BLOCK_SIZE);
        
        // 盤面描画はアニメーションフレームに任せるか、ここでプレビュー専用描画
        drawBoard(); // 一旦クリアして通常の盤面を描画
        if (mouseX >= 0 && mouseX <= canvas.width && mouseY >=0 && mouseY <= canvas.height) {
            if (canPlaceBlock(selectedBlock, boardRow, boardCol)) {
                previewBlockOnBoard(selectedBlock, boardRow, boardCol, selectedBlock.color, 0.5);
            } else {
                previewBlockOnBoard(selectedBlock, boardRow, boardCol, 'gray', 0.3);
            }
        }
    });
    
    function previewBlockOnBoard(block, startRow, startCol, color, alpha = 1) {
        if (!block) return;
        ctx.globalAlpha = alpha;
        block.shape.forEach(part => {
            const r = startRow + part[1];
            const c = startCol + part[0];
            if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
                 drawBlock(c, r, color, false); // プレビューなのでグリッド線なし
            }
        });
        ctx.globalAlpha = 1;
    }

    document.addEventListener('mouseup', (e) => {
        if (!isDragging || !selectedBlock || isAnimatingClear) { // アニメーション中もドロップ処理中断
            if(dragGhost) {
                document.body.removeChild(dragGhost);
                dragGhost = null;
            }
            isDragging = false;
            const previews = document.querySelectorAll('.block-preview');
            previews.forEach(p => p.style.cursor = 'grab');
            if (!isAnimatingClear) drawBoard(); // アニメーション中でなければ盤面を元に戻す
            return;
        }

        isDragging = false;
        if (dragGhost) {
            document.body.removeChild(dragGhost);
            dragGhost = null;
        }
        const previews = document.querySelectorAll('.block-preview');
        previews.forEach(p => p.style.cursor = 'grab');

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (mouseX < 0 || mouseX > canvas.width || mouseY < 0 || mouseY > canvas.height) {
            selectedBlock = null;
            selectedBlockIndex = -1;
            drawBoard();
            return;
        }

        const boardCol = Math.floor(mouseX / BLOCK_SIZE);
        const boardRow = Math.floor(mouseY / BLOCK_SIZE);

        if (canPlaceBlock(selectedBlock, boardRow, boardCol)) {
            placeBlock(selectedBlock, boardRow, boardCol);
            availableBlocks.splice(selectedBlockIndex, 1);
            updateNextBlocksDisplay(); // プレビュー更新

            // clearLinesの前に盤面を一度描画
            drawBoard(); 
            
            const clearedCellsInfo = getLinesToClear();
            if (clearedCellsInfo.cellsToClear.size > 0) {
                isAnimatingClear = true; // アニメーション開始
                document.body.style.pointerEvents = 'none'; // 操作を一時的に無効化

                const now = Date.now();
                clearedCellsInfo.cellsToClear.forEach(cellPos => {
                    const [r, c] = cellPos.split('-').map(Number);
                    board[r][c].clearingStartTime = now;
                    board[r][c].originalColor = board[r][c].color; // 消える時の色を保存
                });

                requestAnimationFrame(drawBoard); // アニメーション描画開始

                setTimeout(() => {
                    // アニメーション終了後の処理
                    clearedCellsInfo.cellsToClear.forEach(cellPos => {
                        const [r, c] = cellPos.split('-').map(Number);
                        board[r][c] = { color: 0, clearingStartTime: null, originalColor: null }; // 完全に消去
                    });
                    
                    updateScore(clearedCellsInfo.linesClearedCount); // スコア更新
                    isAnimatingClear = false; // アニメーション終了
                    document.body.style.pointerEvents = 'auto'; // 操作を有効化
                    
                    if (availableBlocks.length === 0) {
                        generateNextBlocks();
                    }
                    if (checkGameOver()) {
                        handleGameOver();
                    }
                    drawBoard(); // 最終的な盤面を描画
                }, 500 + 50); // アニメーション時間 + バッファ
            } else {
                 // 消えるラインがない場合
                if (availableBlocks.length === 0) {
                    generateNextBlocks();
                }
                if (checkGameOver()) {
                    handleGameOver();
                }
                drawBoard();
            }
        } else {
            drawBoard(); // 配置失敗時も盤面再描画
        }
        selectedBlock = null;
        selectedBlockIndex = -1;
    });

    function canPlaceBlock(block, startRow, startCol) {
        if (!block) return false;
        for (const part of block.shape) {
            const r = startRow + part[1];
            const c = startCol + part[0];
            if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
            if (board[r][c].color !== 0) return false;
        }
        return true;
    }

    function placeBlock(block, startRow, startCol) {
        block.shape.forEach(part => {
            const r = startRow + part[1];
            const c = startCol + part[0];
            board[r][c].color = block.color;
        });
    }

    function updateNextBlocksDisplay() {
        nextBlocksContainer.innerHTML = '';
        availableBlocks.forEach((blockDef, i) => {
            const previewCanvas = document.createElement('canvas');
            previewCanvas.classList.add('block-preview');
            previewCanvas.dataset.blockIndex = i;
            let maxX = 0, maxY = 0;
            blockDef.shape.forEach(p => {
                if (p[0] > maxX) maxX = p[0];
                if (p[1] > maxY) maxY = p[1];
            });
            const previewBlockSize = BLOCK_SIZE * 0.5;
            previewCanvas.width = (maxX + 1) * previewBlockSize;
            previewCanvas.height = (maxY + 1) * previewBlockSize;
            const previewCtx = previewCanvas.getContext('2d');
            blockDef.shape.forEach(part => {
                previewCtx.fillStyle = blockDef.color;
                previewCtx.fillRect(part[0] * previewBlockSize, part[1] * previewBlockSize, previewBlockSize, previewBlockSize);
                previewCtx.strokeStyle = BORDER_COLOR;
                previewCtx.strokeRect(part[0] * previewBlockSize, part[1] * previewBlockSize, previewBlockSize, previewBlockSize);
            });
            nextBlocksContainer.appendChild(previewCanvas);
            previewCanvas.addEventListener('mousedown', (e) => {
                if (gameOver || isAnimatingClear) return;
                selectedBlockIndex = parseInt(e.target.dataset.blockIndex);
                selectedBlock = JSON.parse(JSON.stringify(availableBlocks[selectedBlockIndex]));
                const rect = e.target.getBoundingClientRect();
                dragOffsetX = e.clientX - rect.left;
                dragOffsetY = e.clientY - rect.top;
                isDragging = true;
                e.target.style.cursor = 'grabbing';
                createDragGhost(e.clientX, e.clientY);
            });
        });
    }

    // ラインが消えるべきセルとその数を返す関数 (実際の消去はしない)
    function getLinesToClear() {
        let linesClearedCount = 0;
        const cellsToClear = new Set();
        let actualLines = 0;

        // 横ラインのチェック
        for (let r = 0; r < ROWS; r++) {
            if (board[r].every(cell => cell.color !== 0 && !cell.clearingStartTime)) { // clearing中のものは除く
                actualLines++;
                for (let c = 0; c < COLS; c++) {
                    cellsToClear.add(`${r}-${c}`);
                }
            }
        }

        // 縦ラインのチェック
        for (let c = 0; c < COLS; c++) {
            let isColFull = true;
            for (let r = 0; r < ROWS; r++) {
                if (board[r][c].color === 0 || board[r][c].clearingStartTime) { // clearing中のものは除く
                    isColFull = false;
                    break;
                }
            }
            if (isColFull) {
                actualLines++;
                for (let r = 0; r < ROWS; r++) {
                    cellsToClear.add(`${r}-${c}`);
                }
            }
        }
        // スコア計算用のライン数は、重複を除いたセルの数ではなく、揃ったラインの数
        // ここでは単純に縦横の揃ったライン数を合計する（より複雑なスコアロジックも可能）
        linesClearedCount = actualLines;

        return { cellsToClear, linesClearedCount };
    }


    function updateScore(lines) {
        let points = 0;
        if (lines === 1) points = 100;
        else if (lines === 2) points = 300;
        else if (lines === 3) points = 500;
        else if (lines >= 4) points = 800 + (lines - 4) * 200; // 複合ラインは高得点
        currentScore += points;
        scoreDisplay.textContent = currentScore;
    }

    function checkGameOver() {
        if (isAnimatingClear) return false; // アニメーション中はゲームオーバー判定しない
        if (availableBlocks.length === 0) return false;
        for (const blockDef of availableBlocks) {
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (canPlaceBlock(blockDef, r, c)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function handleGameOver() {
        gameOver = true;
        gameOverMessage.classList.remove('hidden');
        if(dragGhost) {
            document.body.removeChild(dragGhost);
            dragGhost = null;
        }
        const previews = document.querySelectorAll('.block-preview');
        previews.forEach(p => p.style.cursor = 'default');
        console.log("ゲームオーバー！");
    }

    function resetGame() {
        gameOver = false;
        isAnimatingClear = false;
        document.body.style.pointerEvents = 'auto';
        gameOverMessage.classList.add('hidden');
        currentScore = 0;
        scoreDisplay.textContent = currentScore;
        initBoard(); // boardの初期化方法変更に合わせて修正
        generateNextBlocks();
        selectedBlock = null;
        selectedBlockIndex = -1;
        isDragging = false;
        if(dragGhost) {
            document.body.removeChild(dragGhost);
            dragGhost = null;
        }
        drawBoard(); // 初期描画
    }

    resetButton.addEventListener('click', resetGame);
    resetGame();
});