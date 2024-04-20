<template>
    <button>
        <img :src="props.src" :height="props.height" alt="">
    </button>
</template>
<script setup lang="ts">
const props = defineProps<{ height: number, src: string }>()
</script>
<style lang="scss" scoped>
button {
    cursor: pointer;
}
</style>