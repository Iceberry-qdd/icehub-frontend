<template>
    <div class="w-full h-[2px] z-[99]">
        <div
            class="bg-blue-500 h-[2px] w-0 transition-all duration-1000"
            :style="{width: `${props.routing ? state.progress: 100}%` }"></div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, onMounted, onUnmounted, computed, watch } from 'vue'
const props = defineProps(['routing'])
const emits = defineEmits(['close'])

const state = reactive({
    progress: 0,
    timeoutId: 0
})

onMounted(() => {
    state.timeoutId = setTimeout(() => {
        state.progress = 85
    }, 100);
})

watch(() => props.routing, (newVal, oldVal) => {
    if(!newVal && oldVal){
        emits('close')
    }
})

onUnmounted(() => {
    clearTimeout(state.timeoutId)
})
</script>