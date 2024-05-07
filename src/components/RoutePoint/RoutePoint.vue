<template>
    <div class="RoutePoint">
        <div :class="classPoint" :style="`background-color:${point.color};`"></div>
        <div class="RoutePointData">
            <div class="RoutePointDataAddress">
                <input type="text" :value="point.address"
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
import { computed, ref, toRef } from "vue";
import ButtonIcon from "../ButtonIcon.vue"
// import { Draw, Modify, Select, Snap } from 'ol/interaction.js';
import makerImg from "./icon/marker.png"
import clearImg from "./icon/clear.png"
import PointRouter, { TPoint } from "../../utility/PointMod";
import OsrmNavigator from "../../utility/Osrm";

const props = defineProps<{ point: PointRouter, osrm: OsrmNavigator, i: number }>()

const point = ref(props.point.getPoint())

const status = ref<"markerOff" | 'markerMove' | 'markerOn'>()
const markerXY = ref<[number, number]>([0, 0])

const points = props.osrm.getPoints().value

const classPoint = computed(() => {
    if (props.i == 0 || props.i == (points.length - 1)) {
        return "RoutePointCircle"
    }

    return "RoutePointBox"
})

const onRemove = () => props.osrm.removePoint(props.i)

const onMarkerDrag = () => {
    status.value = 'markerMove'
}

window.addEventListener('mousemove', (e) => {
    if (status.value == 'markerMove') {
        markerXY.value = [e.clientX, e.clientY]
    }
})

props.point.on('updatePoint', (pointData: TPoint) => {
    point.value = pointData
})

window.olMap.on('click', (e) => {
    if (status.value == 'markerMove') {
        props.point.setCoordinatePoint(e.coordinate)
        status.value = 'markerOff'
    }

})


</script>
<style lang="scss" scoped>
.box {}

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
            gap: 20px;
            width: 100%;

            input {
                font-size: 0.9em;
                width: 100%;
            }

        }


        &Btns {
            display: flex;
            gap: 5px;


        }
    }

    &Circle {
        display: flex;
        min-width: 15px;
        min-height: 15px;
        width: 15px;
        height: 15px;
        border-radius: 100%;
    }

    &Box {
        display: flex;
        min-width: 10px;
        min-height: 10px;
        width: 10px;
        height: 10px;
        border-radius: 2px;
        margin-right: 5px;
        margin-left: 10px;
    }


}
</style>