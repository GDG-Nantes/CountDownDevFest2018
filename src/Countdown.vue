<template>
	<div id="countdown-container">
		<Galaxy ref="galaxy" v-bind:planets="planets"></Galaxy>
		<section id="animation-galaxy"
			v-if="countDownStart"
		>
			<ScoreList v-bind:planets="scores"></ScoreList>
			<Timer
				v-on:timer-update="timeUpdate($event)"
				v-on:end-count-down="endCountDown()"
			></Timer>
			<h2 class="play-with-me">Throw your planet at : https://bit.ly/devfest-ntantes-2018</h2>
		</section>
		<div id="startCountDown"
			v-if="!countDownStart"
			v-on:click="startCountDown()"
		>Start CountDown</div>
		<div id="opacity" style="display:none"></div>
	</div>
</template>

<script>
// https://alligator.io/vuejs/vue-html5-canvas/

import ScoreList from './components/ScoreList.vue'
import Timer from './components/Timer.vue'
import Galaxy from './components/Galaxy.vue'
import {AudioPlayer} from './utils/audio/player'
import {VideoPlayer} from './utils/video/player'
import firebase from 'firebase/app'
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);


export default {
	name: 'countdown',
	components: {Galaxy, ScoreList, Timer},
	data() {
		return {
			scores : [],
			planets: [],
			worker: null,
			audioPlayer: null,
			countDownFinish: false,
			countDownStart: false
		};
	},
	methods: {
		callBackTimer: function(event) {
			switch(event.type){
				case'endCountDown':
				break;
				case 'time':
				break;
			}
		},
		startCountDown: function() {
			this.countDownStart = true;
			this.worker = new Worker('./computePositionsWorker.js');
			this.audioPlayer = new AudioPlayer();


			firestore.collection("planets").where("init", "==", true)
				.onSnapshot((snapshot) => {
					snapshot.docChanges().forEach((change) => {
							if (change.type === "added") {

									this.worker.postMessage({
										type: 'addOrUpdatePlanet',
										planet : change.doc.data()
									});
									console.log("New planet: ", change.doc.data());
							}
							if (change.type === "modified") {
									console.log("Modified planet: ", change.doc.data());
							}
							if (change.type === "removed") {
									this.worker.postMessage({
										type: 'removePlanet',
										planet: change.doc.data()
									});
									console.log("Removed planet: ", change.doc.data());
							}
					});
			});

			setTimeout(() => {
				this.worker.postMessage({
					type: 'init'
				});
			}, 1000);

			this.worker.onmessage = function(e) {
				const data = e.data;
				// console.log('Worker from vue receive message', data);
				switch(data.type){
					case 'planets':
					this.planets.length = 0;
					this.planets.push(...data.data);
					data.data.forEach(planet => {
						if (planet.init && planet.collision){
							this.$refs['galaxy'].explodedPlanet(planet);
							console.log('Will Notify destruction of planet : ', planet);
							// We have to set to !init the planet
							planet = { ...planet, ...{
								init: false,
								collision: false,
								iterations: 0,
								angle: 0,
								x: 0,
								y: 0
							}};
							firestore.collection("planets").doc(`${planet.id}`).set(planet);
						}
					})
					this.scores = this.planets.slice(0,5);
					break;
				}
			}.bind(this);
		},
		timeUpdate: function(event) {
			if (this.audioPlayer) {
				this.audioPlayer.manageSoundVolume(event.diff);
			}
		},
		endCountDown: function(){
			this.countDownFinish = true;
			const opacityElt = document.getElementById('opacity');
			opacity.style.display = '';
			setTimeout(_ => {
				opacityElt.classList.add('black');
				setTimeout(() => new VideoPlayer(opacityElt, () => {
					console.log('end');
					setTimeout(() => {
						window.location = './assets/img/image-16-9-sponsors.jpg';
					}, 5000);
				}).playVideo(), 4000);
			}, 100);
		}
	},

	mounted() {
		if (this.countDownFinish){
			return;
		}
		firestore.collection("admins").get('adminList')
		.then((adminList)=>{
			console.log('Admin Loggued :)');
		})
		.catch((error) =>{
			console.log(error);
			this.$router.push('/')
		});
	},

};
</script>

<style>
#countdown-container {
	position: absolute;
	margin: 0;
	padding: 0;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
}

#startCountDown{
	position: absolute;
	top: 50%;
	left: 50%;
	color: white;
	background: red;
	width: 200px;
	height:100px;
	font-size: 30px;
	margin-left: -100px;
	margin-top: -50px;
	border-radius: 20px;
	line-height: 45px;
}

#animation-galaxy{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	overflow: hidden;
	color: white;
	text-align: center;
}

#animation-galaxy .play-with-me {
	position: absolute;
	bottom: 50px;
	left: 0;
	width: 100%;
}

#opacity {
    position: absolute;
    overflow: hidden;
    background: black;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 5s;
    z-index: 100;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
#opacity video {
	height: 95vh;
}

#opacity.black {
    opacity: 1;
}

</style>
