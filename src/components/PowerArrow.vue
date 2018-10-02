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



export default {
	name: 'PowerArrow',
	props: {
		idUser: String
	},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			context: null,
			touch: false,
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
		this.context = this.$refs['arrow-canvas'].getContext('2d');

		this.leftMargin = this.$refs['arrow-canvas'].getBoundingClientRect().left;
		this.$refs['arrow-canvas'].width = this.$refs['arrow-canvas'].getBoundingClientRect().width;
		this.$refs['arrow-canvas'].height = this.$refs['arrow-canvas'].parentElement.clientHeight;

		this.drawState();

	},
	methods:{
		onMouseDown: function(event) {
			if (this.idUser){
				return;
			}
			this.touch = true;
			console.log('onMouseDown',event);
		},
		onMouseUp: function(event) {
			if (this.idUser){
				return;
			}
			this.touch = false;
			console.log('onMouseUp',event);
			this.stateMouse.draw = false;
			this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
			this.$emit('launch-planet', this.stateMouse);

		},
		onMouseMove: function(event) {
			if (this.idUser){
				return;
			}
			if (this.touch){
				const {from, to, power} = this.calculateUserLaunch(event);
				this.stateMouse.draw = true;
				this.stateMouse.from = from;
				this.stateMouse.to = to;
				this.stateMouse.power = power;
			}
			console.log(`onMouseMove ${event.touches[0].clientX}`,event);
		},
		drawState: function(){
			if (this.stateMouse.draw){
				this.drawArrow(this.context,
					this.canvas,
					this.stateMouse.from.X, // From X
					this.stateMouse.from.Y, // From Y
					this.stateMouse.to.X, // To X
					this.stateMouse.to.Y, // To Y
					30 * this.stateMouse.power, // Width Arrow
					'red' // Color
				);
			}
			window.requestAnimationFrame(this.drawState.bind(this));
		},
		drawArrow: function(ctx, canvas, fromx, fromy, tox, toy, arrowWidth, color){
			//variables to be used when creating the arrow
			var headlen = 10;
			var angle = Math.atan2(toy-fromy,tox-fromx);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

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
			const percentArrow = 1 - ((this.canvas.width - clientX + this.leftMargin) / this.canvas.width);
			const destinationX = clientX - this.leftMargin;
			const destinationY = clientY;
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
			angle: Math.atan2(destinationY - originY, destinationX - originX)
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
  background: #1a1a1a;
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