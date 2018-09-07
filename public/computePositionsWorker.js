const numPlanets = 10;
const TIME_BEFORE_COLLISION_DETECTION = 2000;
const TIME_BEFORE_PLANET_GROW = 1000;
const MINIMUM_DISTANCE = 100;
const MAXIMUM_DISTANCE = 500;
const planets = [];
for (let i = 0; i < numPlanets; i++){
    planets.push({
    id: `id${i}`,
    url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
    radius: 30 + ((i % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
    distance: 10 + Math.random() * 400,
    collision: false,
    iterations: 0,
    speed: (300 + Math.random() * 100),
    // Change datas
    angle: 0,
    score: 0,
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
            if (planetI.iterations < TIME_BEFORE_COLLISION_DETECTION ||
                planetJ.iterations < TIME_BEFORE_COLLISION_DETECTION ||
                (planetI.iterations < 2 * TIME_BEFORE_COLLISION_DETECTION
                    && planetI.distance < MINIMUM_DISTANCE) ||
                (planetJ.iterations < 2 * TIME_BEFORE_COLLISION_DETECTION
                    && planetJ.distance < MINIMUM_DISTANCE) ||
                planetI.collision ||
                planetJ.collision ||
                planetI.id === planetJ.id){
                continue;
            }

            const collisionDetected = collision(
                planetI.x,
                planetI.y,
                planetI.radius / 2,
                planetJ.x,
                planetJ.y,
                planetJ.radius / 2
            );
            const collisionIWithSun = collision(
                planetI.x,
                planetI.y,
                planetI.radius / 2,
                0,
                0,
                100
            );
            const collisionJWithSun = collision(
                planetJ.x,
                planetJ.y,
                planetJ.radius / 2,
                0,
                0,
                100
            );

            planetI.collision = planetI.collision || collisionDetected || planetI.distance < MINIMUM_DISTANCE || collisionIWithSun;
            planetJ.collision = planetJ.collision || collisionDetected || planetJ.distance < MINIMUM_DISTANCE || collisionJWithSun;


        }
    }
}

function movePlanets(){
    for (let planet of planets){
        planet.angle = (time / planet.speed) //% 360;
        let distanceToUse = planet.distance;
        if (planet.iterations < TIME_BEFORE_COLLISION_DETECTION){
            distanceToUse = (planet.iterations / TIME_BEFORE_COLLISION_DETECTION) * planet.distance;
        }else if (planet.distance < MINIMUM_DISTANCE){
            const iterations = planet.iterations - TIME_BEFORE_COLLISION_DETECTION;
            const percentIteration = iterations / TIME_BEFORE_COLLISION_DETECTION;
            distanceToUse = planet.distance - (percentIteration * planet.distance);
        }
        planet.x = (distanceToUse + 100) * Math.cos(planet.angle);
        planet.y = (distanceToUse ) * Math.sin(planet.angle);
        planet.iterations++;
    }
}

function increasePlanets() {
    for (let planet of planets){
        if (planet.collision)
            continue;

        planet.score++;
        if (planet.iterations % TIME_BEFORE_PLANET_GROW === 0){
            planet.radius++;
        }
    }
}

function reorder(planetsToSort) {
    if (!planetsToSort)
        return []
    return planetsToSort.sort((planetA, planetB) => planetB.score - planetA.score);
}

function compute(){
    if (!continueLoop) return;

    movePlanets();

    checkCollisions();

    increasePlanets();

    reorder();

    postMessage({type: 'planets', data: reorder(planets)});

    time++;
    setTimeout(compute,0);
}

onmessage = function(e) {
    //console.log('From Worker', e.data);
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