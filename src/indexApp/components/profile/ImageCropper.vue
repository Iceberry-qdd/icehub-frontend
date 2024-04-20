<template>
    <div
        class="bg-[#00000066] fixed h-full w-full z-[101]"
        @click.self="!state.originImgFile ? emits('dismiss') : ''">
        <input
            v-show="false"
            ref="fileInput"
            type="file"
            multiple="false"
            name="imgFile"
            accept=".jpg,.png,.jpeg,.bmp,.gif,.svg,.heic,.nef,.webp,.tiff,.tif"
            @change="choosePics" />
        <div class="bg-white divide-x-[1px] flex flex-nowrap flex-row h-[30rem] rounded-[8px] select-none translate-x-[calc((100vw-50rem)/2)] translate-y-[calc((100vh-30rem)/2)] w-[50rem]">
            <div
                v-if="!state.originImgFile"
                class="-translate-x-1/2 -translate-y-1/2 absolute active:bg-gray-100/50 border-[1px] cursor-pointer flex flex-col flex-nowrap gap-2 h-[15rem] hover:bg-gray-100 items-center justify-center left-1/2 rounded-[8px] top-1/2 w-[25rem]"
                @click="fileInput.click()">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="material-icons-round no-hover p-0">upload</div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="text-[0.9rem] text-zinc-500">点击上传图片</div>
            </div>
            <div
                v-if="state.originImgFile"
                class="basis-3/5 bg-black flex flex-row h-full items-center justify-center">
                <div class="h-fit relative w-fit">
                    <div
                        ref="cropperMask"
                        class="absolute bg-black/50 cursor-crosshair h-full left-0 top-0 w-full">
                        <div
                            :style="[pointSize, nwPointTranslate]"
                            class="absolute bg-red-500 cursor-nw-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nwp'" />
                        <div
                            :style="[pointSize, sePointTranslate]"
                            class="absolute bg-red-500 cursor-se-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'sep'" />
                        <div
                            :style="[pointSize, swPointTranslate]"
                            class="absolute bg-red-500 cursor-sw-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'swp'" />
                        <div
                            :style="[pointSize, nePointTranslate]"
                            class="absolute bg-red-500 cursor-ne-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nep'" />
                    
                        <div
                            :style="[wLineTranslate, verticalLineSize]"
                            class="absolute bg-white cursor-w-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'wl'" />
                        <div
                            :style="[nLineTranslate, horizontalLineSize]"
                            class="absolute bg-white cursor-n-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nl'" />
                        <div
                            :style="[eLineTranslate, verticalLineSize]"
                            class="absolute bg-white cursor-e-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'el'" />
                        <div
                            :style="[sLineTranslate, horizontalLineSize]"
                            class="absolute bg-white cursor-s-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'sl'" />
                    
                        <div
                            id="cropper-frame"
                            :style="[cropFrameTranslate, cropFrameSize]"
                            class="absolute bg-white cursor-move mix-blend-overlay z-[3]"
                            @mousemove="handleMove"
                            @mouseup="state.mode = undefined"
                            @mouseleave="state.mode = undefined"
                            @mousedown="state.mode = 'move'" />
                        <div
                            v-if="state.mode === 'zoom'"
                            id="zoomMask"
                            :class="cropperMaskClass"
                            class="absolute bg-transparent h-full left-0 top-0 w-full z-[4]"
                            @mouseleave="state.mode = undefined"
                            @mouseup="state.mode = undefined"
                            @mousemove.self="handleZoom" />
                    </div>
                    <img
                        ref="originImg"
                        class="h-auto max-h-[30rem]"
                        :src="originImgBlob"
                        @load="initCropper" />
                </div>
            </div>
            <div
                v-if="state.originImgFile"
                class="basis-2/5 flex flex-col overflow-x-hidden overflow-y-auto relative">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <canvas ref="canvas" class="h-auto max-h-[20rem] object-contain p-3 w-full" />
                <div class="content-start flex-1 gap-4 grid grid-cols-[repeat(4,3.5rem)] justify-center pb-3 place-items-center w-full">
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">rotate_left</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">rotate_right</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">rotate_90_degrees_cw</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">rotate_90_degrees_ccw</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">flip</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">crop_rotate</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">zoom_out_map</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">transform</div>
                    <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-icons-round no-hover p-4 rounded-full">lock</div>
                </div>
                <div class="backdrop-blur-md border-t-[1px] bottom-0 flex flex-row gap-x-3 h-fit items-center justify-center py-2 rounded-br-[8px] sticky w-[calc(50rem*2/5)] w-full">
                    <div
                        class="active:bg-blue-500/75 bg-blue-500 cursor-pointer h-[2.25rem] hover:bg-blue-600 px-3 py-2 rounded-full text-[0.9rem] text-center text-white w-[40%]"
                        @click="applyImg">
                        应用
                    </div>
                    <div
                        class="active:bg-gray-200/75 active:text-zinc-500 bg-gray-200 cursor-pointer h-[2.25rem] hover:bg-gray-300 px-3 py-2 rounded-full text-[0.9rem] text-black text-center w-[40%]"
                        @click="skip">
                        跳过裁剪
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.basis-2\/5.overflow-y-auto.relative::-webkit-scrollbar {
    width: 8px !important;
    -webkit-appearance: none;
    background: transparent;
    border-radius: 9999px;
}

