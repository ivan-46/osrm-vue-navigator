<script setup lang="ts">


import OsrmNavigator from './utility/Osrm'

const osrm = new OsrmNavigator(window.olMap)
osrm.on('updatePoints', data=> {
  console.log("test", data)
})
 
osrm.addPoint({
  id: '123',
  address: 'test',
  coordinate: [1, 1]
})
 

</script>

<template>
  <div>
    <h1>2222</h1>
  </div>
</template>

<style scoped lang="scss"></style>
