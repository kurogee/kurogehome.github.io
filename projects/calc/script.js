class DigitalSlideRule {
    constructor() {
        this.scales = {
            A: { type: 'square', position: 0, visible: true, description: 'A尺 (x²)' },
            B: { type: 'square', position: 0, visible: true, description: 'B尺 (x²)' },
            C: { type: 'linear', position: 0, visible: true, description: 'C尺 (x)' },
            D: { type: 'linear', position: 0, visible: true, description: 'D尺 (x)' },
            K: { type: 'cube', position: 0, visible: false, description: 'K尺 (x³)' },
            L: { type: 'log', position: 0, visible: false, description: 'L尺 (log x)' },
            S: { type: 'sin', position: 0, visible: false, description: 'S尺 (sin x)' },
            T: { type: 'tan', position: 0, visible: false, description: 'T尺 (tan x)' },
            CI: { type: 'inverse', position: 0, visible: false, description: 'CI尺 (1/x)' },
            LL1: { type: 'loglog1', position: 0, visible: false, description: 'LL1尺 (e^(x/100))' },
            LL2: { type: 'loglog2', position: 0, visible: false, description: 'LL2尺 (e^(x/10))' },
            LL3: { type: 'loglog3', position: 0, visible: false, description: 'LL3尺 (e^x)' }
        };
        
        this.cursor = { position: 800 }; // カーソル初期位置を中央に
        this.scaleWidth = 1600; // 目盛り幅を2倍に拡張
        this.maxCursorPosition = 1580; // カーソル最大位置
        this.zoom = 1.0;
        this.precision = 2;
        this.theme = 'dark';
        this.isDragging = false;
        this.dragTarget = null;
        this.dragStart = { x: 0, scalePos: 0 };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.drawAllScales();
        this.updateReadings();
        this.updateCalculations();
    }

    setupEventListeners() {
        // ズームコントロール
        document.getElementById('zoomIn').addEventListener('click', () => this.adjustZoom(0.1));
        document.getElementById('zoomOut').addEventListener('click', () => this.adjustZoom(-0.1));
        
        // リセットボタン
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // 設定ボタン
        document.getElementById('settingsBtn').addEventListener('click', () => this.toggleSettings());
        document.getElementById('closeSettings').addEventListener('click', () => this.toggleSettings());
        
        // 設定パネルのコントロール
        this.setupSettingsControls();
        
        // ドラッグ&ドロップ
        this.setupDragAndDrop();
        
        // カーソル移動
        this.setupCursorControl();
        
        // キーボードショートカット
        this.setupKeyboardControls();
    }

    setupSettingsControls() {
        // 目盛り表示切り替え
        ['A', 'B', 'C', 'D', 'K', 'L', 'S', 'T', 'CI', 'LL1', 'LL2', 'LL3'].forEach(scale => {
            const checkbox = document.getElementById(`toggle${scale}`);
            if (checkbox) {
                checkbox.addEventListener('change', (e) => {
                    this.scales[scale].visible = e.target.checked;
                    this.toggleScale(scale, e.target.checked);
                });
            }
        });

        // 精度設定
        const precisionSlider = document.getElementById('precisionSlider');
        precisionSlider.addEventListener('input', (e) => {
            this.precision = parseInt(e.target.value);
            document.getElementById('precisionValue').textContent = `小数点以下${this.precision}桁`;
            this.updateReadings();
        });

        // テーマ選択
        document.getElementById('themeSelect').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
    }

    setupDragAndDrop() {
        const movableScales = document.querySelectorAll('.movable-scale');
        
        movableScales.forEach(scale => {
            // マウス操作
            scale.addEventListener('mousedown', (e) => this.startDrag(e, scale));
            
            // タッチ操作（パッシブではない）
            scale.addEventListener('touchstart', (e) => {
                e.preventDefault(); // スクロール防止
                this.startDrag(e, scale);
            }, { passive: false });
        });

        // グローバルイベント
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault(); // スクロール防止
            }
            this.handleDrag(e);
        }, { passive: false });
        
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
        document.addEventListener('touchcancel', () => this.endDrag());
    }

    setupCursorControl() {
        const cursor = document.getElementById('cursor');
        let cursorDragging = false;

        // マウス操作
        cursor.addEventListener('mousedown', (e) => {
            cursorDragging = true;
            e.preventDefault();
        });

        // タッチ操作
        cursor.addEventListener('touchstart', (e) => {
            cursorDragging = true;
            e.preventDefault();
        }, { passive: false });

        // 移動イベント
        document.addEventListener('mousemove', (e) => {
            if (cursorDragging) {
                this.moveCursor(e);
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (cursorDragging) {
                e.preventDefault(); // スクロール防止
                this.moveCursor(e);
            }
        }, { passive: false });

        // 終了イベント
        document.addEventListener('mouseup', () => {
            cursorDragging = false;
        });

        document.addEventListener('touchend', () => {
            cursorDragging = false;
        });

        document.addEventListener('touchcancel', () => {
            cursorDragging = false;
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '=':
                    case '+':
                        e.preventDefault();
                        this.adjustZoom(0.1);
                        break;
                    case '-':
                        e.preventDefault();
                        this.adjustZoom(-0.1);
                        break;
                    case '0':
                        e.preventDefault();
                        this.reset();
                        break;
                }
            }
            
            // 矢印キーでカーソル移動
            switch(e.key) {
                case 'ArrowLeft':
                    this.cursor.position = Math.max(20, this.cursor.position - 5);
                    this.updateCursorPosition();
                    break;
                case 'ArrowRight':
                    this.cursor.position = Math.min(this.maxCursorPosition, this.cursor.position + 5);
                    this.updateCursorPosition();
                    break;
            }
        });
    }

    startDrag(e, scale) {
        this.isDragging = true;
        this.dragTarget = scale;
        scale.classList.add('dragging');
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const scaleId = scale.id.replace('scale', '');
        
        this.dragStart.x = clientX;
        this.dragStart.scalePos = this.scales[scaleId].position;
        
        e.preventDefault();
    }

    handleDrag(e) {
        if (!this.isDragging || !this.dragTarget) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const deltaX = clientX - this.dragStart.x;
        const scaleId = this.dragTarget.id.replace('scale', '');
        
        const newPosition = this.dragStart.scalePos + deltaX;
        const maxPos = 1200; // 最大移動距離を3倍に拡張
        
        this.scales[scaleId].position = Math.max(-maxPos, Math.min(maxPos, newPosition));
        this.updateScalePosition(scaleId);
        this.updateReadings();
        this.updateCalculations();
        
        e.preventDefault();
    }

    endDrag() {
        if (this.isDragging && this.dragTarget) {
            this.dragTarget.classList.remove('dragging');
        }
        this.isDragging = false;
        this.dragTarget = null;
    }

    moveCursor(e) {
        const container = document.getElementById('slideRuleContainer');
        const rect = container.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        
        let newPosition = clientX - rect.left - 20; // オフセット調整
        newPosition = Math.max(20, Math.min(this.maxCursorPosition, newPosition));
        
        this.cursor.position = newPosition;
        this.updateCursorPosition();
        e.preventDefault();
    }

    updateScalePosition(scaleId) {
        const scale = document.getElementById(`scale${scaleId}`);
        const position = this.scales[scaleId].position;
        scale.style.transform = `translateX(${position}px)`;
    }

    updateCursorPosition() {
        const cursor = document.getElementById('cursor');
        cursor.style.left = `${this.cursor.position}px`;
        this.updateReadings();
        this.updateCalculations();
    }

    drawScale(canvas, scaleType, scaleId) {
        const ctx = canvas.getContext('2d');
        const width = this.scaleWidth; // 拡張された幅を使用
        const height = canvas.height;
        
        // 高DPI対応
        const devicePixelRatio = window.devicePixelRatio || 1;
        const displayWidth = width;
        const displayHeight = height;
        
        canvas.width = displayWidth * devicePixelRatio;
        canvas.height = displayHeight * devicePixelRatio;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // アンチエイリアシング設定
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // キャンバスをクリア
        ctx.clearRect(0, 0, displayWidth, displayHeight);
        
        // 背景グラデーション
        const gradient = ctx.createLinearGradient(0, 0, 0, displayHeight);
        gradient.addColorStop(0, '#f8f8f8');
        gradient.addColorStop(1, '#e0e0e0');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
        
        // 目盛りを描画
        this.drawScaleMarks(ctx, displayWidth, displayHeight, scaleType);
        this.drawScaleNumbers(ctx, displayWidth, displayHeight, scaleType);
    }

    drawScaleMarks(ctx, width, height, scaleType) {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        
        // 各目盛りタイプに応じた描画
        switch(scaleType) {
            case 'linear':
                this.drawLinearMarks(ctx, width, height);
                break;
            case 'square':
                this.drawSquareMarks(ctx, width, height);
                break;
            case 'cube':
                this.drawCubeMarks(ctx, width, height);
                break;
            case 'log':
                this.drawLogMarks(ctx, width, height);
                break;
            case 'sin':
                this.drawSinMarks(ctx, width, height);
                break;
            case 'tan':
                this.drawTanMarks(ctx, width, height);
                break;
            case 'inverse':
                this.drawInverseMarks(ctx, width, height);
                break;
            case 'loglog1':
            case 'loglog2':
            case 'loglog3':
                this.drawLogLogMarks(ctx, width, height, scaleType);
                break;
        }
    }

    drawLinearMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // C尺・D尺: 標準対数尺 1から10の1サイクル
        for (let i = 1; i <= 10; i++) {
            const x = this.valueToPosition(i, 'linear', width);
            
            if (x >= 0 && x <= width) {
                ctx.lineWidth = (i === 1 || i === 10) ? 3 : 2;
                ctx.beginPath();
                ctx.moveTo(x, height * 0.1);
                ctx.lineTo(x, height * 0.9);
                ctx.stroke();
            }
        }
        
        // 副目盛り（2,3,4,5,6,7,8,9）
        ctx.lineWidth = 1.5;
        for (let i = 2; i <= 9; i++) {
            const x = this.valueToPosition(i, 'linear', width);
            
            if (x >= 0 && x <= width) {
                ctx.beginPath();
                ctx.moveTo(x, height * 0.15);
                ctx.lineTo(x, height * 0.85);
                ctx.stroke();
            }
        }
        
        // 細目盛り（0.1刻み: 1.1, 1.2, 1.3...）
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = '#555';
        for (let i = 11; i <= 99; i++) {
            if (i % 10 === 0) continue; // 主目盛りをスキップ
            
            const value = i / 10;
            const x = this.valueToPosition(value, 'linear', width);
            
            // 5の倍数（1.5, 2.5, 3.5...）は少し長く
            const isHalf = (i % 5 === 0);
            const startY = isHalf ? height * 0.25 : height * 0.3;
            const endY = isHalf ? height * 0.75 : height * 0.7;
            
            if (x >= 0 && x <= width) {
                ctx.beginPath();
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }
        }
    }

    drawSquareMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // A尺・B尺用の平方根目盛り - 1から100の範囲
        for (let i = 1; i <= 100; i++) {
            const x = this.valueToPosition(i, 'square', width);
            
            if (x >= 0 && x <= width) {
                let lineWidth = 0.5;
                let startY = height * 0.3;
                let endY = height * 0.7;
                
                if (i === 1 || i === 10 || i === 100) {
                    // 主要目盛り（1, 10, 100）
                    lineWidth = 3;
                    startY = height * 0.1;
                    endY = height * 0.9;
                } else if (i % 10 === 0) {
                    // 10の倍数
                    lineWidth = 2.5;
                    startY = height * 0.15;
                    endY = height * 0.85;
                } else if (i % 5 === 0) {
                    // 5の倍数
                    lineWidth = 1.5;
                    startY = height * 0.2;
                    endY = height * 0.8;
                } else if (i % 2 === 0) {
                    // 偶数
                    lineWidth = 1;
                    startY = height * 0.25;
                    endY = height * 0.75;
                } else {
                    // その他（間引いて表示）
                    if (i > 50 && i % 2 !== 0) continue;
                }
                
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(x, startY);
                ctx.lineTo(x, endY);
                ctx.stroke();
            }
        }
    }

    drawCubeMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // K尺用の立方根目盛り - 主要な値のみ表示
        for (let i = 1; i <= 100; i++) {
            const value = Math.pow(i, 1/3);
            const x = this.valueToPosition(value, 'cube', width);
            
            if (x >= 0 && x <= width) {
                let lineWidth = 0.5;
                if (i % 50 === 0) lineWidth = 3;
                else if (i % 25 === 0) lineWidth = 2.5;
                else if (i % 10 === 0) lineWidth = 2;
                else if (i % 5 === 0) lineWidth = 1.5;
                else if (i % 10 !== 0) continue; // 細かい目盛りをスキップ
                
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(x, height * 0.15);
                ctx.lineTo(x, height * 0.85);
                ctx.stroke();
            }
        }
    }

    drawLogMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // L尺用の対数目盛り - 間隔を広げる
        for (let i = 1; i <= 10; i += 0.5) { // 0.5刻みに変更
            const x = (Math.log10(i) + 1) * width / 2;
            
            if (x >= 0 && x <= width) {
                const majorMark = (i % 1 === 0);
                ctx.lineWidth = majorMark ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.1 : 0.2));
                ctx.lineTo(x, height * (majorMark ? 0.9 : 0.8));
                ctx.stroke();
            }
        }
    }

    drawSinMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // S尺: 正弦尺 0.1度から90度
        // 小角度域（0.1°-5.7°）
        for (let deg = 0.1; deg <= 5.7; deg += 0.1) {
            const x = this.valueToPosition(deg, 'sin', width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (deg % 1 === 0);
                ctx.lineWidth = majorMark ? 2 : 0.8;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.15 : 0.3));
                ctx.lineTo(x, height * (majorMark ? 0.85 : 0.7));
                ctx.stroke();
            }
        }
        
        // 通常域（6°-90°）
        for (let deg = 6; deg <= 90; deg++) {
            const x = this.valueToPosition(deg, 'sin', width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (deg % 10 === 0);
                const minorMark = (deg % 5 === 0);
                
                let lineWidth = 0.8;
                if (majorMark) lineWidth = 2.5;
                else if (minorMark) lineWidth = 1.5;
                
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.1 : minorMark ? 0.2 : 0.3));
                ctx.lineTo(x, height * (majorMark ? 0.9 : minorMark ? 0.8 : 0.7));
                ctx.stroke();
            }
        }
    }

    drawTanMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // T尺: 正接尺 0.1度から84度
        // 小角度域（0.1°-5.7°）
        for (let deg = 0.1; deg <= 5.7; deg += 0.1) {
            const x = this.valueToPosition(deg, 'tan', width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (deg % 1 === 0);
                ctx.lineWidth = majorMark ? 2 : 0.8;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.15 : 0.3));
                ctx.lineTo(x, height * (majorMark ? 0.85 : 0.7));
                ctx.stroke();
            }
        }
        
        // 通常域（6°-84°）
        for (let deg = 6; deg <= 84; deg++) {
            const x = this.valueToPosition(deg, 'tan', width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (deg % 10 === 0);
                const minorMark = (deg % 5 === 0);
                
                let lineWidth = 0.8;
                if (majorMark) lineWidth = 2.5;
                else if (minorMark) lineWidth = 1.5;
                
                ctx.lineWidth = lineWidth;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.1 : minorMark ? 0.2 : 0.3));
                ctx.lineTo(x, height * (majorMark ? 0.9 : minorMark ? 0.8 : 0.7));
                ctx.stroke();
            }
        }
    }

    drawInverseMarks(ctx, width, height) {
        ctx.strokeStyle = '#333';
        
        // CI尺用の逆数目盛り - 間隔を広げる
        for (let i = 1; i <= 10; i += 0.5) { // 0.5刻みに変更
            const invValue = 1 / i;
            const x = this.valueToPosition(invValue, 'inverse', width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (i % 1 === 0);
                ctx.lineWidth = majorMark ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.1 : 0.2));
                ctx.lineTo(x, height * (majorMark ? 0.9 : 0.8));
                ctx.stroke();
            }
        }
    }

    drawLogLogMarks(ctx, width, height, scaleType) {
        ctx.strokeStyle = '#333';
        
        // LL尺用の指数目盛り - 主要な値のみ
        const multiplier = scaleType === 'loglog1' ? 0.01 : scaleType === 'loglog2' ? 0.1 : 1;
        const step = scaleType === 'loglog1' ? 0.1 : scaleType === 'loglog2' ? 0.5 : 1;
        
        for (let i = step; i <= 5; i += step) {
            const expValue = Math.exp(i * multiplier);
            const x = this.valueToPosition(expValue, scaleType, width);
            
            if (x >= 0 && x <= width) {
                const majorMark = (i % (step * 2) === 0);
                ctx.lineWidth = majorMark ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.moveTo(x, height * (majorMark ? 0.1 : 0.2));
                ctx.lineTo(x, height * (majorMark ? 0.9 : 0.8));
                ctx.stroke();
            }
        }
    }

    drawScaleNumbers(ctx, width, height, scaleType) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        switch(scaleType) {
            case 'linear':
                this.drawLinearNumbers(ctx, width, height);
                break;
            case 'square':
                this.drawSquareNumbers(ctx, width, height);
                break;
            case 'cube':
                this.drawCubeNumbers(ctx, width, height);
                break;
            case 'log':
                this.drawLogNumbers(ctx, width, height);
                break;
            case 'sin':
                this.drawSinNumbers(ctx, width, height);
                break;
            case 'tan':
                this.drawTanNumbers(ctx, width, height);
                break;
            case 'inverse':
                this.drawInverseNumbers(ctx, width, height);
                break;
            case 'loglog1':
            case 'loglog2':
            case 'loglog3':
                this.drawLogLogNumbers(ctx, width, height, scaleType);
                break;
        }
    }

    drawLinearNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 主要な数値を表示（1から10）
        for (let i = 1; i <= 10; i++) {
            const x = this.valueToPosition(i, 'linear', width);
            
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(i.toString(), x, height * 0.02);
            }
        }
        
        // 下部に中間値を表示
        ctx.font = '10px Arial';
        ctx.textBaseline = 'bottom';
        for (let i = 15; i <= 95; i += 10) {
            const value = i / 10; // 1.5, 2.5, 3.5... 9.5
            const x = this.valueToPosition(value, 'linear', width);
            
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(value.toFixed(1), x, height * 0.98);
            }
        }
    }

    drawSquareNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 主要な数値を表示（1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100）
        const importantValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100];
        
        importantValues.forEach(value => {
            const x = this.valueToPosition(value, 'square', width);
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(value.toString(), x, height * 0.02);
            }
        });
        
        // 下部に平方根値を表示
        ctx.font = '9px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#666';
        
        [4, 9, 16, 25, 36, 49, 64, 81].forEach(square => {
            const sqrt = Math.sqrt(square);
            const x = this.valueToPosition(square, 'square', width);
            if (x >= 30 && x <= width - 30) {
                ctx.fillText(`√${square}=${sqrt}`, x, height * 0.98);
            }
        });
    }

    drawCubeNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 主要な値のみ表示
        for (let i = 1; i <= 10; i++) {
            const value = Math.pow(i, 1/3);
            const x = this.valueToPosition(value, 'cube', width);
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(i.toString(), x, height * 0.02);
            }
        }
    }

    drawLogNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        for (let i = 1; i <= 10; i++) {
            const x = (Math.log10(i)) * width;
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(i.toString(), x, height * 0.02);
            }
        }
    }

    drawSinNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 主要な角度を表示
        const angles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
        
        angles.forEach(degrees => {
            const x = this.valueToPosition(degrees, 'sin', width);
            if (x >= 30 && x <= width - 30) {
                ctx.fillText(`${degrees}°`, x, height * 0.02);
            }
        });
        
        // 下部に正弦値を表示
        ctx.font = '8px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#666';
        
        [30, 45, 60].forEach(deg => {
            const x = this.valueToPosition(deg, 'sin', width);
            const sinVal = Math.sin(deg * Math.PI / 180);
            if (x >= 35 && x <= width - 35) {
                ctx.fillText(`sin${deg}°=${sinVal.toFixed(3)}`, x, height * 0.98);
            }
        });
    }

    drawTanNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // 主要な角度を表示
        const angles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 84];
        
        angles.forEach(degrees => {
            const x = this.valueToPosition(degrees, 'tan', width);
            if (x >= 30 && x <= width - 30) {
                ctx.fillText(`${degrees}°`, x, height * 0.02);
            }
        });
        
        // 下部に正接値を表示
        ctx.font = '8px Arial';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#666';
        
        [30, 45, 60].forEach(deg => {
            const x = this.valueToPosition(deg, 'tan', width);
            const tanVal = Math.tan(deg * Math.PI / 180);
            if (x >= 35 && x <= width - 35) {
                ctx.fillText(`tan${deg}°=${tanVal.toFixed(3)}`, x, height * 0.98);
            }
        });
    }

    drawInverseNumbers(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        for (let i = 1; i <= 10; i++) {
            const invValue = 1 / i;
            const x = this.valueToPosition(invValue, 'inverse', width);
            if (x >= 35 && x <= width - 35) {
                ctx.fillText(`1/${i}`, x, height * 0.02);
            }
        }
    }

    drawLogLogNumbers(ctx, width, height, scaleType) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        const multiplier = scaleType === 'loglog1' ? 0.01 : scaleType === 'loglog2' ? 0.1 : 1;
        
        for (let i = 1; i <= 5; i++) {
            const expValue = Math.exp(i * multiplier);
            const x = this.valueToPosition(expValue, scaleType, width);
            if (x >= 25 && x <= width - 25) {
                ctx.fillText(i.toString(), x, height * 0.02);
            }
        }
    }

    valueToPosition(value, scaleType, width) {
        switch(scaleType) {
            case 'linear':
                // C尺・D尺: 標準対数尺 1から10の1サイクル
                const clampedLinear = Math.max(1, Math.min(10, value));
                const logValue = Math.log10(clampedLinear);
                return logValue * width; // 0から1の範囲を0からwidthにマップ
                
            case 'square':
                // A尺・B尺: 平方根尺 1から100を1から10のスケールで
                const clampedSquare = Math.max(1, Math.min(100, value));
                const sqrtValue = Math.sqrt(clampedSquare);
                const sqrtLog = Math.log10(sqrtValue);
                return sqrtLog * width; // 0から1の範囲（√1=1から√100=10）
                
            case 'cube':
                // K尺: 立方根尺 1から1000を1から10のスケールで
                const clampedCube = Math.max(1, Math.min(1000, value));
                const cubeRoot = Math.pow(clampedCube, 1/3);
                const cubeLog = Math.log10(cubeRoot);
                return cubeLog * width;
                
            case 'log':
                // L尺: 対数尺 0.001から1
                const clampedLog = Math.max(0.001, Math.min(1, value));
                return (Math.log10(clampedLog) + 3) * width / 3; // -3から0を0からwidthに
                
            case 'sin':
                // S尺: 正弦尺 0.1度から90度
                const clampedSinDeg = Math.max(0.1, Math.min(90, value));
                const sinRadians = clampedSinDeg * Math.PI / 180;
                const sinValue = Math.sin(sinRadians);
                
                // 特別な正弦尺のスケーリング
                if (clampedSinDeg <= 5.7) {
                    // 0.1°-5.7°は線形近似
                    return (clampedSinDeg / 5.7) * width * 0.1;
                } else {
                    // 5.7°-90°は対数スケール
                    const logSin = Math.log10(sinValue);
                    return (logSin + 2) * width * 0.9 / 2 + width * 0.1;
                }
                
            case 'tan':
                // T尺: 正接尺 0.1度から84度
                const clampedTanDeg = Math.max(0.1, Math.min(84, value));
                const tanRadians = clampedTanDeg * Math.PI / 180;
                const tanValue = Math.tan(tanRadians);
                
                if (clampedTanDeg <= 5.7) {
                    // 小角度は線形
                    return (clampedTanDeg / 5.7) * width * 0.1;
                } else {
                    // 大角度は対数
                    const logTan = Math.log10(tanValue);
                    return (logTan + 2) * width * 0.9 / 3 + width * 0.1;
                }
                
            case 'inverse':
                // CI尺: 逆数尺 10から1（右から左）
                const clampedInv = Math.max(1, Math.min(10, value));
                const invLog = Math.log10(clampedInv);
                return width - (invLog * width); // 右から左へ
                
            case 'loglog1':
                // LL1尺: e^(x/100) 1.01から1.105
                const ll1Value = Math.log(Math.max(1.001, Math.min(1.105, value))) * 100;
                return ll1Value * width / 10;
                
            case 'loglog2':
                // LL2尺: e^(x/10) 1.105から3
                const ll2Value = Math.log(Math.max(1.105, Math.min(3, value))) * 10;
                return ll2Value * width / 11;
                
            case 'loglog3':
                // LL3尺: e^x 3から22000
                const ll3Value = Math.log(Math.max(3, Math.min(22000, value)));
                return ll3Value * width / 10;
                
            default:
                return 0;
        }
    }

    positionToValue(position, scaleType, width) {
        switch(scaleType) {
            case 'linear':
                const logValue = position / width;
                return Math.pow(10, logValue);
                
            case 'square':
                const sqrtLogValue = position / width;
                const sqrtValue = Math.pow(10, sqrtLogValue);
                return sqrtValue * sqrtValue;
                
            case 'cube':
                const cubeLogValue = position / width;
                const cubeValue = Math.pow(10, cubeLogValue);
                return cubeValue * cubeValue * cubeValue;
                
            case 'log':
                const logPos = (position / width) * 3 - 3;
                return Math.pow(10, logPos);
                
            case 'sin':
                if (position <= width * 0.1) {
                    // 小角度域
                    return (position / (width * 0.1)) * 5.7;
                } else {
                    // 対数域
                    const logPos = ((position - width * 0.1) / (width * 0.9)) * 2 - 2;
                    const sinVal = Math.pow(10, logPos);
                    return Math.asin(Math.min(1, sinVal)) * 180 / Math.PI;
                }
                
            case 'tan':
                if (position <= width * 0.1) {
                    return (position / (width * 0.1)) * 5.7;
                } else {
                    const logPos = ((position - width * 0.1) / (width * 0.9)) * 3 - 2;
                    const tanVal = Math.pow(10, logPos);
                    return Math.atan(tanVal) * 180 / Math.PI;
                }
                
            case 'inverse':
                const invPos = (width - position) / width;
                return Math.pow(10, invPos);
                
            case 'loglog1':
                const ll1Pos = position / width * 10;
                return Math.exp(ll1Pos / 100);
                
            case 'loglog2':
                const ll2Pos = position / width * 11;
                return Math.exp(ll2Pos / 10);
                
            case 'loglog3':
                const ll3Pos = position / width * 10;
                return Math.exp(ll3Pos);
                
            default:
                return 1;
        }
    }    drawAllScales() {
        Object.keys(this.scales).forEach(scaleId => {
            if (this.scales[scaleId].visible) {
                const canvas = document.querySelector(`#scale${scaleId} .scale-canvas`);
                if (canvas) {
                    this.drawScale(canvas, this.scales[scaleId].type, scaleId);
                }
            }
        });
    }

    updateReadings() {
        Object.keys(this.scales).forEach(scaleId => {
            if (this.scales[scaleId].visible) {
                const effectivePosition = this.cursor.position - this.scales[scaleId].position;
                const value = this.positionToValue(effectivePosition, this.scales[scaleId].type, this.scaleWidth);
                const displayValue = this.formatValue(value);
                
                const readingElement = document.getElementById(`reading${scaleId}`);
                if (readingElement) {
                    readingElement.textContent = displayValue;
                }
            }
        });
    }

    updateCalculations() {
        const cPos = this.cursor.position - this.scales.C.position;
        const dPos = this.cursor.position - this.scales.D.position;
        
        const cValue = this.positionToValue(cPos, 'linear', this.scaleWidth);
        const dValue = this.positionToValue(dPos, 'linear', this.scaleWidth);
        
        // 基本計算
        const multiplication = cValue * dValue;
        document.getElementById('multiplicationResult').textContent = 
            this.formatValue(multiplication);
        
        const division = cValue / dValue;
        document.getElementById('divisionResult').textContent = 
            this.formatValue(division);
        
        const square = cValue * cValue;
        document.getElementById('squareResult').textContent = 
            this.formatValue(square);
        
        // 三角関数の計算例を表示
        this.updateTrigonometricExamples();
    }

    updateTrigonometricExamples() {
        // S尺とT尺が表示されている場合のみ
        if (this.scales.S && this.scales.S.visible) {
            const sPos = this.cursor.position - this.scales.S.position;
            const angleS = this.positionToValue(sPos, 'sin', this.scaleWidth);
            
            if (angleS >= 0.1 && angleS <= 90) {
                const sinValue = Math.sin(angleS * Math.PI / 180);
                console.log(`三角関数例: sin(${angleS.toFixed(1)}°) = ${sinValue.toFixed(4)}`);
            }
        }
        
        if (this.scales.T && this.scales.T.visible) {
            const tPos = this.cursor.position - this.scales.T.position;
            const angleT = this.positionToValue(tPos, 'tan', this.scaleWidth);
            
            if (angleT >= 0.1 && angleT <= 84) {
                const tanValue = Math.tan(angleT * Math.PI / 180);
                console.log(`三角関数例: tan(${angleT.toFixed(1)}°) = ${tanValue.toFixed(4)}`);
            }
        }
    }

    formatValue(value) {
        if (isNaN(value) || !isFinite(value)) return '-';
        
        if (value < 0.001 || value > 9999) {
            return value.toExponential(this.precision);
        }
        
        return value.toFixed(this.precision);
    }

    adjustZoom(delta) {
        this.zoom = Math.max(0.5, Math.min(3.0, this.zoom + delta));
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoom * 100)}%`;
        
        const container = document.getElementById('slideRuleContainer');
        container.style.transform = `scale(${this.zoom})`;
        container.style.transformOrigin = 'center center';
    }

    reset() {
        Object.keys(this.scales).forEach(scaleId => {
            this.scales[scaleId].position = 0;
            this.updateScalePosition(scaleId);
        });
        
        this.cursor.position = this.scaleWidth / 2; // 中央に配置
        this.updateCursorPosition();
        this.zoom = 1.0;
        document.getElementById('zoomLevel').textContent = '100%';
        
        const container = document.getElementById('slideRuleContainer');
        container.style.transform = 'scale(1)';
    }

    toggleScale(scaleId, visible) {
        const container = document.querySelector(`[data-scale="${scaleId}"]`);
        if (container) {
            container.style.display = visible ? 'flex' : 'none';
        }
        
        // 読み取り表示も切り替え
        const readingItem = document.querySelector(`[data-reading="${scaleId}"]`);
        if (readingItem) {
            readingItem.style.display = visible ? 'flex' : 'none';
        }
        
        if (visible) {
            const canvas = document.querySelector(`#scale${scaleId} .scale-canvas`);
            if (canvas) {
                this.drawScale(canvas, this.scales[scaleId].type, scaleId);
            }
        }
        
        this.updateReadings();
    }

    toggleSettings() {
        const panel = document.getElementById('settingsPanel');
        panel.classList.toggle('open');
    }

    changeTheme(theme) {
        this.theme = theme;
        document.body.className = '';
        
        if (theme !== 'dark') {
            document.body.classList.add(`theme-${theme}`);
        }
        
        // テーマ変更後に目盛りを再描画
        setTimeout(() => this.drawAllScales(), 100);
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const slideRule = new DigitalSlideRule();
    
    // ウィンドウリサイズ時の調整
    window.addEventListener('resize', () => {
        setTimeout(() => slideRule.drawAllScales(), 100);
    });
    
    // タッチデバイス対応
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        
        // ピンチズーム防止（計算尺の操作を優先）
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    // デバイス向き変更時の再描画
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            slideRule.drawAllScales();
            slideRule.updateReadings();
        }, 300);
    });
    
    // 高DPI対応
    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(() => {
            slideRule.drawAllScales();
        }, 250);
    });
    
    console.log('デジタル計算尺が初期化されました');
    console.log('操作方法:');
    console.log('- B尺とC尺をドラッグして移動');
    console.log('- オレンジのカーソルをドラッグして位置調整');
    console.log('- ズームボタンで拡大/縮小');
    console.log('- 設定ボタンでカスタマイズ');
    console.log('- Ctrl+0でリセット、Ctrl+/-でズーム');
    
    // タッチデバイスの場合の追加説明
    if (document.body.classList.contains('touch-device')) {
        console.log('- タッチ操作: 目盛りやカーソルを指でドラッグ');
        console.log('- 横スクロール: 画面を左右にスワイプ');
    }
});
