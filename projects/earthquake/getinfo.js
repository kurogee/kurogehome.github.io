const default_title = "地震情報取得ツール";

async function get_earthquake_info() {
    const response = await fetch("https://api.p2pquake.net/v2/history?codes=551&limit=1")
    .then(response => response.json());

    const info = response[0];

    let each_places_scale = info.points.map(i => { return {"place" : i.pref + " " + i.addr, "scale" : parseInt(i.scale) / 10} });
    each_places_scale.sort((a, b) => b.scale - a.scale);

    return {
        "time": info.time,
        "name": info.earthquake.hypocenter.name,
        "maxscale": info.earthquake.maxScale,
        "magnitude": info.earthquake.hypocenter.magnitude,
        "depth": info.earthquake.hypocenter.depth,
        "latitude": info.earthquake.hypocenter.latitude,
        "longitude": info.earthquake.hypocenter.longitude,
        "eachplacescale": each_places_scale
    };
}

async function put_display() {
    function change_scale(text) {
        let result;

        if (text < 0.5) {
            result = "0";
        } else if (text >= 0.5 && text < 1.5) {
            result = "1";
        } else if (text >= 1.5 && text < 2.5) {
            result = "2";
        } else if (text >= 2.5 && text < 3.5) {
            result = "3";
        } else if (text >= 3.5 && text < 4.5) {
            result = "4";
        } else if (text >= 4.5 && text < 5.0) {
            result = "5弱";
        } else if (text >= 5.0 && text < 5.5) {
            result = "5強";
        } else if (text >= 5.5 && text < 6.0) {
            result = "6弱";
        } else if (text >= 6.0 && text < 6.5) {
            result = "6強";
        } else if (text >= 6.5) {
            result = "7";
        } else {
            result = "不明";
        }

        return result;
    }

    const info = await get_earthquake_info();

    let [date, place, mag, depth, map, each_places_scale] = [$("#date"), $("#place"), $("#mag"), $("#depth"), $("#map"), $("#each_places_scale")];
    
    if (date.text() == "不明" || date.text() != info.time) {
        date.text(info.time);
        place.text(info.name);
        mag.text(info.magnitude + "M");
        depth.text(info.depth + "km");

        let mem = `<table>
        <tr>
            <th style="width: 70%;">場所</th>
            <th style="width: 30%;">震度</th>
        </tr>
        `;

        let count = 1;
        info.eachplacescale.forEach(i => {
            i.scale = change_scale(i.scale);

            if (i.scale == change_scale(parseInt(info.maxscale) / 10)) {
                mem = mem + `<tr ${count > 10 ? "class='default_none'" : ""}><td>${i.place}</td><td><span style="color: red;">${i.scale}</span></td></tr>\n`;
            } else {
                mem = mem + `<tr ${count > 10 ? "class='default_none'" : ""}><td>${i.place}</td><td>${i.scale}</td></tr>\n`;
            }
            count++;
        });

        mem += "</table>";
        each_places_scale.html(mem);

        map.attr("src", `https://maps.google.co.jp/maps?q=${info.latitude},${info.longitude}&z=8&output=embed&hl=ja`);
    }

    if ($('.default_none').length == 0) {
        $('button').prop('disabled', true);
    } else {
        $('button').prop('disabled', false);
    }
    
    console.log("updated");
}

let interval;
function main() {
    put_display();
    interval = setInterval(put_display, parseInt($("#reload_time").val()) * 1000);
}

document.getElementById("reload_time").addEventListener("change", function() {
    clearInterval(interval);
    interval = setInterval(put_display, parseInt($("#reload_time").val()) * 1000);
    console.log("changed");
});

onload = main;