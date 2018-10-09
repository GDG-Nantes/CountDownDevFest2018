<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
@font-face {
    font-family: 'Nasalization';
    src: url('/assets/fonts/nasalization-rg.ttf');
}

body {
  margin: 0;
  padding: 0;
  background-color: #302c33;
}

#app {
  font-family: 'Nasalization', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>
