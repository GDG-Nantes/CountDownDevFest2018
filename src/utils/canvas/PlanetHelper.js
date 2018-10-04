'use strict'

import {TIME_BEFORE_COLLISION_DETECTION} from '../const.js';

export default class PlanetHelper{

	constructor(canvas, context){

		this.canvas = canvas;
		this.context = context;
		this.imagesLoad = {};
		this.images = {};
	}

	// Load a sprite for canvas
	_loadSprite(sprite) {
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
	}

	// Load a image according to url
	_imageFromUrl(path, radius, color, x, y, alpha) {

		if (!this.images[path]) {
			this._loadSprite({url: path, title: path})
			return;
		}

		// Circle Mask arround image
		this.context.save()
		this.context.beginPath();
		this.context.fillStyle = 'rgba(0,0,0,0)';
		this.context.arc(x, y, radius /2, 0, 2 * Math.PI, true); //true = clockwise, false = counterclock
		this.context.fill();
		this.context.closePath()
		this.context.clip()

		// Draw the image
		const img = this.images[path];
		this.context.globalAlpha = alpha;
		this.context.drawImage(img,0,0, img.width, img.height,0 -radius / 2,0 - radius / 2,radius, radius);
		this.context.restore();
	}

	drawPlanet(planet) {
		if (!planet.url){
			return;
		}
		// We move the planet
		this.context.save();
		this.context.translate(planet.x, planet.y);
		this._imageFromUrl(planet.url, // Url of avatar image
			planet.radius, // Size of planet
			'#898989', // Border color
			0, // Clip x start position
			0, // Clip y start position
			planet.iterations < TIME_BEFORE_COLLISION_DETECTION ? 0.4 : 1 // Alpha planet
				);

		this.context.restore();
	}

}