<template>
    <div v-if="store.SHOW_IMAGE_CROPPER">
        <input v-show="false" @change="choosePics" type="file" multiple="false" id="imgFile" name="imgFile"
            accept="image/*" />
        <div @click.self="dismiss"
            class="dialog fixed flex flex-row justify-center items-center w-screen h-screen bg-[#00000066] z-[107]">
            <div class="cursor-pointer absolute bottom-[5%] flex fex-row gap-0 dialog-card rounded-full">
                <div class="hover:bg-gray-300 py-2 px-4 rounded-l-full" @click="getClippedPic">确定</div>
                <div class="hover:bg-gray-300 py-2 px-4 rounded-r-full" @click="dismiss">取消</div>
            </div>
            <div
                class="dialog-card fixed p-4 box-content flex flex-col gap-y-2 justify-center items-center w-1/2 h-2/3 rounded-md">
                <span v-if="state.img == null" @click="choosePics"
                    class="material-icons-round rotate-[-90deg] text-[30pt]">logout</span>
                <div v-if="state.img == null">选择本地图片</div>
                <!-- <div v-if="state.img != null" class="max-w-full max-h-full">
                    <img class="max-w-full max-h-full" src="../../assets/default-bg.jpg" />
                </div> -->
                <canvas @mousemove="moveMask($event)" @mousedown="state.isMouseDown = true"
                    @mouseup="state.isMouseDown = false" @mouseleave="state.isMouseLeave == true" id="canvas"
                    class="relative max-w-full max-h-full cursor-move" width="0" height="0"></canvas>
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
import { onUnmounted, reactive, computed } from 'vue';
import { store } from '../../store.js'

const state = reactive({
    img: null,
    canvasParams: { width: 0, height: 0 },
    ctx: null,
    clipParams: { startX: 0, startY: 0 },
    isMouseDown: false,
    isMouseLeave: false,
    banner: null
})

const clipMaskWidth = computed(() => {
    return state.img.width
})

const clipMaskHeight = computed(() => {
    switch (store.CROPPED_IMAGE.mode) {
        case 'banner':
            return 18 * state.img.width / 38
        case 'avatar':
            return state.img.width
        default:
            return state.img.height
    }
})

function dismiss() {
    state.img = null
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
    store.dismissImageCropper()
    store.setCroppedImageMode('')
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
    const imgs = imgFileSelector.files;

    if (imgs.length == 0) return

    loadImage(imgFileSelector.files[0])
    drawImage()
}

function loadImage(file) {
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
    }

    state.img = result
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

    // ctx.globalCompositeOperation = 'source-over';
    // ctx.fillStyle = '#3b82f6';
    // let size = 12; // 自定义像素点大小
    // ctx.fillRect(0, 0, size, size);
    // ctx.fillRect(0, cHeight - size, size, size);
    // ctx.fillRect(cWidth - size, 0, size, size);
    // ctx.fillRect(cWidth - size, cHeight - size, size, size);

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

    //console.log(shadowCanvas.toDataURL().split(',')[1])

    const base64ImageData = shadowCanvas.toDataURL()
    store.setCroppedImageData(base64ImageData)

    dismiss()
}

onUnmounted(() => {
    console.log('组件已销毁')
})
</script>