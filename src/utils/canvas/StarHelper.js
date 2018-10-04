'use strict'

export default class StarHelper{
	constructor(canvas, context){
		this.stars = [];
		this.canvas = canvas;
		this.context = context;
		this._generateRandomStars(canvas.width, canvas.height)
	}

	_generateRandomStars(width, height) {
		const numStars = 200;
		for(let i = 0; i < numStars; i++) {
			const x = Math.round(Math.random() * width);
			const y = Math.round(Math.random() * height);
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
	}

	drawStars() {
		for (let star of this.stars) {
			this.context.save();
			this.context.translate(star.x,star.y);
			this._drawStar(star);
			this.context.restore();
		}
	}

	_drawStar(star) {

		// Change the opacity
		if(star.opacity > 1) {
			star.factor = -1;
		}
		else if(star.opacity <= 0) {
			star.factor = 1;

			star.x = Math.round(Math.random() * this.canvas.width);
			star.y = Math.round(Math.random() * this.canvas.height);
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
	}
}