<template>
	<div id="game">
		<div id="landscape" v-if="landscape">
			<div v-if="!fullscreenMode" id="askForFullScreen">
				<i
					id="fullscreen"
					v-on:click="toggleFullScreen()"
					class="fas fa-expand fa-6x"></i>
				<h2>Switch to full screen</h2>
			</div>
			<div v-if="fullscreenMode">
				<PowerArrow
					ref="arrow"
					v-bind:idUser="provider.idUser"
					v-bind:urlAvatar="user.imageUrl"
					v-on:launch-planet="launchPlanet($event)"
				>
				</PowerArrow>
				<span id="iconBomb"
					class="fa-stack fa-3x"
					v-if="provider.idUser"
					v-on:click="destroy">
					<i class="fas fa-circle fa-stack-2x"></i>
					<i class="fas fa-bomb fa-stack-1x fa-inverse"></i>
				</span>
				<i id="iconHelp"
					v-on:click="showHelp=true"
					class="fas fa-question-circle fa-3x"></i>
				<i id="iconExitFullScreen"
					v-on:click="toggleFullScreen()"
					class="fas fa-compress fa-3x"></i>
				<footer>
						<h2 v-if="!provider.idUser" >Throw your planet <i class="fas fa-space-shuttle fa-1x"></i></h2>
						<h2 v-if="provider.idUser">Destroy your planet <i class="fas fa-bomb fa-1x"></i></h2>
				</footer>
				<div id="howToplay"
					v-if="showHelp">
					<span>To play, simply drag your avatar <i class="fas fa-hand-point-up fa-1x"></i> to the right and release to launch the planet <i class="fas fa-space-shuttle fa-1x"></i></span>
					<br>
					<span>You can destroy your planet with this icon <i class="fas fa-bomb fa-1x"></i></span>
					<br>
					<span>Sometimes your planet will not be up to date on the main screen. Coming from outside of the galaxy can take some times ;)</span>
					<div class="ok-btn" v-on:click="showHelp=false">OK</div>
				</div>
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
import {DISTANCE_PLANET_MAX} from './utils/const.js'


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
			fullscreenMode: false,
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

		this.showHelp = !localStorage['firstLook'];
		localStorage['firstLook'] = true;
		this.landscape = window.innerHeight < window.innerWidth;
		window.addEventListener("orientationchange", ()=> {
			// Announce the new orientation number
			this.landscape = (window.orientation === 90 || window.orientation === -90);
			this.fullscreenMode = false;
		}, false);

			const user = firebase.auth().currentUser;
			if (!user){
				// console.debug('No User :\'(');
				return;
			}
			this.user.imageUrl = user.photoURL;
			this.user.id = user.uid;
			this.user.name = user.displayName;

			firestore.collection("planets").where("init", "==", true).where("id", "==", this.user.id)
			.onSnapshot((snapshot) => {
				if (snapshot.docs.length > 0){
					this.provider.idUser = snapshot.docs[0].data().id;
				}
			});
			firestore.collection("planets").where("init", "==", false).where("id", "==", this.user.id)
			.onSnapshot((snapshot) => {
				snapshot.docChanges().forEach((change) => {
						if (change.type === "added") {
							this.provider.idUser = null;
							// console.debug("New planet: ", change.doc.data());
						}
						if (change.type === "modified") {
							this.provider.idUser = null;
							// console.debug("Modified planet: ", change.doc.data());
						}
						if (change.type === "removed") {
							this.provider.idUser = change.doc.data().id;
							// console.debug("Removed planet: ", change.doc.data());
						}
				});
		});

		},
	methods:{
		toggleFullScreen() {
			const elem = document.getElementById('landscape');
			if (this.fullscreenMode){
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) { /* Firefox */
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) { /* IE/Edge */
					document.msExitFullscreen();
				}
			} else {
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.mozRequestFullScreen) { /* Firefox */
					elem.mozRequestFullScreen();
				} else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
					elem.webkitRequestFullscreen();
				} else if (elem.msRequestFullscreen) { /* IE/Edge */
					elem.msRequestFullscreen();
				}
			}
			this.fullscreenMode = !this.fullscreenMode;
		},
		launchPlanet(stateMouse){
			// console.debug(stateMouse)
			this.provider.idUser = this.user.id;
			if (!this.planet.id){
				this.addPlanet(stateMouse);
			} else {
				this.updatePlanet(stateMouse);
			}
		},
		addPlanet(stateMouse) {
			const now = Date.now();

			this.planet = {
					id: this.user.id,
					name: this.user.name,
					url: this.user.imageUrl,
					radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
					distance: 10 + stateMouse.power * DISTANCE_PLANET_MAX,
					collision: false,
					iterations: 0,
					speed: this.calculateSpeed(stateMouse),
					// Change datas
					score: 0,
					angle: stateMouse.angle,
					x : 0,
					y : 0,
					init: true
			};
			// console.debug('Velocity : ', this.planet.speed);
			firestore.collection("planets").doc(`${this.user.id}`).set(this.planet)
			.then(() => {
					// console.debug("Document written with ID: ", this.provider.idUser);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error("Error adding document: ", error);
			});
		},
		updatePlanet(stateMouse) {
			// console.debug('Update Planet');
			const now = Date.now();
			const planet = {
					radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
					distance: 10 + stateMouse.power * DISTANCE_PLANET_MAX,
					collision: false,
					iterations: 0,
					speed: this.calculateSpeed(stateMouse),
					// Change datas
					angle: stateMouse.angle,
					x : 0,
					y : 0,
					init: true
			};
			firestore.collection("planets").doc(`${this.user.id}`).update(planet)
			.then(() => {
					// console.debug("Document written with ID: ", this.provider.idUser);
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.error("Error adding document: ", error);
			});
		},
		destroy() {
			firestore.collection("planets").doc(`${this.user.id}`).update({
						collision: false,
						iterations: 0,
						init: false
				})
			this.provider.idUser = null;
		},
		calculateSpeed(stateMouse){
			return (300 - (stateMouse.power * 150) + (50 * Math.random()));
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
	background: #302c33;
	color: white;
}

