<template>
	<div id="countdown-container">
		<Galaxy v-bind:planets="planets"></Galaxy>
		<ScoreList v-bind:planets="scores"></ScoreList>
		<Timer></Timer>
	</div>
</template>

<script>
// https://alligator.io/vuejs/vue-html5-canvas/

import ScoreList from './components/ScoreList.vue'
import Timer from './components/Timer.vue'
import Galaxy from './components/Galaxy.vue'
import {AudioPlayer} from './utils/audio/player'
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
			audioPlayer: null
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
		}
	},

	mounted() {
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
				this.scores = this.planets.slice(0,10);
				break;
			}
		}.bind(this);
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

</style>
