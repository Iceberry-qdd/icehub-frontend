<template>
    <div class="relative">
        <div class="container h-full">
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <canvas
                ref="canvas"
                class="h-full w-full">
            </canvas>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tiny5&display=swap');

.container::after {
    content: v-bind(containerContent);
    text-align: center;
    align-content: center;
    font-size: v-bind(containerFontSize);
    font-weight: bold;
    color: v-bind(containerColor);
    font-family: "Tiny5", system-ui, -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at center, rgb(0 0 0 / 0) 0%, rgb(0 0 0 / 0.6) 100%);
}
</style>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'

const canvas = ref()
const props = defineProps({
    /** 提示信息 */
    text:{
        type: String,
        required: false,
        default: 'NO SIGNAL'
    },
    /** 显示模式，静态(STATIC)或动态(DYNAMIC) */
    mode:{
        type: String,
        required: false,
        default: store.SYS_REDUCE_ANIMATION ? 'STATIC' : 'DYNAMIC',
        validator: (value, _) => {
            return ['DYNAMIC', 'STATIC'].includes(value)
        }
    }
})

const state = reactive({
    canvas: {
        /**
         * canvas上下文对象
         * @type {CanvasRenderingContext2D}
         **/
        ctx: undefined,
        width: 0,
        height: 0,
        /**
         * canvas所有像素点颜色值
         * @type {ImageData}
         */
        colorData: undefined
    },
    /** @type {MediaQueryList} */
    mediaQueryList: undefined
})

const containerContent = computed(() => {
    return `'${props.text}'`
})

const containerFontSize = computed(() => {
    return props.text === 'NO SIGNAL' ? '4rem' : '1rem'
})

const containerColor = computed(() => {
    return reduceAnimation.value ? 'rgb(255 255 255 /0.35)' : 'rgb(0 0 0 /0.75)'
})

const reduceAnimation = computed(() => {
    return store.SYS_REDUCE_ANIMATION || props.mode === 'STATIC' || JSON.parse(localStorage.getItem('reduceAnimation') || false)
})

function initCanvas() {
    state.canvas.ctx = canvas.value.getContext('2d')
    reset()
}

function initColorData(){
    state.canvas.ctx.fillStyle = 'black'
    state.canvas.ctx.fillRect(0, 0, state.canvas.width, state.canvas.height)
    state.canvas.ctx.fill()
    state.canvas.colorData = state.canvas.ctx.getImageData(0,0,state.canvas.width, state.canvas.height)
}

function drawBg(){
    // [red, green, blue, alpha, red, green,...,alpha]
    const data = state.canvas.colorData.data
    for(let i = 0; i < data.length; i++){
        const color = Math.floor(Math.random() * 255) + 50
        data[i++] = color
        data[i++] = color
        data[i++] = color
    }
    state.canvas.ctx.putImageData(state.canvas.colorData, 0, 0)
}

function step(){
    self.requestAnimationFrame(step)
    state.canvas.ctx.clearRect(0,0,state.canvas.width, state.canvas.height)
    drawBg()
}

function reset(){
    state.canvas.width = canvas.value.width = canvas.value.clientWidth
    state.canvas.height = canvas.value.height = canvas.value.clientHeight
}

onMounted(() => {
    document.addEventListener('resize', reset)
    initCanvas()
    initColorData()
    if(!reduceAnimation.value){
        drawBg()
        step()
    }
})

onUnmounted(() => {
    cancelAnimationFrame(step)
})
</script>