.basis-2\/5.overflow-y-auto.relative::-webkit-scrollbar-thumb {
    width: 8px !important;
    -webkit-appearance: none;
    background: #00000033;
    border-radius: 9999px;
}
</style>

<!-- eslint-disable vue/max-lines-per-block vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, computed, onMounted,onUnmounted, ref } from 'vue'

const props = defineProps({
    /** 裁剪后图像的宽高比 */
    aspectRatio: {
        type:Number,
        required: false,
        default: 1
    },
    /** 裁剪模式，目前支持按长宽比(aspectRatio)或矩形裁剪(rectangle) */
    mode: {
        type: String,
        required: true
    },
    /** 传入的图片文件，如不传入，则触发文件选择器，否则使用此文件 */
    originImgFile: {
        type:Object,
        required: false,
        default: undefined
    }
})
const cropperMask = ref(null)
const originImg = ref(null)
const fileInput = ref(null)
const canvas = ref(null)
const emits = defineEmits(['dismiss', 'imageFile'])
const state = reactive({
    /** 左上角点位置(点有大小，指点的中心位置)，left取值范围[0, width('#cropper-mask')]，right取值范围[0, height('#cropper-mask')] */
    nw: {left: 0, top: 0},
    /** 右下角点位置(点有大小，指点的中心位置)，取值范围同上 */
    se: {left: 0, top: 0},
    /** 原始图片缩放比 */
    picZoomRatio: 1,
    /** 点的宽度(长度) */
    pointSize: 8,
    /** 线的粗细 */
    lineThickness:1,
    /** 操作模式，[move(移动) | zoom(缩放)] */
    mode: undefined,
    /** cropperMask大小(宽高) */
    mask: {width: 0, height: 0},
    /** 若是在zoom模式下，声明操作的哪个部分，点(nwp, nep, swp, sep)或线(nl, wl, sl, el) */
    zoomType: undefined,
    canvas: {
        /** canvas上下文对象 */
        context: undefined,
        /** 传递给canvas的image对象 */
        shadowImg: undefined,
        width: 400,
        height: 400
    },
    originImgFile: props.originImgFile
})

const pointSize = computed(() => ({
    'width': `${state.pointSize}px`,
    'height': `${state.pointSize}px`
}))

const nwPointTranslate = computed(() => ({
    'translate': `${state.nw.left-state.pointSize/2}px ${state.nw.top-state.pointSize/2}px`
}))

const nePointTranslate = computed(() => ({
    'translate': `${state.se.left-state.pointSize/2}px ${state.nw.top-state.pointSize/2}px`
}))

const swPointTranslate = computed(() => ({
    'translate': `${state.nw.left-state.pointSize/2}px ${state.se.top-state.pointSize/2}px`
}))

const sePointTranslate = computed(() => ({
    'translate': `${state.se.left-state.pointSize/2}px ${state.se.top-state.pointSize/2}px`
}))

const verticalLineLength = computed(() => {
    return state.se.top - state.nw.top
})

const verticalLineSize = computed(() => ({
    'width': `${state.lineThickness}px`,
    'height': `${verticalLineLength.value}px`
}))

const horizontalLineLength = computed(() => {
    return state.se.left - state.nw.left
})

const horizontalLineSize = computed(() => ({
    'width': `${horizontalLineLength.value}px`,
    'height': `${state.lineThickness}px`
}))

const wLineTranslate = computed(() => ({
    'translate': `${state.nw.left}px ${state.nw.top}px`
}))

const nLineTranslate = computed(() => ({
    'translate': `${state.nw.left}px ${state.nw.top}px`
}))

const eLineTranslate = computed(() => ({
    'translate': `${state.se.left}px ${state.nw.top}px`
}))

