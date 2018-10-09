<template>
<div id="parent-arrow">
	<canvas id="arrow" ref="arrow-canvas"
		v-on:touchstart="onMouseDown"
		v-on:touchend="onMouseUp"
		v-on:touchmove="onMouseMove"
	></canvas>
	</div>
</template>

<script>

import StarHelper from '../utils/canvas/StarHelper.js';
import PlanetHelper from '../utils/canvas/PlanetHelper.js';
import {TIME_BEFORE_COLLISION_DETECTION} from '../utils/const.js';
import { setTimeout } from 'timers';

export default {
	name: 'PowerArrow',
	props: {
		idUser: String,
		urlAvatar: String
	},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			context: null,
			touch: false,
			ratio: 1,
			stateMouse: {
				draw: false,
				from: {X:0,Y:0},
				to: {X:0,Y:0},
				power: 0,
				angle: 0
			},
		};
	},
	mounted() {
		// We can't access the rendering context until the canvas is mounted to the DOM.
		// Once we have it, provide it to all child components.
		this.canvas = this.$refs['arrow-canvas'];
		this.context = this.canvas.getContext('2d');
		this.ratio = window.devicePixelRatio || 1;

		this.fromScratch();
		window.onresize = this.fromScratch.bind(this);


	},
	methods:{
		fromScratch: function(){
			const boudingRect = this.canvas.getBoundingClientRect();
			this.leftMargin = boudingRect.left;// * this.ratio;
			this.canvas.width = boudingRect.width;// * this.ratio;
			this.canvas.height = boudingRect.height;

			this.starHelper = new StarHelper(this.canvas, this.context);
			this.planetHelper = new PlanetHelper(this.canvas, this.context);

			this.drawState();
		},
		toggleFullScreen: function(){
			console.log('ChangeFullScreen');
		},
		onMouseDown: function(event) {
			if (this.idUser){
				return;
			}
			this.touch = true;
		},
		onMouseUp: function(event) {
			if (this.idUser){
				return;
			}
			this.touch = false;
			this.stateMouse.draw = false;
			this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
			this.$emit('launch-planet', this.stateMouse);

		},
		onMouseMove: function(event) {
			if (this.idUser){
				return;
			}
			if (this.touch){
				const {from, to, power, angle} = this.calculateUserLaunch(event);
				this.stateMouse.draw = true;
				this.stateMouse.from = from;
				this.stateMouse.to = to;
				this.stateMouse.power = power;
				this.stateMouse.angle = angle;
			}
		},
		colorGradient(fadeFraction) {
			const cold = {
				red:33,
				blue:243,
				green:150,
			};//#2196F3
			const hot = {
				red: 244,
				blue: 54,
				green: 67,
			}; //#f44336
			const fade = fadeFraction;
			const diffRed = hot.red - cold.red;
			const diffGreen = hot.green - cold.green;
			const diffBlue = hot.blue - cold.blue;

			const gradient = {
			red: parseInt(Math.floor(cold.red + (diffRed * fade)), 10),
			green: parseInt(Math.floor(cold.green + (diffGreen * fade)), 10),
			blue: parseInt(Math.floor(cold.blue + (diffBlue * fade)), 10),
			};

			return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
		},
		drawState: function(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			const gradient=this.context.createRadialGradient(
					0, //x0
					this.canvas.height, // y0
					10, //r0
					0, // x1
					this.canvas.height, // y1
					200 //r1
					);
			gradient.addColorStop(0,"#637b7a");
			gradient.addColorStop(1,"#302c3300");
			this.context.fillStyle = gradient;
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

			this.starHelper.drawStars();
			this.planetHelper.drawPlanet({
				x: 96,
				y: (this.canvas.height / 2),
				url: this.urlAvatar,
				radius: 96,
				iterations: TIME_BEFORE_COLLISION_DETECTION
			})
			if (this.stateMouse.draw){
				this.drawArrow(this.context,
					this.canvas,
					this.stateMouse.from.X, // From X
					this.stateMouse.from.Y, // From Y
					this.stateMouse.to.X, // To X
					this.stateMouse.to.Y, // To Y
					30 * this.stateMouse.power, // Width Arrow
					this.colorGradient(this.stateMouse.power) // Color
				);
			}
			window.requestAnimationFrame(this.drawState.bind(this));
		},
		drawArrow: function(ctx, canvas, fromx, fromy, tox, toy, arrowWidth, color){
			//variables to be used when creating the arrow
			var headlen = 10;
			var angle = Math.atan2(toy-fromy,tox-fromx);



			ctx.save();
			ctx.strokeStyle = color;

			//starting path of the arrow from the start square to the end square
			//and drawing the stroke
			ctx.beginPath();
			ctx.moveTo(fromx, fromy);
			ctx.lineTo(tox, toy);
			ctx.lineWidth = arrowWidth;
			ctx.stroke();

			//starting a new path from the head of the arrow to one of the sides of
			//the point
			ctx.beginPath();
			ctx.moveTo(tox, toy);
			ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
						toy-headlen*Math.sin(angle-Math.PI/7));

			//path from the side point of the arrow, to the other side point
			ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
						toy-headlen*Math.sin(angle+Math.PI/7));

			//path from the side point back to the tip of the arrow, and then
			//again to the opposite side point
			ctx.lineTo(tox, toy);
			ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
						toy-headlen*Math.sin(angle-Math.PI/7));

			//draws the paths created above
			ctx.stroke();
			ctx.restore();
		},
		calculateUserLaunch: function(mouseEvent){
			const originX = 90;
			const originY = this.canvas.height / 2;
			const clientX = mouseEvent.touches[0].clientX;
			const clientY = mouseEvent.touches[0].clientY;
			const percentArrow = 1 - (((this.canvas.width /* this.ratio*/) - clientX + this.leftMargin) / (this.canvas.width /* this.ratio*/));
			const destinationX = clientX - this.leftMargin;
			const destinationY = clientY;
			const angleRad = Math.atan2(destinationY - originY, destinationX - originX);
			const angleDeg = Math.atan(angleRad) * (180 / Math.PI);
			const angleDegPercent = angleDeg + 180;
			return {
			from: {
				X: originX,
				Y: originY
			},
			to: {
				X: destinationX, // To X
				Y: destinationY
			},
			power: percentArrow,
			angle: angleDegPercent
			};
		}
  }
}
</script>

<style>
#parent-arrow {
  margin:0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
#game canvas#arrow{
  flex:1;
  z-index: 2;
}

#game #iconBomb{
  position: absolute;
  left: 60px;
  top: calc(50% - 50px);
  z-index: 3;
}

#game img{
  position: absolute;
  height: 100px;
  left: 50px;
  top: calc(50% - 50px);
  -webkit-clip-path: circle(50px at center);
  clip-path: circle(50px at center);
}
html,
body {
	overscroll-behavior-y: contain;
}

</style>
