<template>
  <div id="app">
    <img src="./assets/logo.png">
    <button v-on:click="addPlanet">Add Planet</button>
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
  methods:{
    addPlanet: function(event) {
      const now = Date.now();
      firestore.collection("planets").add({
        	id: `id${now}`,
          url: "https://pbs.twimg.com/profile_images/973550404456861696/3GMoz0SV_400x400.jpg",
          radius: 30 + ((now % 2) === 0 ? -1 * Math.random() * 10 : Math.random() * 10),
          distance: 10 + Math.random() * 400,
          collision: false,
          iterations: 0,
          speed: (1 + Math.random() * 200),
          // Change datas
          angle: 0,
          x : 0,
          y : 0,
          score: 0,
          init: true
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
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
  margin-top: 60px;
}
</style>
