<script setup lang="ts">

import { ref } from 'vue'
import RoutePoint from './components/RoutePoint/RoutePoint.vue'
import OsrmNavigator from './utility/Osrm'
import { uuidv4 } from './utility/uuid'


const osrm = new OsrmNavigator(window.olMap)
const points = ref(osrm.getPoints())

osrm.on('updatePoints', data => {
  points.value = data
})

osrm.addPoint({
  id: uuidv4(),
  address: '',
  coordinate: []
})


</script>

<template>
  <div class="osrm">
    <div class="osrmTypeRouter">
      <p>car</p>
      <p>bike</p>
      <p>foot</p>
    </div>
    <div class="osrmList">
      <RoutePoint v-for="point in points" :key="point.id" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.osrm {
  padding: 10px;

  &List {
    padding: 10px 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &TypeRouter {
    display: flex;
    justify-content: start;
    gap: 5px;

    p {
      background: rgba(255, 255, 255, 0.2);
      padding: 5px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.4);
      }
    }

  }

}
</style>