const sLineTranslate = computed(() => ({
    'translate': `${state.nw.left}px ${state.se.top}px`
}))

const cropFrameTranslate = computed(() => ({
    'translate': `${state.nw.left + state.lineThickness}px ${state.nw.top + state.lineThickness}px`
}))

const cropFrameSize = computed(() => ({
    'width': `${state.se.left - state.nw.left - state.lineThickness}px`,
    'height': `${state.se.top - state.nw.top - state.lineThickness}px`
}))

const canvasSize = computed(() => ({
    'width': `${state.canvas.width}px`,
    'height': `${state.canvas.height}px`
}))

function handleMove(event){
    if(state.mode === 'move') {
        // move模式下，先将线的长度设置为常量，防止快速移动时长度越来越长
        const hLineLength = horizontalLineLength.value
        const vLineLength = verticalLineLength.value
    
        state.nw.left = Math.max(0, Math.min(state.nw.left + event.movementX, state.mask.width - hLineLength))
        state.se.left = Math.max(hLineLength, Math.min(state.se.left + event.movementX, state.mask.width))
        state.nw.top = Math.max(0, Math.min(state.nw.top + event.movementY, state.mask.height - vLineLength))
        state.se.top = Math.max(vLineLength, Math.min(state.se.top + event.movementY, state.mask.height))
        updateCanvas()
    }
}

const cropperMaskClass = computed(() => ({
    'cursor-nw-resize': state.mode === 'zoom' && state.zoomType === 'nwp',
    'cursor-se-resize': state.mode === 'zoom' && state.zoomType === 'sep',
    'cursor-sw-resize': state.mode === 'zoom' && state.zoomType === 'swp',
    'cursor-ne-resize': state.mode === 'zoom' && state.zoomType === 'nep',
    'cursor-w-resize': state.mode === 'zoom' && state.zoomType === 'wl',
    'cursor-n-resize': state.mode === 'zoom' && state.zoomType === 'nl',
    'cursor-e-resize': state.mode === 'zoom' && state.zoomType === 'el',
    'cursor-s-resize': state.mode === 'zoom' && state.zoomType === 'sl'
}))

function handleZoom(event){
    if(state.mode !== 'zoom') return
    if(props.mode === 'aspectRatio'){
        handleZoomAspectRatio(event)
        return
    }
    if(props.mode !== 'rectangle'){
        store.setErrorMsg('裁剪模式不受支持！')
        console.error(`裁剪模式不受支持：mode = ${props.mode}`)
        return
    }

    const offsetY = event.offsetY
    const offsetX = event.offsetX
    switch (state.zoomType) {
        case 'nwp':
            state.nw.left = Math.max(0, Math.min(offsetX, state.se.left))
            state.nw.top = Math.max(0, Math.min(offsetY, state.se.top))
            break;
        case 'sep':
            state.se.left = Math.min(state.mask.width, Math.max(offsetX, state.nw.left))
            state.se.top = Math.min(state.mask.height, Math.max(offsetY, state.nw.top))
            break;
        case 'swp':
            state.nw.left = Math.max(0, Math.min(offsetX, state.se.left))
            state.se.top = Math.min(state.mask.height, Math.max(offsetY, state.nw.top))
            break;
        case 'nep':
            state.se.left = Math.min(state.mask.width, Math.max(offsetX, state.nw.left))
            state.nw.top = Math.max(0, Math.min(offsetY, state.se.top))
            break;
        case 'wl':
            state.nw.left = Math.max(0, Math.min(offsetX, state.se.left))
            break;
        case 'nl':
            state.nw.top = Math.max(0, Math.min(offsetY, state.se.top))
            break;
        case 'el':
            state.se.left = Math.min(state.mask.width, Math.max(offsetX, state.nw.left))
            break;
        case 'sl':
            state.se.top = Math.min(state.mask.height, Math.max(offsetY, state.nw.top))
            break;
        default:
            break;
    }
    updateCanvas()
}

