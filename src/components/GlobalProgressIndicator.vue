<template>
    <div class="h-fit w-full">
        <div
            class="bg-blue-500 dark:bg-gray-200 duration-1000 h-[2px] max-lg:h-[3px] transition-all w-0"
            :style="{width: `${props.routing ? state.progress: 100}%` }" />
    </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, watch } from 'vue'
const props = defineProps({
    /** 当前是否为正在路由中 */
    routing: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['close'])

const state = reactive({
    progress: 0,
    timeoutId: 0
})

onMounted(() => {
    state.timeoutId = setTimeout(() => { state.progress = 20 }, 100);
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