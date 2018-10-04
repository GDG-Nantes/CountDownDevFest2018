<template>
	<div id="canvas-container">
		<canvas ref="my-canvas"></canvas>
		<img src="../assets/sun.png" ref="sun" style="display:none">
	</div>
</template>


<script>

import {TIME_BEFORE_COLLISION_DETECTION} from '../utils/const.js';
import StarHelper from '../utils/canvas/StarHelper.js';
import PlanetHelper from '../utils/canvas/PlanetHelper.js';

export default {
	name: 'Galaxy',
	props: {
		planets: Array
	},
	data() {
		return {
			// This is the CanvasRenderingContext that children will draw to.
			context: null,
			imagesLoad: [],
			images: [],
			stars: [],
		};
	},
	methods: {
		image: function(img, radius, color, x, y) {
			this.context.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
		},

		drawBackground: function() {

			this.context.save();
			this.context.beginPath();
			this.context.fillStyle = '1a1a1a';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.closePath();
		},


		drawSun: function() {
			this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
			this.image(this.$refs['sun'], 100, 'yellow', 0, 0);
		},


		animate: function() {
			if (!this.context) return;

			this.drawBackground();
			this.starHelper.drawStars();
			this.drawSun();

			// We take a copy to show planets
			const planets = this.planets.slice();
			for (let planet of planets){
				if (!planet.collision){
					this.planetHelper.drawPlanet(planet);
				}
			}
			this.context.restore();
			window.requestAnimationFrame(this.animate.bind(this));
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

		this.animate();
	},

};
</script>

<style>
#canvas-container, #canvas-container canvas  {
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
