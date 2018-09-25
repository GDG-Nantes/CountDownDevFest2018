<template>
  <div id="app">
    <img src="./assets/logo.png"
    >
    <button v-on:click="addPlanet">Add Planet</button>
    <canvas ref="arrow-canvas"
      v-on:touchstart="onMouseDown"
      v-on:touchend="onMouseUp"
      v-on:touchmove="onMouseMove"
      v-on:touchover="onMouseOver"
      ></canvas>
  </div>
</template>

<script>

import firebase from 'firebase/app'

const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


export default {
  name: 'app',
  components: {
  },
  data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			provider: {
				// This is the CanvasRenderingContext that children will draw to.
				context: null,
        touch: false,
        stateMouse: {
          draw: false,
          from: {X:0,Y:0},
          to: {X:0,Y:0},
          power: 0,
          angle: 0
        },
        idUser: null
			}
		};
	},
  mounted() {
      // We can't access the rendering context until the canvas is mounted to the DOM.
      // Once we have it, provide it to all child components.
      this.provider.canvas = this.$refs['arrow-canvas'];
      this.provider.context = this.$refs['arrow-canvas'].getContext('2d');
      // Resize the canvas to fit its parent's width.
      // Normally you'd use a more flexible resize system.
      /*this.$refs['arrow-canvas'].width = this.$refs[
        'arrow-canvas'
      ].parentElement.clientWidth;*/
      this.provider.leftMargin = this.$refs['arrow-canvas'].getBoundingClientRect().left;
      console.log(this.$refs['arrow-canvas'].getBoundingClientRect())
      this.$refs['arrow-canvas'].width = this.$refs[
        'arrow-canvas'
      ].getBoundingClientRect().width;
      this.$refs['arrow-canvas'].height = this.$refs[
        'arrow-canvas'
      ].parentElement.clientHeight;

      this.drawState();

    },
  methods:{
    addPlanet: function() {
      const now = Date.now();
      firestore.collection("planets").add({
          id: `id${now}`,
          name: `name${i}`,
          url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
          radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
          distance: 10 + Math.random() * 400,
          collision: false,
          iterations: 0,
          speed: (300 + Math.random() * 100),
          // Change datas
          score: 0,
          angle: 0,
          x : 0,
          y : 0,
          init: true
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    },
    onMouseDown: function(event) {
      this.provider.touch = true;
      console.log('onMouseDown',event);
    },
    onMouseUp: function(event) {
      this.provider.touch = false;
      console.log('onMouseUp',event);
      this.provider.stateMouse.draw = false;
      this.provider.context.clearRect(0,0,this.provider.canvas.width, this.provider.canvas.height);
      const now = Date.now();
      if (!this.provider.idUser){
        this.provider.idUser = `id${now}`;
        firestore.collection("planets").add({
            id: `id${now}`,
            name: `name${now}`,
            url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
            radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
            distance: 10 + this.provider.stateMouse.power * 400,
            collision: false,
            iterations: 0,
            speed: (300 + this.provider.stateMouse.power * 100 + 50 * Math.random()),
            // Change datas
            score: 0,
            angle: 0,
            x : 0,
            y : 0,
            init: true
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
      }
    },
    onMouseMove: function(event) {
      if (this.provider.touch){
        //const clientX = event.touches[0].clientX;
        //const clientY = event.touches[0].clientY;
        //const percentArrow = 1 - ((this.provider.canvas.width - clientX + this.provider.leftMargin) / this.provider.canvas.width);
        //console.log(percentArrow);
        const {from, to, power} = this.calculateUserLaunch(event);
        this.provider.stateMouse.draw = true;
        this.provider.stateMouse.from = from;
        this.provider.stateMouse.to = to;
        this.provider.stateMouse.power = power;
      }
      console.log(`onMouseMove ${event.touches[0].clientX}`,event);
    },
    onMouseOver: function(event) {
      console.log('onMouseOver',event);
    },
    drawState: function(){
      if (this.provider.stateMouse.draw){
        this.drawArrow(this.provider.context,
            this.provider.canvas,
            this.provider.stateMouse.from.X, // From X
            this.provider.stateMouse.from.Y, // From Y
            this.provider.stateMouse.to.X, // To X
            this.provider.stateMouse.to.Y, // To Y
            30 * this.provider.stateMouse.power, // Width Arrow
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
        const originX = 0;
        const originY = this.provider.canvas.height / 2;
        const clientX = mouseEvent.touches[0].clientX;
        const clientY = mouseEvent.touches[0].clientY;
        const percentArrow = 1 - ((this.provider.canvas.width - clientX + this.provider.leftMargin) / this.provider.canvas.width);
        const destinationX = clientX - this.provider.leftMargin;
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
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
canvas{
  flex:1;
}

</style>
