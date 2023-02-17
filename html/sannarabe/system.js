var m1 = 0;
var m2 = 0;
var m3 = 0;
var m4 = 0;
var m5 = 0;
var m6 = 0;
var m7 = 0;
var m8 = 0;
var m9 = 0;
var now = 1;

document.getElementById("ima").innerHTML = "最初は◎の番";
 
function maru(){
    now = 1;
    document.getElementById("ima").innerHTML = "次は◎の番";
}
function batu(){
    now = 2;
    document.getElementById("ima").innerHTML = "次は△の番";
}
function keikoku(){
    alert("既に使われています!");
}
function next(mae){
    if(mae == 1){
        batu();
    }else if(mae == 2){
        maru();
    }
}
function click1(){
    if(m1 == 1 || m1 == 2){
        keikoku();
        next(now);
    }else{
        if(now == 1){
            m1 = 1;
            document.getElementById("masu1").innerHTML = "◎";
            document.getElementById("masu1").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m1 = 2;
            document.getElementById("masu1").innerHTML = "△";
            document.getElementById("masu1").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click2(){
    if(m2 == 1 || m2 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m2 = 1;
            document.getElementById("masu2").innerHTML = "◎";
            document.getElementById("masu2").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m2 = 2;
            document.getElementById("masu2").innerHTML = "△";
            document.getElementById("masu2").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click3(){
    if(m3 == 1 || m3 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m3 = 1;
            document.getElementById("masu3").innerHTML = "◎";
            document.getElementById("masu3").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m3 = 2;
            document.getElementById("masu3").innerHTML = "△";
            document.getElementById("masu3").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click4(){
    if(m4 == 1 || m4 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m4 = 1;
            document.getElementById("masu4").innerHTML = "◎";
            document.getElementById("masu4").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m4 = 2;
            document.getElementById("masu4").innerHTML = "△";
            document.getElementById("masu4").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click5(){
    if(m5 == 1 || m5 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m5 = 1;
            document.getElementById("masu5").innerHTML = "◎";
            document.getElementById("masu5").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m5 = 2;
            document.getElementById("masu5").innerHTML = "△";
            document.getElementById("masu5").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click6(){
    if(m6 == 1 || m6 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m6 = 1;
            document.getElementById("masu6").innerHTML = "◎";
            document.getElementById("masu6").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m6 = 2;
            document.getElementById("masu6").innerHTML = "△";
            document.getElementById("masu6").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click7(){
    if(m7 == 1 || m7 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m7 = 1;
            document.getElementById("masu7").innerHTML = "◎";
            document.getElementById("masu7").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m7 = 2;
            document.getElementById("masu7").innerHTML = "△";
            document.getElementById("masu7").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click8(){
    if(m8 == 1 || m8 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m8 = 1;
            document.getElementById("masu8").innerHTML = "◎";
            document.getElementById("masu8").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m8 = 2;
            document.getElementById("masu8").innerHTML = "△";
            document.getElementById("masu8").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function click9(){
    if(m9 == 1 || m9 == 2){
        keikoku();
        
    }else{
        if(now == 1){
            m9 = 1;
            document.getElementById("masu9").innerHTML = "◎";
            document.getElementById("masu9").style.backgroundColor = "green";
            var x = hantei();
            if(x == 1){
                return;
            }
        }else{
            m9 = 2;
            document.getElementById("masu9").innerHTML = "△";
            document.getElementById("masu9").style.backgroundColor = "blue";
            var x = hantei();
            if(x == 1){
                return;
            }
        }
        next(now);
    }
}
function hantei(){
    if(now == 1){
        if(m1 == 1 && m2 == 1 && m3 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m4 == 1 && m5 == 1 && m6 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m7 == 1 && m8 == 1 && m9 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m1 == 1 && m5 == 1 && m9 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m3 == 1 && m5 == 1 && m7 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m1 == 1 && m4 == 1 && m7 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m2 == 1 && m5 == 1 && m8 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m3 == 1 && m6 == 1 && m9 == 1){
            document.getElementById("ima").innerHTML = "<h2>◎ の勝ち!</h2>";
            console.log("◎ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else{
            return 0;
        }
    }else if(now == 2){
        if(m1 == 2 && m2 == 2 && m3 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m4 == 2 && m5 == 2 && m6 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m7 == 2 && m8 == 2 && m9 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m1 == 2 && m5 == 2 && m9 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m3 == 2 && m5 == 2 && m7 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m1 == 2 && m4 == 2 && m7 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m2 == 2 && m5 == 2 && m8 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else if(m3 == 2 && m6 == 2 && m9 == 2){
            document.getElementById("ima").innerHTML = "<h2>△ の勝ち!</h2>";
            console.log("△ の勝ち!");
            document.getElementById("ima").style.color = "red";
            return 1;
        }else{
            return 0;
        }
    }
}