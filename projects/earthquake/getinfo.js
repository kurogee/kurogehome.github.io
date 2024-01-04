async function get_earthquake_info() {
    const response = await fetch("https://api.p2pquake.net/v2/history?codes=551&limit=1")
    .then(response => response.json());

    const info = response[0];

    return {
        "time": info.time,
        "name": info.earthquake.hypocenter.name,
        "maxscale": info.earthquake.maxScale,
        "magnitude": info.earthquake.hypocenter.magnitude,
        "depth": info.earthquake.hypocenter.depth,
        "latitude": info.earthquake.hypocenter.latitude,
        "longitude": info.earthquake.hypocenter.longitude,
        "eachplacescale": info.points.map(i => { return {"place" : i.pref + "-" + i.addr, "scale" : parseInt(i.scale) / 10} })
    };
}

async function put_display() {
    const info = await get_earthquake_info();

    let [date, place, mag, depth, map, each_places_scale] = [$("#date"), $("#place"), $("#mag"), $("#depth"), $("#map"), $("#each_places_scale")];
    
    if (date.text() == "不明" || date.text() != info.time) {
        date.text(info.time);
        place.text(info.name);
        mag.text(info.magnitude + "M");
        depth.text(info.depth + "km");

        let mem = "";
        info.eachplacescale.forEach(i => {
            if (i.scale == parseInt(info.maxscale) / 10) {
                mem = mem + `＞ 場所: ${i.place} 震度: <span style="color: red;">${i.scale}</span><br>\n`;
            } else {
                mem = mem + `＞ 場所: ${i.place} 震度: ${i.scale}<br>\n`;
            }
        });
        each_places_scale.html(mem);

        map.attr("src", `https://maps.google.co.jp/maps?q=${info.latitude},${info.longitude}&z=8&output=embed`);
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