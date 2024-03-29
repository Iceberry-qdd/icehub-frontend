<template>
    <div>
        <input
            v-show="false"
            id="imgFile"
            type="file"
            multiple="false"
            name="imgFile"
            accept="image/*"
            @change="choosePics" />
        <div
            class="bg-[#00000066] dialog fixed flex flex-row h-screen items-center justify-center w-screen z-[107]"
            @click.self="dismiss">
            <div class="absolute bottom-[5%] cursor-pointer dialog-card fex-row flex gap-0 rounded-full">
                <div
                    v-if="state.ctx"
                    class="first:rounded-l-full hover:bg-gray-300 hover:first:rounded-l-full hover:last:rounded-r-full last:rounded-r-full px-4 py-2"
                    @click="isGif ? getGif() : getClippedPic()">
                    确定
                </div>
                <div
                    class="first:rounded-l-full hover:bg-gray-300 hover:first:rounded-l-full hover:last:rounded-r-full last:rounded-r-full px-4 py-2"
                    @click="dismiss">
                    取消
                </div>
            </div>
            <div
                class="box-content dialog-card fixed flex flex-col gap-y-2 h-2/3 items-center justify-center p-4 rounded-md w-1/2">
                <span
                    v-if="state.img == null"
                    class="material-icons-round rotate-[-90deg] text-[30pt]"
                    @click="choosePics">logout</span>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div v-if="state.img == null">选择本地图片</div>
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <canvas
                    v-if="!isGif"
                    id="canvas"
                    class="cursor-move max-h-full max-w-full relative"
                    width="0"
                    height="0"
                    @mousemove="moveMask($event)"
                    @mousedown="state.isMouseDown = true"
                    @mouseup="state.isMouseDown = false"
                    @mouseleave="state.isMouseLeave == true">
                </canvas>
                <img
                    v-if="isGif"
                    id="gif-preview"
                    :src="state.imgSrc"
                    class="cursor-move max-h-full max-w-full relative" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.dialog-card {
    background-color: rgb(255 255 255 / 80%);
    backdrop-filter: blur(25px);
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { store } from '@/indexApp/js/store.js'

const state = reactive({
    img: null,
    imgSrc:null,
    canvasParams: { width: 0, height: 0 },
    ctx: null,
    clipParams: { startX: 0, startY: 0 },
    isMouseDown: false,
    isMouseLeave: false,
    banner: null,
    imageType: 'image/png'
})

const clipMaskWidth = computed(() => {
    switch (store.CROPPED_IMAGE.mode) {
        case 'banner':
            return state.img.width
        case 'avatar':
            return Math.min(state.img.width, state.img.height)
        default:
            return state.img.height
    }
})

const clipMaskHeight = computed(() => {
    switch (store.CROPPED_IMAGE.mode) {
        case 'banner':
            return 18 * state.img.width / 38
        case 'avatar':
            return clipMaskWidth.value
        default:
            return state.img.height
    }
})

function dismiss() {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
    store.setCroppedImageMode('')
    store.dismissImageCropper()
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
    const imgs = imgFileSelector.files

    if (imgs.length == 0) return

    loadImage(imgFileSelector.files[0])
}

const isGif = computed(() => {
    return state.imageType == 'image/gif'
})

function loadImage(file) {
    state.imageType = file.type
    const reader = new FileReader()
    let result = new Image()

    reader.readAsDataURL(file)
    reader.onload = function (e) {
        const image = new Image()
        image.onload = function () {
            result.width = image.width
            result.height = image.height
        }
        image.src = e.target.result
        image.crossOrigin = 'Anonymous'

        result.src = image.src
        result.crossOrigin = image.crossOrigin
        state.imgSrc = image.src
    }

    state.img = result
    if (!isGif.value) { drawImage() }
}

function drawImage() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    state.img.onload = function () {
        canvas.width = state.img.width
        canvas.height = state.img.height
        ctx.drawImage(state.img, 0, 0)

        state.ctx = ctx
        state.canvasParams.width = document.getElementById('canvas').clientWidth
        state.canvasParams.height = document.getElementById('canvas').clientHeight
        drawMask(ctx, 0, 0)
    }
}

function drawMask(ctx, startX, startY) {
    ctx.clearRect(0, 0, state.img.width, state.img.height)
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, state.img.width, state.img.height)

    const cWidth = clipMaskWidth.value
    const cHeight = clipMaskHeight.value

    ctx.globalCompositeOperation = 'source-atop';
    ctx.clearRect(startX, startY, cWidth, cHeight)

    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(state.img, 0, 0)
}

function moveMask(e) {
    if (state.isMouseDown == false || state.isMouseLeave == true) return

    const event = e || window.event;
    let x, y
    if (event.offsetX || event.offsetY) {  //适用非Mozilla浏览器
        x = event.offsetX
        y = event.offsetY
    } else if (event.layerX || event.layerY) {  //兼容Mozilla浏览器
        x = event.layerX
        y = event.layerY
    }

    const centerX = x * state.img.width / state.canvasParams.width //鼠标指针所在位置
    const centerY = y * state.img.height / state.canvasParams.height //鼠标指针所在位置

    let startX = centerX - clipMaskWidth.value / 2
    let startY = centerY - clipMaskHeight.value / 2

    // 计算鼠标可移动的范围
    if (startX < 0) startX = 0
    if (startY < 0) startY = 0
    if (state.img.width - startX < clipMaskWidth.value) startX = state.img.width - clipMaskWidth.value
    if (state.img.height - startY < clipMaskHeight.value) startY = state.img.height - clipMaskHeight.value

    state.clipParams.startX = startX
    state.clipParams.startY = startY

    drawMask(state.ctx, startX, startY)
}

function getClippedPic() {
    const data = state.ctx.getImageData(state.clipParams.startX, state.clipParams.startY, clipMaskWidth.value, clipMaskHeight.value)

    const shadowCanvas = document.createElement('canvas', { id: 'shadow-canvas' })
    const ctx = shadowCanvas.getContext('2d')
    shadowCanvas.width = data.width
    shadowCanvas.height = data.height
    ctx.putImageData(data, 0, 0)

    const base64ImageData = shadowCanvas.toDataURL(state.imageType)
    store.setCroppedImageData(base64ImageData)

    dismiss()
}

function getGif() {
    const data = state.img.src
    store.setCroppedImageData(data)
    dismiss()
}
</script>