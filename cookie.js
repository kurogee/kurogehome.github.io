function checker() {
    return localStorage.getItem("blink_setting");
}

function change() {
    let html = document.getElementsByTagName("a");

    if (localStorage.getItem("blink_setting") == "false") {
        console.log("設定の適用");
        for (let i = 0; i < html.length; i++){
            console.log(i);
            html[i].target = "_self";
        }
    }
}

function reset() {
    localStorage.setItem("blink_setting", null);
    location.reload();
}

function toroku() {
    if (checker() == null || checker() == "null") {
        let check = confirm("ページ設定が無効です　設定しますか？\n設定は一度だけで、すぐにすみます\n※設定を拒否した場合、デフォルトの設定内容になります");
        if (check == true) {
            let blick_check = confirm("設定1: ページを新しいタブで開くことを許可しますか？\n[Yes = OK / No = キャンセル]");
            if (blick_check == false) {
                localStorage.setItem("blink_setting", false);
                alert("設定が完了しました。");
            } else {
                localStorage.setItem("blink_setting", true);
                alert("設定が完了しました。");
            }
        } else {
            localStorage.setItem("blink_setting", true);
        }
    }
}


onload = function() {
    toroku();
    change();
}
