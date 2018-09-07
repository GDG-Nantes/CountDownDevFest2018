<template>
  <div class="score">
     <div class="planet" v-if="planets.length > 0">
          <img v-bind:src="planets[0].url">
          <div> score : {{planets[0].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 0">
          <img v-bind:src="planets[0].url">
          <div> score : {{planets[0].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 1">
          <img v-bind:src="planets[1].url">
          <div> score : {{planets[1].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 2">
          <img v-bind:src="planets[2].url">
          <div> score : {{planets[2].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 3">
          <img v-bind:src="planets[3].url">
          <div> score : {{planets[3].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 4">
          <img v-bind:src="planets[4].url">
          <div> score : {{planets[4].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 5">
          <img v-bind:src="planets[5].url">
          <div> score : {{planets[5].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 6">
          <img v-bind:src="planets[6].url">
          <div> score : {{planets[6].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 7">
          <img v-bind:src="planets[7].url">
          <div> score : {{planets[7].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 8">
          <img v-bind:src="planets[8].url">
          <div> score : {{planets[8].score}}</div>
      </div>
      <div class="planet" v-if="planets.length > 9">
          <img v-bind:src="planets[9].url">
          <div> score : {{planets[9].score}}</div>
      </div>

  </div>
</template>

<script>
export default {
  name: 'Score',
  data: function() {
      return {
          planetsMap: this.planets
      }
  },
  props: {
    planets: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.score {
    color: white;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 100px;
  display: flex;
  flex-direction: column;
}
img{
    width: 50px;
}
</style>
