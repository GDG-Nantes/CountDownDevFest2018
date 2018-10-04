<template>
    <div class="planet">
        <img v-bind:src="planet.url">
        <div class="planet-name"> {{planet.name}}</div>
        <div class="planet-score"> score :<br>{{planet.score}}</div>
    </div>
</template>

<script>
export default {
  name: 'Score',
  props: {
    planet: Object
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.planet{

    height: 150px;
    width: 150px;
    font-size: 20px;
    margin: 15px 0;
}
.planet .planet-name {
    text-overflow: ellipsis;
}

.planet .planet-score {
    text-align: center;
}

.planet img{
    width: 70px;
    border-radius: 70px;
}
</style>
