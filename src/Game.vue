<template>
	<div id="game">
		<div id="landscape" v-if="landscape">
			<PowerArrow
				v-bind:idUser="provider.idUser"
				v-on:launch-planet="launchPlanet($event)"
			>
			</PowerArrow>
			<img v-bind:src="user.imageUrl"
			>
			<i id="iconBomb"
				v-if="provider.idUser"
				v-on:click="destroy"
				class="fas fa-bomb fa-6x"></i>
			<i id="iconHelp"
				v-on:click="showHelp=true"
				class="fas fa-question-circle fa-3x"></i>
			<footer>
					<h2 v-if="!provider.idUser" >Throw your planet <i class="fas fa-space-shuttle fa-1x"></i></h2>
					<h2 v-if="provider.idUser">Destroy your planet <i class="fas fa-bomb fa-1x"></i></h2>
			</footer>
			<div id="howToplay"
				v-if="showHelp">
				<span>To play, simply drag your avatar <i class="fas fa-hand-point-up fa-1x"></i> to the right and relase to throw the planet <i class="fas fa-space-shuttle fa-1x"></i></span>
				<br>
				<span>You can make your planet explode with this icon <i class="fas fa-bomb fa-1x"></i></span>
				<br>
				<span>Sometimes your planet will not be up to date with the main screen. Coming from outside of the galaxy can take some times ;)</span>
				<div class="ok-btn" v-on:click="showHelp=false">OK</div>
			</div>
		</div>
		<div id="portrait" v-if="!landscape">
			<i id="iconRotate"
				class="fas fa-redo fa-5x"></i>
			<h2>Please turn your phone in landscape mode to play</h2>
		</div>
	</div>
</template>

<script>

import PowerArrow from './components/PowerArrow.vue'
import firebase from 'firebase/app'
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


export default {
	name: 'app',
	components: {
		PowerArrow
	},
	data() {
		return {
			// By creating the provider in the data property, it becomes reactive,
			// so child components will update when `context` changes.
			provider: {
				idUser: null,
			},
			showHelp: false,
			user: {
				imageUrl : '',
				id :0,
				name: ''
			},
			landscape: false,
			planet: {

			},
		};
	},
	mounted() {

		this.landscape = window.innerHeight < window.innerWidth;
		window.addEventListener("orientationchange", (event)=> {
			// Announce the new orientation number
			this.landscape = (window.orientation === 90 || window.orientation === -90);
		}, false);

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
		launchPlanet: function(stateMouse){
			this.provider.idUser = this.user.id;
			if (!this.planet.id){
				this.addPlanet(stateMouse);
			} else {
				this.updatePlanet(stateMouse);
			}
		},
		addPlanet: function(stateMouse) {
			const now = Date.now();

			this.planet = {
					id: this.user.id,
					name: this.user.name,
					url: this.user.imageUrl,
					radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
					distance: 10 + stateMouse.power * 400,
					collision: false,
					iterations: 0,
					speed: (300 + stateMouse.power * 100 + 50 * Math.random()),
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
		updatePlanet: function(stateMouse) {
			console.log('Update Planet');
			const now = Date.now();
			const planet = {
					radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
					distance: 10 + stateMouse.power * 400,
					collision: false,
					iterations: 0,
					speed: (300 + stateMouse.power * 100 + 50 * Math.random()),
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
	color: white;
}

#game #iconBomb{
	position: absolute;
	left: 60px;
	top: calc(50% - 50px);
	z-index: 3;
}

#game #iconHelp{
	position: absolute;
	right: 30px;
	top: 30px;
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

#portrait {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
#portrait i{
	align-self: center;
}

#landscape footer{
	position: absolute;
	bottom: 0;
	width: 80%;
	left: 10%;
	height: 75px;
	line-height: 30px;
}

#game #howToplay{
	position: absolute;
	background: grey;
	width: 90%;
	height: 90%;
	top:5%;
	left: 5%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size:20px;
	z-index: 4;
}

#game #howToplay .ok-btn{
	width: 50px;
	height: 30px;
	line-height: 30px;
	background: #1a1a1a;
	border-radius: 10px;
	align-self: center;
	z-index: 4;
}

html,
body {
		overscroll-behavior-y: contain;
}

</style>
