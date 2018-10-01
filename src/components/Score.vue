<template>
    <div class="planet">
        <img v-bind:src="planet.url">
        <div> {{planet.name}}</div>
        <div> score : {{planet.score}}</div>
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
.planet img{
    width: 50px;
}
</style>
