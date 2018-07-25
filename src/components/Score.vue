<template>
  <div class="score">
      <div class="planet" v-for="planet in planets.slice(0,10)" :key="planet.id">
          <img v-bind:src="planet.url">
          <div> score : {{planet.score}}</div>
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
