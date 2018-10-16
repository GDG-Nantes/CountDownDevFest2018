const TIME_BEFORE_COLLISION_DETECTION = 2000;
const TIME_BEFORE_PLANET_GROW = 1000;
const MINIMUM_DISTANCE = 100;
const MAXIMUM_DISTANCE = 500;
const SUN_RADIUS = 200;
const planets = [];
/*
// Generate randoms planets for tests
const numPlanets = 50;
for (let i = 0; i < numPlanets; i++){
    planets.push({
    id: `id${i}`,
    name: `name${i}`,
    url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
    radius: 30 + ((i % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
    distance: 10 + Math.random() * 350,
    collision: false,
    iterations: 0,
    speed: (300 + Math.random() * 100),
    init: true,
    // Change datas
    angle: 0,
    score: 0,
    x : 0,
    y : 0
    });

}
*/
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
                !planetI.init ||
                !planetJ.init ||
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
                SUN_RADIUS / 2
            );
            const collisionJWithSun = collision(
                planetJ.x,
                planetJ.y,
                planetJ.radius / 2,
                0,
                0,
                SUN_RADIUS / 2
            );

            planetI.collision = planetI.collision || collisionDetected || planetI.distance < MINIMUM_DISTANCE || collisionIWithSun;
            planetJ.collision = planetJ.collision || collisionDetected || planetJ.distance < MINIMUM_DISTANCE || collisionJWithSun;


        }
    }
}

function movePlanets(){
    for (let planet of planets){
        if (planet.collision || !planet.init){
            continue;
        }
        planet.angle = (time / planet.speed) //% 360;
        let distanceToUse = planet.distance;
        if (planet.iterations < TIME_BEFORE_COLLISION_DETECTION){
            distanceToUse = (planet.iterations / TIME_BEFORE_COLLISION_DETECTION) * planet.distance;
        }else if (planet.distance < MINIMUM_DISTANCE){
            const iterations = planet.iterations - TIME_BEFORE_COLLISION_DETECTION;
            const percentIteration = iterations / TIME_BEFORE_COLLISION_DETECTION;
            distanceToUse = planet.distance - (percentIteration * planet.distance);
        }
        planet.x = (distanceToUse + 250) * Math.cos(planet.angle);
        planet.y = (distanceToUse ) * Math.sin(planet.angle);
        planet.iterations++;
    }
}

function increasePlanets() {
    for (let planet of planets){
        if (planet.collision || !planet.init)
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

    postMessage({type: 'planets', data: reorder(planets)});

    planets.forEach(planet => {
        planet.init = !planet.collision;
    })

    time++;
    setTimeout(compute,10);
}

onmessage = function(e) {
    //console.log('From Worker', e.data);
    const data = e.data;
    switch(data.type){
        case 'init':
            postMessage({type: 'planets', data: planets});
            compute();
        break;
        case 'addOrUpdatePlanet':
            const indexPlanetToUpdate = planets.findIndex(tempPlanet => tempPlanet.id === data.planet.id);
            if (indexPlanetToUpdate !== -1){
                console.log('Planet Update ');
                const planetToUpdate = planets[indexPlanetToUpdate];
                planets[indexPlanetToUpdate] = { ...planetToUpdate, ...data.planet };
                // Will update values of planet
            } else {
                planets.push(data.planet);
            }
        break;
        case 'removePlanet':
            const indexPlanetToRemove = planets.findIndex(tempPlanet => tempPlanet.id === data.planet.id);
            if (indexPlanetToRemove !== -1){
                const planetToRemove = planets[indexPlanetToRemove];
                planets[indexPlanetToRemove] = {...planetToRemove, ...{
                    collision: true,
                    iterations: 0
                }};
            }
        break;
        case 'stopLoop':
            continueLoop = false;
        break;

    }
}