<template>
<div id="parent-stars">
	<canvas id="stars" ref="stars-canvas"></canvas>
	</div>
</template>

<script>



export default {
	name: 'Stars',
	props: {
		idUser: String
	},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			context: null,
			stars: [],
		};
	},
	mounted() {
		// We can't access the rendering context until the canvas is mounted to the DOM.
		// Once we have it, provide it to all child components.
		this.canvas = this.$refs['stars-canvas'];
		this.context = this.$refs['stars-canvas'].getContext('2d');

		this.leftMargin = this.$refs['stars-canvas'].getBoundingClientRect().left;
		this.$refs['stars-canvas'].width = this.$refs['stars-canvas'].getBoundingClientRect().width;
		this.$refs['stars-canvas'].height = this.$refs['stars-canvas'].parentElement.clientHeight;
		this.cw = this.$refs['stars-canvas'].width;
		this.ch = this.$refs['stars-canvas'].height;

		this.generateRandomStars();

		this.drawState();

	},
	methods:{
		drawState: function(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawBackground();
			this.drawStars();
			window.requestAnimationFrame(this.drawState.bind(this));
		},
		generateRandomStars: function() {
			const numStars = 200;
			for(let i = 0; i < numStars; i++) {
				const x = Math.round(Math.random() * this.cw);
				const y = Math.round(Math.random() * this.ch);
				const length = 1 + Math.random() * 2;
				const opacity = Math.random();

				// Create a new star and draw
				const star = {
					x,
					y,
					length,
					opacity,
					factor: 1,
					increment: Math.random() * 0.03
				};

				// Add the the stars array
				this.stars.push(star);
			}
		},
		drawBackground: function() {

			this.context.save();
			this.context.beginPath();
			this.context.fillStyle = '1a1a1a';
			this.context.fillRect(0, 0, this.cw, this.ch);
			this.context.closePath();
		},

		drawStars: function() {
			for (let star of this.stars) {
				this.context.save();
				this.context.translate(star.x,star.y);
				this.drawStar(star);
				this.context.restore();
			}
		},

		drawStar: function(star) {

			// Change the opacity
			if(star.opacity > 1) {
				star.factor = -1;
			}
			else if(star.opacity <= 0) {
				star.factor = 1;

				star.x = Math.round(Math.random() * this.cw);
				star.y = Math.round(Math.random() * this.ch);
			}

			star.opacity += star.increment * star.factor;

			this.context.beginPath()
			for (var i = 5; i--;) {
				this.context.lineTo(0, star.length);
				this.context.translate(0, star.length);
				this.context.rotate((Math.PI * 2 / 10));
				this.context.lineTo(0, - star.length);
				this.context.translate(0, - star.length);
				this.context.rotate(-(Math.PI * 6 / 10));
			}
			this.context.lineTo(0, star.length);
			this.context.closePath();
			this.context.fillStyle = "rgba(255, 255, 200, " + star.opacity + ")";
			this.context.shadowBlur = 5;
			this.context.shadowColor = '#ffff33';
			this.context.fill();
		},
  }
}
</script>

<style>
#parent-stars {
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
#game canvas#stars{
  flex:1;
}

html,
body {
	overscroll-behavior-y: contain;
}

</style>
