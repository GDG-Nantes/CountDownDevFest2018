'use strict'

const COLORS = ["#6A0000", "#900000", "#902B2B", "#A63232", "#A62626", "#FD5039", "#C12F2A", "#FF6540", "#f93801"];
const SPRING = 1 / 10;
const FRICTION = .85;

class Particle {
	constructor(o, ctx) {
		this.ctx = ctx;
		this.decay = .95; //randomIntFromInterval(80, 95)/100;//
		this.r = this._randomIntFromInterval(10, 40);
		this.R = 50 - this.r;
		this.angle = Math.random() * 2 * Math.PI;
		this.center = o; //{x:cx,y:cy}
		this.pos = {};
		this.pos.x = this.center.x + this.r * Math.cos(this.angle);
		this.pos.y = this.center.y + this.r * Math.sin(this.angle);
		this.dest = {};
		this.dest.x = this.center.x + this.R * Math.cos(this.angle);
		this.dest.y = this.center.y + this.R * Math.sin(this.angle);
		this.color = COLORS[~~(Math.random() * COLORS.length)];
		this.vel = {
			x: 0,
			y: 0
		};
		this.acc = {
			x: 0,
			y: 0
		};
	}

	update() {
		var dx = (this.dest.x - this.pos.x);
		var dy = (this.dest.y - this.pos.y);

		this.acc.x = dx * SPRING;
		this.acc.y = dy * SPRING;
		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;

		this.vel.x *= FRICTION;
		this.vel.y *= FRICTION;

		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;

		if (this.r > 0) this.r *= this.decay;
	}

	draw() {

		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
		this.ctx.fill();

	}

	_randomIntFromInterval(mn, mx) {
		return Math.floor(Math.random() * (mx - mn + 1) + mn);
	}
}

class Explosion {
	constructor(canvas, ctx, pos){
		this.ctx = ctx;
		this.canvas = canvas
		this.pos = pos;
		this.particles = [];
		for (var i = 0; i < 50; i++) {
		  this.particles.push(new Particle(this.pos, this.ctx));
		}
	}


	update() {
	  for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update();
		if (this.particles[i].r < .5) {
		  this.particles.splice(i, 1)
		}
	  }
	}

	draw() {
	  for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw();
	  }
	}
}

export default class ExplosionHelper {
	constructor(canvas, context){
		this.canvas = canvas;
		this.context = context;
		this.explosions = [];
	}

	explose(planet){
		this.explosions.push(new Explosion(this.canvas, this.context, {
			x: planet.x,
			y: planet.y
		}));
	}

	renderExplosions(){
		this.context.save();
		this.context.globalCompositeOperation = "lighter";
		const explosionsIndexToRemove = [];
		for (let explosion of this.explosions){
			explosion.update();
			explosion.draw();
		}
		this.context.restore()
	}
}