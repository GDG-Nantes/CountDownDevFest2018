<template>
  <div id="canvas-container">
    <canvas ref="my-canvas"></canvas>
    <img src="./assets/sun.png" ref="sun" style="display:none">
  </div>
</template>

<script>
// https://alligator.io/vuejs/vue-html5-canvas/

export default {
	name: 'countdown',
	components: {},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			provider: {
				// This is the CanvasRenderingContext that children will draw to.
				context: null,
			},
			imagesLoad: [],
      images: [],
      planets: [],
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
			/*ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock

			ctx.fill();
			ctx.closePath();*/
		},
		image: function(img, radius, color, x, y) {
			if (!this.provider.context) return;

      const ctx = this.provider.context;
     /*if (!this.images[path]) {
        this.loadSprite({url: path, title: path})
        return;
      }

      const img = this.image[path]*/
      ctx.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
			/*ctx.beginPath();
			ctx.fillStyle = color;
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock

			ctx.fill();
			ctx.closePath();*/
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

			//Sun - center
			ctx.translate(cw / 2, ch / 2);
			this.image(this.$refs['sun'], 50, 'yellow', 0, 0);

			this.text('Sun', 'black', '15pt arial', -16, 7);


      for (let planet of this.planets){
        //JF
        ctx.save();
        ctx.rotate(time / planet.speed);
        ctx.translate(planet.distance, 0);
        ctx.rotate(-time / planet.speed);
        this.imageFromUrl(planet.url, planet.radius, '#898989', 0, 0);

        ctx.restore();
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

			//Venus
			ctx.rotate(time / 100 - time / 90);
			 ctx.translate(60, 0);
			this.circle(9, '#b9955b', 0, 0);

			this.line(-60, 0, 0, 0);

			//Earth white line
			ctx.translate(-60, 0);
			this.circleStroke(90, '#1c1c1c', 0, 0, '2');

			//Earth -   This is Where i live
			ctx.rotate(time / 100 - time / 80);
			ctx.translate(90, 0);
			this.circle(10, '#2f2fc1', 0, 0);

			this.line(-90, 0, 0, 0);

			//Moon.. nobody likes the moon anyway :P
			//  ctx.rotate(time/120);
			//  ctx.translate(20,0);
			//   circle(4,"white",0,0);

			//Mars white line
			ctx.translate(-90, 0);
			this.circleStroke(120, '#1c1c1c', 0, 0, '2');

			//Mars
			ctx.rotate(time / 120 - time / 50);
			ctx.translate(120, 0);
			this.circle(15, '#9f5e13', 0, 0);

			this.line(-120, 0, 0, 0);

			//asteroid belt
			ctx.translate(-120, 0);
			this.circleStroke(160, '#151515', 0, 0, '35');

			//jupiter white line
			ctx.translate(0, 0);
			this.circleStroke(220, '#1c1c1c', 0, 0, '2');

			//jupiter
			ctx.rotate(time / 120 - time / 50);
			ctx.translate(220, 0);
			this.circle(45, '#ef602c', 0, 0);

			this.line(-220, 0, 0, 0);

			//saturn white line
			ctx.translate(-220, 0);
			this.circleStroke(300, '#1c1c1c', 0, 0, '2');

			//saturn
			ctx.rotate(time / 120 - time / 90);
			ctx.translate(300, 0);
			this.circle(35, '#c76743', 0, 0);

			this.line(-300, 0, 0, 0);

			//saturn asteroid belt
			ctx.translate(0, 0);
			this.circleStroke(50, '#747474', 0, 0, '3');

			//uranus white line
			ctx.translate(-300, 0);
			this.circleStroke(340, '#1c1c1c', 0, 0, '2');

			//uranus
			ctx.rotate(time / 120 - time / 90);
			ctx.translate(-340, 0);
			this.circle(23, '#b843c7', 0, 0);

			this.line(340, 0, 0, 0);

			//neptune white line
			ctx.translate(340, 0);
			this.circleStroke(380, '#1c1c1c', 0, 0, '2');

			//neptune
			ctx.rotate(time / 120 - time / 140);
			ctx.translate(-380, 0);
			this.circle(20, '#43aec7', 0, 0);

			this.line(380, 0, 0, 0);*/

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

      for (let i = 0; i < 100; i++){
        this.planets.push({
          url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
          radius: 30 + ((i % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
          distance: 10 + Math.random() * 400,
          speed: (1 + Math.random() * 200)
        });

      }


		this.animate();
	},
	/*render: function() {
    // Since the parent canvas has to mount first, it's *possible* that the context may not be
    // injected by the time this render function runs the first time.
    if(!this.provider.context) return;
    const ctx = this.provider.context;

    // Keep a reference to the box used in the previous render call.
    const oldBox = this.oldBox
    // Calculate the new box. (Computed properties update on-demand.)
    const newBox = this.calculatedBox

    ctx.beginPath();
    // Clear the old area from the previous render.
    ctx.clearRect(oldBox.x, oldBox.y, oldBox.w, oldBox.h);
    // Clear the area for the text.
    ctx.clearRect(newBox.x, newBox.y - 42, newBox.w, 100);

    // Draw the new rectangle.
    ctx.rect(newBox.x, newBox.y, newBox.w, newBox.h);
    ctx.fillStyle = this.color;
    ctx.fill();

    // Draw the text
    ctx.fillStyle = '#000'
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(this.value), (newBox.x + (newBox.w / 2)), newBox.y - 14)
  },
  computed: {
    calculatedBox () {
      const ctx = this.provider.context

      // Turn start / end percentages into x, y, width, height in pixels.
      const calculated = {
        x: percentWidthToPix(this.x1, ctx),
        y: percentHeightToPix(this.y1, ctx),
        w: percentWidthToPix(this.x2 - this.x1, ctx),
        h: percentHeightToPix(this.y2 - this.y1, ctx)
      }

      // Yes yes, side-effects. This lets us cache the box dimensions of the previous render.
      // before we re-calculate calculatedBox the next render.
      this.oldBox = calculated
      return calculated
    }
  },*/
};
</script>

<style>
#canvas-container {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
	height: 100%;
}

canvas {
	height: 100%;
}
</style>
