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
}
</style>
