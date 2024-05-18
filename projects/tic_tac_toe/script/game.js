
let mass = [];
let putMass;
let allow;
let player;
let player_cards;
let playCount;

function resetMass() {
    // massを3x3で、全て0埋めする
    mass = Array.from({ length: 3 }, () => Array(3).fill(0));
    putMass = [[0, 0], [0, 0]];
    playCount = [0, 0];
    allow = [true, true];
    player = 1;
    player_cards = [[1, 1, 1, 2, 2, 3], [1, 1, 1, 2, 2, 3]];
}

function setMass(x, y) {
    // もしmass[y][x]が0でない場合は、何もしない
    if (mass[y][x] !== 0) {
        return;
    }

    // massのx,yの位置にvalueを代入する
    mass[y][x] = player;
    playCount[player - 1]++;

    let nowMass = mass.reduce((a, b) => a.concat(b));
    if (player == 1 && playCount[0] % 2 != 0 && playCount[0] > 1) {
        // 自分の埋めたマスの中で、ランダムに1つを選ぶ
        let randomMass = nowMass.map((v, i) => v === 1 ? i : -1).filter((v) => v !== -1);
        let random = Math.floor(Math.random() * randomMass.length);
        let randomX = randomMass[random] % 3;
        let randomY = Math.floor(randomMass[random] / 3);
        putMass[0] = [randomX, randomY];
    }
    
    if (player == 2 && playCount[1] % 2 != 0 && playCount[1] > 1) {
        // 自分の埋めたマスの中で、ランダムに1つを選ぶ
        let randomMass = nowMass.map((v, i) => v === 2 ? i : -1).filter((v) => v !== -1);
        let random = Math.floor(Math.random() * randomMass.length);
        let randomX = randomMass[random] % 3;
        let randomY = Math.floor(randomMass[random] / 3);
        putMass[1] = [randomX, randomY];
    }

    if (player == 1 && playCount[0] % 2 == 0 && playCount[0] > 2) {
        mass[putMass[0][1]][putMass[0][0]] = 0;
    }
    
    if (player == 2 && playCount[1] % 2 == 0 && playCount[1] > 2) {
        mass[putMass[1][1]][putMass[1][0]] = 0;
    }

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
    }
}

function swapMass(x1, y1, x2, y2) {
    // massのx1,y1とx2,y2の位置を入れ替える
    let tmp = mass[y1][x1];
    mass[y1][x1] = mass[y2][x2];
    mass[y2][x2] = tmp;
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
        if (mass[i].every((v) => v === CheckPlayer)) {
            winType = "横";
            return [true, winType];
        }
    }

    // 縦
    for (let i = 0; i < mass.length; i++) {
        if (mass.every((v) => v[i] === CheckPlayer)) {
            winType = "縦";
            return [true, winType];
        }
    }

    // 斜め
    if (mass[0][0] === CheckPlayer && mass[1][1] === CheckPlayer && mass[2][2] === CheckPlayer) {
        winType = "右下がり斜め";
        return [true, winType];
    }
    if (mass[0][2] === CheckPlayer && mass[1][1] === CheckPlayer && mass[2][0] === CheckPlayer) {
        winType = "右上がり斜め";
        return [true, winType];
    }

    // 引き分け
    if (mass.every((v) => v.every((w) => w !== 0))) {
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
            if (player == 2 && playCount[0] % 2 != 0 && playCount[0] > 1) {
                // 次消されるところを灰色にする
                if (putMass[0][0] == j && putMass[0][1] == i) {
                    html += `
                    <td class="mass_cell">
                        <button class="button" style="background-color: #d3d3d3;">
                            ${mass[i][j] === 1 ? "○" : mass[i][j] === 2 ? "×" : "　"}
                        </button>
                    </td>`;
                } else {
                    html += `
                    <td class="mass_cell">
                        <button class="button" onclick="setMass(${j}, ${i});">
                            ${mass[i][j] === 1 ? "○" : mass[i][j] === 2 ? "×" : "　"}
                        </button>
                    </td>`;
                }

                continue;
            }
            
            if (player == 1 && playCount[1] % 2 != 0 && playCount[1] > 1) {
                // 次消されるところを灰色にする
                if (putMass[1][0] == j && putMass[1][1] == i) {
                    html += `
                    <td class="mass_cell">
                        <button class="button" style="background-color: #d3d3d3;">
                            ${mass[i][j] === 1 ? "○" : mass[i][j] === 2 ? "×" : "　"}
                        </button>
                    </td>`;
                } else {
                    html += `
                    <td class="mass_cell">
                        <button class="button" onclick="setMass(${j}, ${i});">
                            ${mass[i][j] === 1 ? "○" : mass[i][j] === 2 ? "×" : "　"}
                        </button>
                    </td>`;
                }

                continue;
            }
            
            html += `
            <td class="mass_cell">
                <button class="button" onclick="setMass(${j}, ${i});">
                    ${mass[i][j] === 1 ? "○" : mass[i][j] === 2 ? "×" : "　"}
                </button>
            </td>`;
        }
        html += "</tr>";
    }
    html += "</table>";

    elem.append(html);
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
    // #gameオブジェクトを生成する
    // もしすでに存在する場合は、中身を削除する
    if ($("#game").length) {
        $("#game").empty();
    }

    if ($("#message").length) {
        $("#message").empty();
    }

    $(".display").append("<div id='game'></div>");
    $(".display").append("<div id='message'></div>");
    $("#message").html(`<p>Player${player}(${player == 1 ? "○" : "×"}) のターンです</p>`);
    showMass($("#game"));
}