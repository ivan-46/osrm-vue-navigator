<script setup lang="ts">

import RoutePoint from './components/RoutePoint/RoutePoint.vue'
import OsrmNavigator from './utility/Osrm'


const osrm = new OsrmNavigator(window.olMap)
const points = osrm.getPoints()

const addPoint = () => {
  if (points.value.length < 9) {
    osrm.addPoint()
  }

}

const reset = () => {
  osrm.reset
  for (let i = 0; i < 2; i++) {
    osrm.addPoint()
  }
}
reset()
//test




</script>

<template>
  <div class="osrm">
    <div class="osrmTypeRouter">
      <p>car</p>
      <p>bike</p>
      <p>foot</p>
    </div>
    <div class="osrmList">
      <RoutePoint v-for="(point, i) in points" :i="i" :point="point" :osrm="osrm" :key="point.id" />
    </div>
    <div class="osrmBtns">
      <p @click="addPoint">Add</p>
      <p @click="reset">Reset</p>
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

  &Btns {
    display: flex;
    justify-content: space-between;
    gap: 5px;
    padding: 0 20px;

    p {
      color: rgba(255, 255, 255, 0.9);
      padding: 5px;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        color: rgba(136, 144, 255, 0.9);
      }
    }

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
