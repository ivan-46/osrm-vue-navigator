<template>
    <div class="RoutePoint">
        <div class="RoutePointCircle"></div>
        <div class="RoutePointData">
            <div class="RoutePointDataAddress">
                <input type="text" placeholder="55.23232 22.232323">
            </div>

            <div class="RoutePointDataBtns">
                <button>
                    <img src="./icon/clear.png" alt="">
                </button>
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
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
                font-size: 1.1em;
            }

        }


        &Btns {
            display: flex;
            gap: 5px;

            button {
                cursor: pointer;

                img {
                    height: 15px;
                }
            }
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
        background-color: red;
        border-radius: 100%;
    }



}
</style>