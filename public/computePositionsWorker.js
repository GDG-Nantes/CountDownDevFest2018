const numPlanets = 10;
const planets = [];
for (let i = 0; i < numPlanets; i++){
    planets.push({
    url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
    radius: 30 + ((i % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
    distance: 10 + Math.random() * 400,
    speed: (1 + Math.random() * 200),
    // Change datas
    angle: 0,
    x : 0,
    y : 0
    });

}
let continueLoop = true;
let time = 0;


function compute(){
    if (!continueLoop) return;


    for (let planet of planets){
        planet.angle = (time / planet.speed) //% 360;
        planet.x = (planet.distance + 100) * Math.cos(planet.angle);
        planet.y = (planet.distance ) * Math.sin(planet.angle);
    }

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

    }
}