function create_formula() {
    let res = "$$ ";

    const max = 50;
    const min = 1;

    let memory1 = Math.floor(Math.random() * (25 + 1 - min)) + min;
    memory1++;
    let memory2 = Math.floor(Math.random() * (10 + 1 - min)) + min;
    let memory3 = Math.floor(Math.random() * (15 + 1 - memory1)) + memory1;

    res += `\\frac {${memory1} + ${memory2}x} {${memory3}}`;

    memory1 = Math.floor(Math.random() * (25 + 1 - min)) + min;
    memory1++;
    memory2 = Math.floor(Math.random() * (10 + 1 - min)) + min;
    memory3 = Math.floor(Math.random() * (15 + 1 - memory1)) + memory1;

    res += `=\\frac {x(${memory1} - ${memory2})} {${memory3}} $$`;

    return res;
}

window.onload = () => {
    const marks = document.getElementsByClassName("mark");

    for (let mark of marks) {
        for (let i = 0; i < 5; i++) {
            mark.innerHTML += create_formula();
            mark.innerHTML += "<br><br><br>";
            console.log("ok");
        }
    }
};