function handleZoomAspectRatio(event){
    let heightDiff = 0, maxHeight = 0
    switch (state.zoomType) {
        case 'nwp':
            state.nw.top = Math.max(Math.max(0, state.se.top - state.se.left  / props.aspectRatio), Math.min(event.offsetY, state.se.top))
            state.nw.left = state.se.left - verticalLineLength.value * props.aspectRatio
            break;
        case 'sep':
            heightDiff = cropperMask.value.offsetHeight - state.nw.top - (cropperMask.value.offsetWidth - state.nw.left) / props.aspectRatio
            maxHeight = heightDiff > 0 ? cropperMask.value.offsetHeight - heightDiff : cropperMask.value.offsetHeight
            state.se.top = Math.min(maxHeight, Math.max(event.offsetY, state.nw.top))
            state.se.left = state.nw.left + verticalLineLength.value * props.aspectRatio
            break;
        case 'swp':
            heightDiff = cropperMask.value.offsetHeight - state.nw.top - state.se.left / props.aspectRatio
            maxHeight = heightDiff > 0 ? cropperMask.value.offsetHeight - heightDiff : cropperMask.value.offsetHeight
            state.se.top = Math.min(maxHeight, Math.max(event.offsetY, state.nw.top))
            state.nw.left = state.se.left - verticalLineLength.value * props.aspectRatio
            break;
        case 'nep':
            const minHeight = state.se.top - (cropperMask.value.offsetWidth - state.nw.left) / props.aspectRatio
            state.nw.top = Math.max(minHeight, Math.min(event.offsetY, state.se.top))
            state.se.left = state.nw.left + verticalLineLength.value * props.aspectRatio
            break;
        default:
            break;
    }
    updateCanvas()
}

function updateCanvas(width, height){
    state.canvas.context.clearRect(0, 0, canvas.value.width , canvas.value.height)

    const widthInZoomMode = state.canvas.height * (horizontalLineLength.value / verticalLineLength.value)
    canvas.value.height = height || state.canvas.height
    canvas.value.width = state.mode === 'zoom' ? widthInZoomMode : width || state.canvas.width * props.aspectRatio

    state.canvas.context.drawImage(
        state.canvas.shadowImg,
        state.nw.left * state.picZoomRatio, state.nw.top * state.picZoomRatio,
        horizontalLineLength.value * state.picZoomRatio, verticalLineLength.value * state.picZoomRatio,
        0, 0,
        canvas.value.width , canvas.value.height
    )
}

const originImgBlob = computed(() => {
    if(!state.originImgFile) return undefined
    
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(state.originImgFile)
    return imgUrl
})


function choosePics(){
    state.originImgFile = fileInput.value.files[0]
}

function initCanvas(){
    const img = new Image()
    img.onload = function(){
        state.canvas.context = canvas.value.getContext('2d')
        canvas.value.height = state.canvas.height
        canvas.value.width = state.canvas.width * props.aspectRatio
        state.canvas.context.drawImage(
            img,
            state.nw.left * state.picZoomRatio, state.nw.top * state.picZoomRatio,
            horizontalLineLength.value * state.picZoomRatio, verticalLineLength.value * state.picZoomRatio,
            0, 0,
            canvas.value.width, canvas.value.height
        )
    }
    img.src = originImgBlob.value
    state.canvas.shadowImg = img
}

function initCropper(){
    state.mask.width = cropperMask.value.offsetWidth
    state.mask.height = cropperMask.value.offsetHeight

    const [originImgOffsetWidth, originImgOffsetHeight] = [originImg.value.offsetWidth, originImg.value.offsetHeight]
    const [originImgNaturalWidth, originImgNaturalHeight] = [originImg.value.naturalWidth, originImg.value.naturalHeight]

    state.picZoomRatio = originImgNaturalWidth / originImgOffsetWidth
    state.se.top = Math.min(originImgOffsetWidth, originImgOffsetHeight)
    state.se.left = state.se.top

    if(props.mode === 'aspectRatio'){
        if(props.aspectRatio >= 1 && originImgOffsetWidth <= originImgOffsetHeight){
            state.se.top = state.se.left / props.aspectRatio
        }else {
            state.se.left = state.se.top * props.aspectRatio
        }
    }

    if(state.originImgFile){
        initCanvas()
    }
}

/**
 * 将canvas中的图片转换为File对象
 */
function applyImg(){
    updateCanvas(state.mask.width * state.picZoomRatio, state.mask.height * state.picZoomRatio)
    const base64Img = canvas.value.toDataURL(state.originImgFile.type)
    const base64Data = atob(base64Img.split(',')[1])
    let len = base64Data.length
    const u8Arr = new Uint8Array(len)
    while(len--){
        u8Arr[len] = base64Data.charCodeAt(len)
    }
    const file = new File([u8Arr], state.originImgFile.name, {type: state.originImgFile.type})
    emits('imageFile', {file: file})
    emits('dismiss')
}

function skip(){
    emits('imageFile', {file: state.originImgFile})
    emits('dismiss')
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    if(!props.originImgFile){
        fileInput.value.click()
    }
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
})
</script>