
let mass = [];
let putMass;
let player;
let player_cards;
let playCount;

function resetMass() {
    // massを3x3で、全て0埋めする
    mass = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => [0, 0]));
    putMass = [[0, 0], [0, 0]];
    playCount = [0, 0];
    player = 1;
    player_cards = [[1, 1, 1, 2, 2, 3], [1, 1, 1, 2, 2, 3]];
}

function setMass(x, y) {
    // もしmass[y][x]が0でない場合は、何もしない
    if (mass[y][x][0] !== 0) {
        return;
    }

    // massのx,yの位置にvalueを代入する
    mass[y][x][0] = player;
    console.log(mass);
    playCount[player - 1]++;

    console.log(playCount[0], playCount[1]);
    showMass($("#game"));

    let check = checkWin();
    if (check[0]) {
        if (check[1] == "引き分け") {
            $("#message").html(`<p>引き分けです！</p>`);
        } else {
            $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) の勝利です！</p>`);
        }

        // game画面を操作不能にする
        const s = document.querySelectorAll("#game > table > tbody > tr > td > button");
        for (const e of s) {
            e.disabled = true;
        }
    } else {
        changePlayer();
        $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) のターンです</p>`);
        // プレイヤーの持ちカードを表示する
        showCards($("#myCards"));
    }
}

function swapMass(x1, y1, x2, y2) {
    // massのx1,y1とx2,y2の位置を入れ替える
    let tmp = mass[y1][x1][0];
    mass[y1][x1][0] = mass[y2][x2][0];
    mass[y2][x2][0] = tmp;
}

function checkWin() {
    // massの中身を確認して、現在のplayerが勝利しているか確認する
    // 勝利している場合はtrueを返す
    // そうでない場合はfalseを返す
    // 勝利条件は、横、縦、斜めのいずれかで、3つのマスがplayerで埋まっている場合

    let CheckPlayer = player;
    let winType = "";

    // 横
    for (let i = 0; i < mass.length; i++) {
        if (mass[i].every((v) => v[0] === CheckPlayer)) {
            winType = "横";
            return [true, winType];
        }
    }

    // 縦
    for (let i = 0; i < mass.length; i++) {
        if (mass.every((v) => v[i][0] === CheckPlayer)) {
            winType = "縦";
            return [true, winType];
        }
    }

    // 斜め
    if (mass[0][0][0] === CheckPlayer && mass[1][1][0] === CheckPlayer && mass[2][2][0] === CheckPlayer) {
        winType = "右下がり斜め";
        return [true, winType];
    }
    if (mass[0][2][0] === CheckPlayer && mass[1][1][0] === CheckPlayer && mass[2][0][0] === CheckPlayer) {
        winType = "右上がり斜め";
        return [true, winType];
    }

    // 引き分け
    if (mass.every((v) => v.every((w) => w[0] !== 0))) {
        return [true, "引き分け"];
    }

    return [false, ""];
}

function showMass(elem) {
    // massの中身をtableで表示する
    // tableは正方形、3x3、すべてボタン要素で、ボタンのdata-x, data-yに座標を持たせる
    elem.empty();

    let html = "<table>";
    for (let i = 0; i < mass.length; i++) {
        html += "<tr>";
        for (let j = 0; j < mass[i].length; j++) {
            html += `
            <td class="mass_cell">
                <button class="button" onclick="setMass(${j}, ${i});" data-x="${j}" data-y="${i}">
                    ${mass[i][j][0] === 1 ? `<span style="color: red;">${mass[i][j][1]}</span>` :
                        mass[i][j][0] === 2 ? `<span style="color: blue;">${mass[i][j][1]}</span>` : "　"}
                </button>
            </td>`;
        }
        html += "</tr>";
    }
    html += "</table>";

    elem.append(html);
}

function showCards(elem) {
    // プレイヤーの持ちカードを横一列に表示する
    elem.empty();

    let html = "<table>";
    html += "<tr>";
    for (let i = 0; i < player_cards[player - 1].length; i++) {
        html += `
        <td class="cards">
            ${player_cards[player - 1][i]}
        </td>`;
    }
    html += "</tr>";
    html += "</table>";

    elem.append(html);

    // jquery uiでドラッグアンドドロップを有効にする
    $(".cards").draggable();
    $(".mass_cell").droppable({
        accept: ".cards",
        drop: function(event, ui) {
            let x = $(this).find("button").data("x");
            let y = $(this).find("button").data("y");
            let card = ui.draggable.text();
            let index = player_cards[player - 1].indexOf(parseInt(card));
            if (index !== -1) {
                player_cards[player - 1].splice(index, 1);
                // もしmass[y][x]が0でない場合は、その数を比べて大きかったら置き換える
                if (mass[y][x][0] !== 0) {
                    if (mass[y][x][1] < parseInt(card)) {
                        player_cards[player - 1].push(mass[y][x][1]);
                        player_cards[player - 1].sort((a, b) => a - b);
                        mass[y][x][1] = parseInt(card);
                    } else {
                        return;
                    }
                }
                
                mass[y][x][0] = player;
                mass[y][x][1] = parseInt(card);
                playCount[player - 1]++;
                showMass($("#game"));
                ui.draggable.remove();
                let check = checkWin();
                if (check[0]) {
                    if (check[1] == "引き分け") {
                        $("#message").html(`<p>引き分けです！</p>`);
                    } else {
                        $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) の勝利です！</p>`);
                    }
                    // game画面を操作不能にする
                    const s = document.querySelectorAll("#game > table > tbody > tr > td > button");
                    for (const e of s) {
                        e.disabled = true;
                    }
                } else {
                    changePlayer();
                    $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) のターンです</p>`);
                    // プレイヤーの持ちカードを表示する
                    showCards($("#myCards"));
                }
            }
        }
    });
}

function changePlayer() {
    // playerを交代する
    player = player === 1 ? 2 : 1;
}

function init() {
    // massを初期化する
    resetMass();
}

function new_game() {
    // ゲームを初期化する
    init();
    
    $("#game").empty();
    $("#message").empty();
    $("#myCards").empty();

    $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) のターンです</p>`);
    showMass($("#game"));
    showCards($("#myCards"));
}