#game #iconBomb{
	position: absolute;
	left: 50px;
	top: calc(50% - 50px);
	z-index: 3;
}

#game #iconBomb .fa-circle{
	color: rgba(255,255,255, 0.8);
}
#game #iconBomb .fa-bomb {
	color: #1a1a1a;
}

#game #iconHelp{
	position: absolute;
	right: 30px;
	top: 30px;
	z-index: 3;
}

#game #iconExitFullScreen{
	position: absolute;
	left: 30px;
	top: 30px;
	z-index: 3;
}

#game #fullscreen{
	z-index: 3;
}

#game img{
	position: absolute;
	height: 96px;
	left: 50px;
	top: calc(50% - 50px);
	-webkit-clip-path: circle(48px at center);
	clip-path: circle(48px at center);
}

#portrait, #askForFullScreen {
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
	background: #1a1a1a;
	width: calc(90% - 30px);
	height: calc(90% - 30px);
	top:5%;
	left: 5%;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size:20px;
	z-index: 4;
	padding: 15px;
	border-radius: 20px;
	/*box-shadow:
		0 0 2px 4px rgba(200,230,255,0.5),
		0 -2px 2px 3px rgba(200,230,255,0.5) inset,
		0 0 2px 5px rgba(100,150,255,0.9),
		0 0 2px 7px rgba(100,150,255,1) inset,
		0 0 8px 8px rgba(0,50,255,0.9),
		0 0 9px 9px rgba(0,50,255,0.7) inset,
		0 8px 30px 11px rgba(0,0,0,0.8),
		0 8px 25px 8px rgba(0,0,0,0.7) inset;*/
	animation: flicker 1.5s infinite alternate;
	border: 0.4rem solid #fff;
}



#game #howToplay .ok-btn{
	width: 50px;
	height: 30px;
	line-height: 30px;
	background: #1a1a1a;
	border-radius: 10px;
	align-self: center;
	z-index: 4;
	animation: flickerBtn 1.5s infinite alternate;
}

@keyframes flicker {

    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {

        box-shadow:
            0 0 .5rem #fff,
            0 0 .5rem #fff inset,
            0 0 2rem #08f,
            0 0 2rem #08f inset,
            0 0 4rem #08f,
            0 0 4rem #08f inset;
    }

    20%, 24%, 55% {
        text-shadow: none;
        box-shadow: none;
    }
}

@keyframes flickerBtn {

    0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {

        box-shadow:
            0 0 .5rem #fff,
            0 0 .5rem #fff inset,
            0 0 2rem #f40,
            0 0 2rem #f40 inset,
            0 0 4rem #f40,
            0 0 4rem #f40 inset;
    }

    20%, 24%, 55% {
        text-shadow: none;
        box-shadow: none;
    }
}

html,
body {
		overscroll-behavior-y: contain;
}

</style>
