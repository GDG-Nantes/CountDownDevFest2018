<template>
	<div id="canvas-container">
		<canvas ref="my-canvas"></canvas>
		<img src="../assets/sun.png" ref="sun" style="display:none">
	</div>
</template>


<script>

const TIME_BEFORE_COLLISION_DETECTION = 2000;

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
		// Load a sprite for canvas
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

		// Load a image according to url
		imageFromUrl: function(path, radius, color, x, y, alpha) {

			if (!this.images[path]) {
				this.loadSprite({url: path, title: path})
				return;
			}

			// Circle Mask arround image
			this.context.save()
			this.context.beginPath();
			this.context.fillStyle = color;
			this.context.arc(x, y, radius /2, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock
			this.context.fill();
			this.context.closePath()
			this.context.clip()

			// Draw the image
			const img = this.images[path];
			this.context.globalAlpha = alpha;
			this.context.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
			this.context.restore();
		},
		image: function(img, radius, color, x, y) {
			this.context.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
		},

		drawBackground: function() {

			this.context.save();
			this.context.beginPath();
			this.context.fillStyle = 'black';
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

		drawPlanet: function(planet) {
			// We move the planet
			this.context.save();
			this.context.translate(planet.x, planet.y);
			this.imageFromUrl(planet.url, // Url of avatar image
				planet.radius, // Size of planet
				'#898989', // Border color
				0, // Clip x start position
				0, // Clip y start position
				planet.iterations < TIME_BEFORE_COLLISION_DETECTION ? 0.4 : 1 // Alpha planet
					);

			this.context.restore();
		},

		drawSun: function() {
			this.context.translate(this.cw / 2, this.ch / 2);
			this.image(this.$refs['sun'], 100, 'yellow', 0, 0);
		},


		animate: function() {
			if (!this.context) return;

			this.drawBackground();
			this.drawStars();
			this.drawSun();

			// We take a copy to show planets
			const planets = this.planets.slice();
			for (let planet of planets){
				if (!planet.collision){
					this.drawPlanet(planet);
				}
			}
			this.context.restore();
			window.requestAnimationFrame(this.animate.bind(this));
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
	},


	mounted() {
		// We can't access the rendering context until the canvas is mounted to the DOM.
		this.canvas = this.$refs['my-canvas'];
		this.context = this.$refs['my-canvas'].getContext('2d');

		// Resize the canvas to fit its parent's width.
		this.$refs['my-canvas'].width = this.$refs['my-canvas'].parentElement.clientWidth;
		this.$refs['my-canvas'].height = this.$refs['my-canvas'].parentElement.clientHeight;
		this.cw = this.$refs['my-canvas'].width;
		this.ch = this.$refs['my-canvas'].height;


		// Create all the stars
		this.generateRandomStars();

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
