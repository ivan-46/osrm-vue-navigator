<template>
    <div class="RoutePoint">
        <div class="RoutePointCircle" :style="`background-color:${point.color};`"></div>
        <div class="RoutePointData">
            <div class="RoutePointDataAddress">
                <input type="text"
                    :placeholder='point.coordinate ? point.coordinate.map(item => item.toString().slice(0, 10)).join(",") : "What do you want to find?"'>
            </div>

            <div class="RoutePointDataBtns">
                <ButtonIcon @click="onMarkerDrag" :height="20" :src="makerImg" />
                <ButtonIcon @click="onRemove" :height="15" :src="clearImg" />
            </div>
        </div>
    </div>
    <img v-if="status == 'markerMove'" :src="makerImg" class="moveMarker"
        :style="`top:${markerXY[1]}px;left:${markerXY[0]}px;`" alt="">
</template>
<script setup lang="ts">
import { ref, toRef } from "vue";
import OsrmNavigator, { TPoint } from "../../utility/Osrm";
import ButtonIcon from "../ButtonIcon.vue"

import makerImg from "./icon/marker.png"
import clearImg from "./icon/clear.png"

const props = defineProps<{ point: TPoint, osrm: OsrmNavigator, i: number }>()
const point = toRef(props.point)

const status = ref<"markerOff" | 'markerMove'>()
const markerXY = ref<[number, number]>([0, 0])


const onRemove = () => props.osrm.removePoint(props.i)

const onMarkerDrag = () => {
    status.value = 'markerMove'
}

window.addEventListener('mousemove', (e) => {
    if (status.value == 'markerMove') {
        markerXY.value = [e.clientX, e.clientY]
    }
})

window.olMap.on('click', (e) => {
    if (status.value == 'markerMove') {
        props.osrm.setCoordinatePoint(props.i, e.coordinate)
        status.value = 'markerOff'
    }

})


</script>
<style lang="scss" scoped>
.moveMarker {
    position: fixed;
    transform: translateX(-50%) translateY(-100%);
    height: 30px;
    z-index: 1;
    pointer-events: none;
}

.RoutePoint {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    &Data {
        display: flex;
        // border: white 2px solid;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        padding: 10px;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        &Address {
            display: flex;
            align-items: center;
            gap: 15px;

            input {
                font-size: 1.05em;
            }

        }


        &Btns {
            display: flex;
            gap: 5px;


        }
    }

    &Circle {
        display: flex;
        max-width: 15px;
        max-height: 15px;
        min-width: 15px;
        min-height: 15px;
        width: 15px;
        height: 15px;
        border-radius: 100%;
    }



}
</style>