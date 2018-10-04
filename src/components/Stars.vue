<template>
<div id="parent-stars">
	<canvas id="stars" ref="stars-canvas"></canvas>
	</div>
</template>

<script>

import StarHelper from '../utils/canvas/StarHelper.js';

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
		this.context = this.canvas.getContext('2d');

		this.leftMargin = this.canvas.getBoundingClientRect().left;
		this.canvas.width = this.canvas.getBoundingClientRect().width;
		this.canvas.height = this.canvas.parentElement.clientHeight;
		this.starHelper = new StarHelper(this.canvas, this.context)


		this.drawState();

	},
	methods:{
		drawState: function(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawBackground();
			this.starHelper.drawStars();
			window.requestAnimationFrame(this.drawState.bind(this));
		},
		drawBackground: function() {

			this.context.save();
			this.context.beginPath();
			this.context.fillStyle = '#1a1a1a';
			this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.closePath();
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
