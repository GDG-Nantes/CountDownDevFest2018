<template>
  <div id="game">
    <img v-bind:src="user.imageUrl"
    >
    <canvas id="arrow" ref="arrow-canvas"
      v-on:touchstart="onMouseDown"
      v-on:touchend="onMouseUp"
      v-on:touchmove="onMouseMove"
      ></canvas>
    <i id="iconBomb"
      v-if="provider.idUser"
      v-on:click="destroy"
      class="fas fa-bomb fa-6x"></i>
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
      },
      user: {
        imageUrl : '',
        id :0,
        name: ''
      },
      planet: {

      },
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

      const user = firebase.auth().currentUser;
      if (!user){
        console.log('No User :\'(');
        return;
      }
      this.user.imageUrl = user.photoURL;
      this.user.id = user.uid;
      this.user.name = user.displayName;

      firestore.collection("planets").where("init", "==", false).where("id", "==", this.user.id)
    	.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              this.provider.idUser = null;
							  console.log("New planet: ", change.doc.data());
            }
            if (change.type === "modified") {
                console.log("Modified planet: ", change.doc.data());
            }
            if (change.type === "removed") {
                console.log("Removed planet: ", change.doc.data());
            }
        });
    });

    },
  methods:{
    addPlanet: function() {
      const now = Date.now();

      this.planet = {
          id: this.user.id,
          name: this.user.name,
          url: this.user.imageUrl,
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
      };
      firestore.collection("planets").doc(`${this.user.id}`).set(this.planet)
      .then((docRef) => {
          console.log("Document written with ID: ", this.provider.idUser);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    },
    updatePlanet: function() {
      console.log('Update Planet');
      const now = Date.now();
      const planet = {
          radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
          distance: 10 + this.provider.stateMouse.power * 400,
          collision: false,
          iterations: 0,
          speed: (300 + this.provider.stateMouse.power * 100 + 50 * Math.random()),
          // Change datas
          angle: 0,
          x : 0,
          y : 0,
          init: true
      };
      firestore.collection("planets").doc(`${this.user.id}`).update(planet)
      .then((docRef) => {
          console.log("Document written with ID: ", this.provider.idUser);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });
    },
    onMouseDown: function(event) {
      if (this.provider.idUser){
        return;
      }
      this.provider.touch = true;
      console.log('onMouseDown',event);
    },
    onMouseUp: function(event) {
      if (this.provider.idUser){
        return;
      }
      this.provider.touch = false;
      console.log('onMouseUp',event);
      this.provider.stateMouse.draw = false;
      this.provider.context.clearRect(0,0,this.provider.canvas.width, this.provider.canvas.height);
      this.provider.idUser = this.user.id;
      if (!this.planet.id){
        this.addPlanet();
      } else {
        this.updatePlanet();
      }
    },
    onMouseMove: function(event) {
      if (this.provider.idUser){
        return;
      }
      if (this.provider.touch){
        const {from, to, power} = this.calculateUserLaunch(event);
        this.provider.stateMouse.draw = true;
        this.provider.stateMouse.from = from;
        this.provider.stateMouse.to = to;
        this.provider.stateMouse.power = power;
      }
      console.log(`onMouseMove ${event.touches[0].clientX}`,event);
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
        const originX = 90;
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
    },
    destroy: function() {
      firestore.collection("planets").doc(`${this.user.id}`).update({
            collision: false,
            iterations: 0,
            init: false
        })
      this.provider.idUser = null;
    }
  }
}
</script>

<style>
#game {
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
