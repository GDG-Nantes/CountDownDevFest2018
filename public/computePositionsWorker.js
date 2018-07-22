const numPlanets = 10;
const planets = [];
for (let i = 0; i < numPlanets; i++){
    planets.push({
    id: `id${i}`,
    url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
    radius: 30 + ((i % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
    distance: 10 + Math.random() * 400,
    collision: false,
    iterations: 0,
    speed: (1 + Math.random() * 200),
    // Change datas
    angle: 0,
    x : 0,
    y : 0
    });

}
let continueLoop = true;
let time = 0;

function collision (p1x, p1y, r1, p2x, p2y, r2) {
    var a;
    var x;
    var y;

    a = r1 + r2;
    x = p1x - p2x;
    y = p1y - p2y;

    if ( a > Math.sqrt( (x*x) + (y*y) ) ) {
        return true;
    } else {
        return false;
    }
}


function checkCollisions() {
    for (let i = 0; i < planets.length; i++){
        for (let j = 0; j < planets.length; j++) {
            const planetI = planets[i];
            const planetJ = planets[j];
            if (planetI.iterations < 500 ||
                planetJ.iterations < 500 ||
                planetI.collision ||
                planetJ.collision ||
                planetI.id === planetJ.id)
                continue;

            const collisionDetected = collision(
                planetI.x,
                planetI.y,
                planetI.radius,
                planetJ.x,
                planetJ.y,
                planetJ.radius
            );
            planetI.collision = planetI.collision || collisionDetected;
            planetJ.collision = planetJ.collision || collisionDetected;


        }
    }
}

function movePlanets(){
    for (let planet of planets){
        planet.angle = (time / planet.speed) //% 360;
        planet.x = (planet.distance + 100) * Math.cos(planet.angle);
        planet.y = (planet.distance ) * Math.sin(planet.angle);
        planet.iterations++;
    }
}

function increasePlanets() {
    for (let planet of planets){
        if (planet.collision)
            continue;

        if (planet.iterations % 1000 === 0){
            planet.radius++;
        }
    }
}

function compute(){
    if (!continueLoop) return;

    movePlanets();

    checkCollisions();

    increasePlanets();

    postMessage({type: 'planets', data: planets});

    time++;
    setTimeout(compute,0);
}

onmessage = function(e) {
    console.log('From Worker', e.data);
    const data = e.data;
    switch(data.type){
        case 'init':
            postMessage({type: 'planets', data: planets});
            compute();
        break;
        case 'addPlanet':
            planets.push(data.planet);
        break;

    }
}