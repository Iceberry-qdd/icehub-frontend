<template>
    <div v-if="store.SHOW_IMAGE_CROPPER">
        <input v-show="false" @change="choosePics" type="file" multiple="false" id="imgFile" name="imgFile"
            accept="image/*" />
        <div @click.self="dismiss"
            class="dialog fixed flex flex-row justify-center items-center w-screen h-screen bg-[#00000066] z-[107]">
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
                    class="relative max-w-full max-h-full pointer-move" width="0" height="0"></canvas>
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
import { reactive } from 'vue';
import { store } from '../../store.js'

const state = reactive({
    img: null,
    imgWidth: 0,
    imgHeight: 0,
    clipMaskWidth: 0,
    clipMaskHeight: 0,
    ctx: null,
    isMouseDown: false,
    isMouseLeave: false
})

function dismiss() {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
    store.dismissImageCropper()
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
    const imgs = imgFileSelector.files;
    //console.log(imgs)

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

            state.imgWidth = image.naturalWidth
            state.imgHeight = image.naturalHeight

            state.clipMaskWidth = state.imgWidth
            state.clipMaskHeight = 18 * state.imgWidth / 38
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
        drawMask(ctx, 0, 0)
    }
}

function drawMask(ctx, startX, startY) {
    ctx.clearRect(0, 0, state.imgWidth, state.imgHeight);
    ctx.fillStyle = 'rgba(0,0,0,0.4)'
    ctx.fillRect(0, 0, state.img.width, state.img.height)

    const clipMaskWidth = state.clipMaskWidth
    const clipMaskHeight = state.clipMaskHeight

    ctx.globalCompositeOperation = 'source-atop';
    ctx.clearRect(startX, startY, clipMaskWidth, clipMaskHeight)

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#3b82f6';
    let size = 12; // 自定义像素点大小
    ctx.fillRect(0, 0, size, size);
    ctx.fillRect(0, clipMaskHeight - size, size, size);
    ctx.fillRect(clipMaskWidth - size, 0, size, size);
    ctx.fillRect(clipMaskWidth - size, clipMaskHeight - size, size, size);

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

    //console.log(x)
    // const startX = x - state.clipMaskWidth / 2;
    // const startY = y - state.clipMaskHeight / 2;
    const startX = x //TODO 举行左上角转中心坐标
    const startY = y
    drawMask(state.ctx, startX, startY)
}

</script>