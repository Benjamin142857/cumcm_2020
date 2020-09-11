<template>
  <div id="app">
    <SimulationSystem/>
  </div>
</template>

<script>
import SimulationSystem from './components/SimulationSystem.vue'

export default {
  name: 'App',
  components: {
    SimulationSystem
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: rgb(240, 240, 240);
  margin: 0;
  padding: 20px;
  min-height: 700px;
  height: auto;
  width: 100%;
}
</style>
