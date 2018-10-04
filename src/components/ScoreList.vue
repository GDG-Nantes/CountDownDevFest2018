<template>
  <div class="score">
    <!--
      Hack to avoid VueJS to create and destroy dom elements.
      Using a v-for with key don't work because we work with 60fps and the list is changing too many times
      to let Vue doing it's magic with key
      -->
     <Score
        v-if="planets.length > 0"
        v-bind:planet="planets[0]"
        ></Score>
     <Score
        v-if="planets.length > 1"
        v-bind:planet="planets[1]"
        ></Score>
     <Score
        v-if="planets.length > 2"
        v-bind:planet="planets[2]"
        ></Score>
     <Score
        v-if="planets.length > 3"
        v-bind:planet="planets[3]"
        ></Score>
     <Score
        v-if="planets.length > 4"
        v-bind:planet="planets[4]"
        ></Score>
     <!--<Score
        v-if="planets.length > 5"
        v-bind:planet="planets[5]"
        ></Score>
     <Score
        v-if="planets.length > 6"
        v-bind:planet="planets[6]"
        ></Score>
     <Score
        v-if="planets.length > 7"
        v-bind:planet="planets[7]"
        ></Score>
     <Score
        v-if="planets.length > 8"
        v-bind:planet="planets[8]"
        ></Score>
     <Score
        v-if="planets.length > 9"
        v-bind:planet="planets[9]"
        ></Score>-->

  </div>
</template>

<script>
import Score from './Score.vue'
export default {
  name: 'ScoreList',
  components: {Score},
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
    width: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>
