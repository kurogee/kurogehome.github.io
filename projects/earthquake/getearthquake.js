

async function get() {
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