<template>
  <div id="canvas-container">
    <canvas ref="my-canvas"></canvas>
    <img src="./assets/sun.png" ref="sun" style="display:none">
		<!--<Score v-bind:planets="dataWithPlanets.planets"></Score>-->
  </div>
</template>

<script>
// https://alligator.io/vuejs/vue-html5-canvas/

import Score from './components/Score.vue'
import firebase from 'firebase/app'
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


export default {
	name: 'countdown',
	components: {Score},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			provider: {
				// This is the CanvasRenderingContext that children will draw to.
				context: null,
			},
			dataWithPlanets: {
				planets:[]
			},
			imagesLoad: [],
      images: [],
      planets: [],
			stars: [],
			worker: null,
			time: 1,
		};
	},
	methods: {
		loadSprite: function(sprite) {
      if (this.imagesLoad[sprite.title]) return;

			this.imagesLoad[sprite.title] = true;
			return new Promise((resolve, reject) => {
				var image = new Image();
				image.src = sprite.url;
				image.onload = () => {
					this.images[sprite.title] = image;
					resolve(sprite);
				};
				image.onerror = () => {
					reject(sprite);
				};
			});
		},

		imageFromUrl: function(path, radius, color, x, y) {
			if (!this.provider.context) return;

      const ctx = this.provider.context;
      if (!this.images[path]) {
        this.loadSprite({url: path, title: path})
        return;
      }

      ctx.save()
      ctx.beginPath();
			ctx.fillStyle = color;
      ctx.arc(x, y, radius /2, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock
      ctx.fill();
			ctx.closePath()
      ctx.clip()

      const img = this.images[path]
      ctx.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
      ctx.restore();
		},
		image: function(img, radius, color, x, y) {
			if (!this.provider.context) return;

      const ctx = this.provider.context;
       ctx.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
		},
		circle: function(radius, color, x, y) {
      if (!this.provider.context) return;

			const ctx = this.provider.context;
			ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock

			ctx.fill();
			ctx.closePath();
		},

		circleStroke: function(radius, strokeColor, x, y, lineWidth) {
			if (!this.provider.context) return;
			const ctx = this.provider.context;

			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
			ctx.closePath();
		},

		line: function(ax, ay, bx, by) {
			if (!this.provider.context) return;
			const ctx = this.provider.context;

			ctx.beginPath();
			ctx.moveTo(ax * 2, ay);
			ctx.lineTo(bx, by);
			ctx.strokeStyle = 'rgba(255, 255, 255,0.12)';
			ctx.stroke();
			ctx.closePath();
		},

		text: function(text, color, font, x, y) {
			if (!this.provider.context) return;
			const ctx = this.provider.context;

			ctx.beginPath();
			ctx.font = font;
			ctx.fillStyle = color;
			ctx.fillText(text, x, y);
			ctx.closePath();
			//console.log(text);
    },

    star: function(star) {
      if (!this.provider.context) return;
      const ctx = this.provider.context;

      // Change the opacity
      if(star.opacity > 1) {
        star.factor = -1;
      }
      else if(star.opacity <= 0) {
        star.factor = 1;

        star.x = Math.round(Math.random() * this.provider.cw);
        star.y = Math.round(Math.random() * this.provider.ch);
      }

      star.opacity += star.increment * star.factor;

      ctx.beginPath()
      for (var i = 5; i--;) {
        ctx.lineTo(0, star.length);
        ctx.translate(0, star.length);
        ctx.rotate((Math.PI * 2 / 10));
        ctx.lineTo(0, - star.length);
        ctx.translate(0, - star.length);
        ctx.rotate(-(Math.PI * 6 / 10));
      }
      ctx.lineTo(0, star.length);
      ctx.closePath();
      ctx.fillStyle = "rgba(255, 255, 200, " + star.opacity + ")";
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#ffff33';
      ctx.fill();
    },

		animate: function() {
			if (!this.provider.context) return;
			const ctx = this.provider.context;
			const time = this.time;
			const cw = this.provider.cw;
			const ch = this.provider.ch;

			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, cw, ch);
      ctx.closePath();

      // Stars
      for (let star of this.stars) {
        ctx.save();
        ctx.translate(star.x,star.y);
        this.star(star);
        ctx.restore();
      }

			//Sun - center
			ctx.translate(cw / 2, ch / 2);
			this.image(this.$refs['sun'], 100, 'yellow', 0, 0);

			const planets = this.dataWithPlanets.planets.slice();
      for (let planet of planets){
				//JF
				if (!planet.collision){

					ctx.save();
					ctx.translate(planet.x, planet.y);
					this.imageFromUrl(planet.url, planet.radius, '#898989', 0, 0);

					ctx.restore();
				}
      }


      /*//Mercury white line
			this.circleStroke(40, '#1c1c1c', 0, 0, '1');

      //Mercury
			ctx.rotate(time / 30);
			ctx.translate(40, 0);
			this.circle(3.8, '#898989', 0, 0);

			this.line(-40, 0, 0, 0);

			//Venus white line
			ctx.translate(-40, 0); //reset translate
			this.circleStroke(60, '#1c1c1c', 0, 0, '1');
			*/

			ctx.restore();
			this.time++;
			//  console.log(time);
			window.requestAnimationFrame(this.animate.bind(this));
		},
	},

	// Allows any child component to `inject: ['provider']` and have access to it.
	provide() {
		return {
			provider: this.provider,
		};
	},

	mounted() {
		// We can't access the rendering context until the canvas is mounted to the DOM.
		// Once we have it, provide it to all child components.
		this.provider.canvas = this.$refs['my-canvas'];
		this.provider.context = this.$refs['my-canvas'].getContext('2d');

		// Resize the canvas to fit its parent's width.
		// Normally you'd use a more flexible resize system.
		this.$refs['my-canvas'].width = this.$refs[
			'my-canvas'
		].parentElement.clientWidth;
		this.$refs['my-canvas'].height = this.$refs[
			'my-canvas'
		].parentElement.clientHeight;
		this.provider.cw = this.$refs['my-canvas'].width;
		this.provider.ch = this.$refs['my-canvas'].height;


    // Create all the stars
    const numStars = 200;
    for(let i = 0; i < numStars; i++) {
      const x = Math.round(Math.random() * this.provider.cw);
      const y = Math.round(Math.random() * this.provider.ch);
      const length = 1 + Math.random() * 2;
      const opacity = Math.random();

      // Create a new star and draw
      const star = {x, y, length, opacity, factor: 1, increment: Math.random() * 0.03};

      // Add the the stars array
      this.stars.push(star);
    }

		this.worker = new Worker('./computePositionsWorker.js');


		firestore.collection("planets").where("init", "==", true)
    	.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {

								this.worker.postMessage({
									type: 'addPlanet',
									planet : change.doc.data()
								});
                console.log("New planet: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified planet: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed planet: ", change.doc.data());
            }
        });
    });

		setTimeout(() => {
			this.worker.postMessage({
				type: 'init'
			});
		}, 1000);

		this.worker.onmessage = function(e) {
			const data = e.data;
			// console.log('Worker from vue receive message', data);
			switch(data.type){
				case 'planets':
				this.dataWithPlanets.planets.length = 0;
				this.dataWithPlanets.planets.push(...data.data);
				break;
			}
		}.bind(this);


		this.animate();
	},

};
</script>

<style>
#canvas-container {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	position: absolute;
	margin: 0;
	padding: 0;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
}

canvas {
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	margin: 0;
	padding: 0;
}

Score {
	position: absolute;
	width: 200px;
	top: 0;
	right: 0;
	height: 100%;
}
</style>
