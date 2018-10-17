<template>
	<div id="canvas-container">
		<canvas ref="my-canvas"></canvas>
		<img src="../assets/sun.png" ref="sun" style="display:none">
	</div>
</template>


<script>
import StarHelper from '../utils/canvas/StarHelper.js';
import PlanetHelper from '../utils/canvas/PlanetHelper.js';
import ExplosionHelper from '../utils/canvas/ExplosionHelper.js';

export default {
	name: 'Galaxy',
	data() {
		return {
			// This is the CanvasRenderingContext that children will draw to.
			context: null,
			imagesLoad: [],
			images: [],
			stars: [],
			explosions: [],
			sunIncrementFactor: 0.02,
			sunOpacity: 0.9,
			stopFrames: false,
		};
	},
	methods: {
		image(img, radius) {
			this.context.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				0 - radius / 2,
				0 - radius / 2,
				radius,
				radius,
			);
		},

		drawBackground() {
			this.context.save();
			this.context.beginPath();
			this.context.fillStyle = '#302c33'; //#637b7a
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			const gradient = this.context.createRadialGradient(
				this.canvas.width / 2, //x0
				this.canvas.height / 2, // y0
				10 + Math.random() * 5, //r0
				this.canvas.width / 2, // x1
				this.canvas.height / 2, // y1
				500 + Math.random() * 5, //r1
			);
			gradient.addColorStop(0, '#637b7a');
			gradient.addColorStop(1, '#302c33');
			this.context.fillStyle = gradient;
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.closePath();
		},

		drawSun() {
			this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
			if (this.sunOpacity > 1) {
				this.sunIncrementFactor = -this.sunIncrementFactor;
			} else if (this.sunOpacity < 0.9) {
				this.sunIncrementFactor = -this.sunIncrementFactor;
			}
			this.sunOpacity += this.sunIncrementFactor;
			this.context.globalAlpha = this.sunOpacity;
			this.image(this.$refs['sun'], 200 + Math.random() * 5);
			this.context.globalAlpha = 1;
		},

		animate() {
			if (!this.context) return;

			this.drawBackground();
			this.starHelper.drawStars();
			this.drawSun();

			// We take a copy to show planets
			if (this.planets) {
				const planets = this.planets.slice();
				for (let planet of planets) {
					if (!planet.collision) {
						this.planetHelper.drawPlanet(planet);
					}
				}
				this.explosionHelper.renderExplosions();
			}
			this.context.restore();
			if (!this.stopFrames) {
				window.requestAnimationFrame(this.animate.bind(this));
			}
		},
		explodedPlanet(planet) {
			this.explosionHelper.explose(planet);
		},
		setPlanets(planets) {
			this.planets = planets;
		},
		stopFramesFunction() {
			this.stopFrames = true;
		},
	},

	mounted() {
		// We can't access the rendering context until the canvas is mounted to the DOM.
		this.canvas = this.$refs['my-canvas'];
		this.context = this.canvas.getContext('2d');

		// Resize the canvas to fit its parent's width.
		this.canvas.width = this.canvas.parentElement.clientWidth;
		this.canvas.height = this.canvas.parentElement.clientHeight;

		// Create all the stars
		this.starHelper = new StarHelper(this.canvas, this.context);
		this.planetHelper = new PlanetHelper(this.canvas, this.context);
		this.explosionHelper = new ExplosionHelper(this.canvas, this.context);

		this.animate();
	},
};
</script>

<style>
#canvas-container,
#canvas-container canvas {
	position: absolute;
	margin: 0;
	padding: 0;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
