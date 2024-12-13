<template>
    <div
        class="bg-[#00000066] fixed-page max-sm:bg-black place-items-center sm:backdrop-blur-md sm:grid"
        @click.self="!state.originImgFile ? emits('dismiss') : ''">
        <Header
            class="backdrop-blur-none bg-black/75 sm:hidden w-full"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            icon-color="white"
            no-border
            @handle-action="applyImg">
            <div class="flex font-bold gap-x-2 items-center justify-start text-white w-full">
                <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                <div class="close-btn material-symbols-rounded text-[1.125rem] text-white" @click="skip">arrow_back_ios_new</div>
                <div>返回</div>
            </div>
        </Header>
        <input
            v-show="false"
            ref="fileInput"
            type="file"
            multiple="false"
            name="imgFile"
            accept=".jpg,.png,.jpeg,.bmp,.gif,.svg,.heic,.nef,.webp,.tiff,.tif"
            @change="choosePics" />
        <div class="bg-white dark:bg-[#1e1e1e] dark:divide-neutral-700 divide-x-[1px] flex flex-nowrap flex-row h-[30rem] max-sm:bg-zinc-900 max-sm:divide-x-0 max-sm:flex-col max-sm:h-[calc(100vh-4rem-48px)] max-sm:rounded-none max-sm:w-full rounded-[8px] select-none w-[min(50rem,100vw)]">
            <div
                v-if="!state.originImgFile"
                class="-translate-x-1/2 -translate-y-1/2 absolute active:bg-gray-100/50 border-[1px] cursor-pointer dark:active:bg-neutral-700 dark:border-neutral-700 dark:hover:bg-neutral-800 flex flex-col flex-nowrap gap-2 h-[min(50%,15rem)] hover:bg-gray-100 items-center justify-center left-1/2 rounded-[8px] top-1/2 w-[min(50%,25rem)]"
                @click="fileInput.click()">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="dark:text-white/25 material-symbols-rounded no-hover p-0">upload</div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="dark:text-white/25 text-[0.9rem] text-zinc-500">选择图片</div>
            </div>
            <div
                v-if="state.originImgFile"
                class="bg-black dark:bg-[#1e1e1e] flex flex-row h-full items-center justify-center sm:basis-3/5">
                <div class="h-fit relative w-fit">
                    <div
                        ref="cropperMask"
                        class="absolute bg-black/50 cursor-crosshair fixed-page h-full left-0 top-0 w-full">
                        <div
                            :style="[pointSize, nwPointTranslate]"
                            class="absolute bg-white cursor-nw-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nwp'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'nwp'" />
                        <div
                            :style="[pointSize, sePointTranslate]"
                            class="absolute bg-white cursor-se-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'sep'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'sep'" />
                        <div
                            :style="[pointSize, swPointTranslate]"
                            class="absolute bg-white cursor-sw-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'swp'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'swp'" />
                        <div
                            :style="[pointSize, nePointTranslate]"
                            class="absolute bg-white cursor-ne-resize z-[2]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nep'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'nep'" />
                    
                        <div
                            :style="[wLineTranslate, verticalLineSize]"
                            class="absolute bg-white cursor-w-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'wl'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'wl'" />
                        <div
                            :style="[nLineTranslate, horizontalLineSize]"
                            class="absolute bg-white cursor-n-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'nl'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'nl'" />
                        <div
                            :style="[eLineTranslate, verticalLineSize]"
                            class="absolute bg-white cursor-e-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'el'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'el'" />
                        <div
                            :style="[sLineTranslate, horizontalLineSize]"
                            class="absolute bg-white cursor-s-resize z-[1]"
                            @mousedown="state.mode = 'zoom'; state.zoomType = 'sl'"
                            @touchstart="state.mode = 'zoom'; state.zoomType = 'sl'" />
                    
                        <div
                            id="cropper-frame"
                            :style="[cropFrameTranslate, cropFrameSize]"
                            class="absolute bg-white cursor-move mix-blend-overlay z-[0]"
                            @mousemove="handleMove"
                            @touchmove="handleMove"
                            @mouseup="state.mode = undefined"
                            @touchend="handleTouchEnd"
                            @mouseleave="state.mode = undefined"
                            @mousedown="state.mode = 'move'"
                            @touchstart="state.mode = 'move'" />
                        <div
                            v-if="state.mode === 'zoom'"
                            id="zoomMask"
                            :class="cropperMaskClass"
                            class="absolute bg-transparent h-full left-0 top-0 w-full z-[4]"
                            @mouseleave="state.mode = undefined"
                            @mouseup="state.mode = undefined"
                            @touchend.self="handleTouchEnd"
                            @mousemove.self="handleZoom"
                            @touchmove="handleZoom" />
                    </div>
                    <img
                        ref="originImg"
                        class="h-auto max-h-[30rem] max-sm:max-h-[calc(100vh-4rem-48px)]"
                        :src="originImgBlob"
                        @load="initCropper" />
                </div>
            </div>
            <div
                v-if="state.originImgFile"
                class="flex flex-col max-sm:bottom-0 max-sm:fixed max-sm:h-[4rem] max-sm:overflow-x-auto max-sm:overflow-y-hidden modern-scrollbar-y overflow-x-hidden overflow-y-auto relative sm:basis-2/5 w-full">
                <div
                    v-if="!showUnImpl"
                    class="flex h-[calc(100%-2.25rem-0.5rem*2)] items-center justify-center max-sm:hidden w-full">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <canvas ref="canvas" class="h-auto max-h-full object-contain p-3 w-full" />
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <canvas v-else ref="canvas" class="h-auto max-h-[20rem] max-sm:hidden max-sm:w-fit object-contain p-3 w-full" />
                <div
                    v-if="showUnImpl"
                    class="content-start flex-1 gap-x-4 justify-center max-sm:flex max-sm:flex-nowrap max-sm:gap-x-0 max-sm:justify-start max-sm:p-0 max-sm:w-fit pb-3 place-items-center sm:grid sm:grid-cols-[repeat(4,3.5rem)] w-full">
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">rotate_90_degrees_ccw</div>
                        <div class="text">左旋90°</div>
                    </div>
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">rotate_90_degrees_cw</div>
                        <div class="text">右旋90°</div>
                    </div>
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">flip</div>
                        <div class="text">水平翻转</div>
                    </div>
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">flip</div>
                        <div class="text">垂直翻转</div>
                    </div>
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">transform</div>
                        <div class="text">自由裁剪</div>
                    </div>
                    <div class="menu">
                        <div class="icon material-symbols-rounded no-hover">settings_backup_restore</div>
                        <div class="text">复原</div>
                    </div>
                    <!-- <div class="active:bg-gray-200/75 bg-gray-200 hover:bg-gray-300 material-symbols-rounded no-hover p-4 rounded-full">lock</div> -->
                </div>
                <div class="backdrop-blur-md border-t-[1px] bottom-0 dark:border-t-neutral-700 flex flex-row gap-x-3 h-fit items-center justify-center max-sm:hidden py-2 rounded-br-[8px] sticky w-full">
                    <div
                        class="active:bg-primary-inActive bg-primary cursor-pointer h-[2.25rem] px-3 py-2 rounded-full text-[0.9rem] text-center text-onPrimary w-[40%]"
                        @click="applyImg">
                        应用
                    </div>
                    <div
                        class="active:bg-gray-200/75 bg-gray-200 cursor-pointer dark:active:bg-primary-inActive dark:bg-primary h-[2.25rem] px-3 py-2 rounded-full text-[0.9rem] text-center text-onPrimaryContainer-inActive w-[40%]"
                        @click="skip">
                        跳过裁剪
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.menu {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;
    align-items: center;
    justify-content: center;
    width: max-content;
}

.menu > .icon {
    --tw-bg-opacity: 1;
    background-color: rgb(229 231 235 / var(--tw-bg-opacity));
    padding: 1rem;
    border-radius: 9999px;
    padding: 1rem;
}

.menu > .icon:where([theme="dark"], [theme="dark"] *){
    background-color: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.5);
}

.menu > .icon:active {
    background-color: rgb(229 231 235 / 0.75);
}

.menu > .icon:active:where([theme="dark"], [theme="dark"] *) {
    background-color: rgba(255, 255, 255, 0.25);
}

.menu > .text {
    --tw-text-opacity: 1;
    color: rgb(113 113 122 / var(--tw-text-opacity));
    font-size: 0.8rem;
}

.menu > .text:where([theme="dark"], [theme="dark"] *){
    color: rgba(255, 255, 255, 0.5);
}

#h{
    background-color: #000000dd;
}

@media not all and (min-width: 640px) {
    .menu {
        height: 100%;
        padding: 0 0.25rem;
        min-width: 4rem;
    }

    .menu:active{
        background-color: rgba(255, 255, 255, 0.25);
    }

    .menu > .icon {
        color: white;
        padding: 0;
    }

    .menu > .icon:active,.menu > .icon:hover,.menu > .icon {
        background-color: transparent;
    }

    .menu > .text {
        color: white;
        font-size: 0.75rem;
    }
}
</style>

<!-- eslint-disable vue/max-lines-per-block vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { isType } from '@/indexApp/utils/formatUtils.js'
import { store } from '@/indexApp/js/store.js'
const Header = defineAsyncComponent(() => import('@/indexApp/components/Header.vue'))

const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
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
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交'
    },
    /** 左上角点位置(点有大小，指点的中心位置)，left取值范围[0, width('#cropper-mask')]，right取值范围[0, height('#cropper-mask')] */
    nw: {left: 0, top: 0},
    /** 右下角点位置(点有大小，指点的中心位置)，取值范围同上 */
    se: {left: 0, top: 0},
    /** 原始图片缩放比 */
    picZoomRatio: 1,
    /** 点的宽度(长度) */
    pointSize: store.MOBILE_MODE ? 16 : 8,
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
    originImgFile: props.originImgFile,
    originImageRotate: 0,
    lastTouchMove: {
        x: undefined,
        y: undefined
    }
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

function handleMove(e){
    if(state.mode === 'move') {
        // move模式下，先将线的长度设置为常量，防止快速移动时长度越来越长
        const hLineLength = horizontalLineLength.value
        const vLineLength = verticalLineLength.value
        let dx = 0, dy = 0
        if (isType(e, TouchEvent)) {
            const clientX = e.changedTouches.item(0).clientX, clientY = e.changedTouches.item(0).clientY
            dx = (clientX - state.lastTouchMove.x) || 0
            dy = (clientY - state.lastTouchMove.y) || 0
            state.lastTouchMove.x = clientX
            state.lastTouchMove.y = clientY
        } else if (isType(e, MouseEvent)) {
            dx = e.movementX
            dy = e.movementY
        }
    
        state.nw.left = Math.max(0, Math.min(state.nw.left + dx, state.mask.width - hLineLength))
        state.se.left = Math.max(hLineLength, Math.min(state.se.left + dx, state.mask.width))
        state.nw.top = Math.max(0, Math.min(state.nw.top + dy, state.mask.height - vLineLength))
        state.se.top = Math.max(vLineLength, Math.min(state.se.top + dy, state.mask.height))
        if(!store.MOBILE_MODE){
            updateCanvas(canvas.value.width, canvas.value.height)
        }
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

function handleTouchEnd(){
    state.mode = undefined
    state.lastTouchMove.x = undefined
    state.lastTouchMove.y = undefined
}

function handleZoom(e){
    if(state.mode !== 'zoom') return
    if(props.mode === 'aspectRatio'){
        handleZoomAspectRatio(e)
        return
    }
    if(props.mode !== 'rectangle'){
        store.setErrorMsg(`裁剪模式不受支持：mode = ${props.mode}`)
        return
    }

    let offsetX, offsetY
    if (isType(e, TouchEvent)) {
        offsetX = e.changedTouches.item(0).pageX - originImg.value.getBoundingClientRect().left
        offsetY = e.changedTouches.item(0).pageY - originImg.value.getBoundingClientRect().top
    } else if (isType(e, MouseEvent)) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

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
    if(!store.MOBILE_MODE){
        updateCanvas()
    }
}

function handleZoomAspectRatio(e){
    let heightDiff = 0, maxHeight = 0
    let offsetX, offsetY
        if (isType(e, TouchEvent)) {
            offsetX = e.changedTouches.item(0).pageX - originImg.value.getBoundingClientRect().left
            offsetY = e.changedTouches.item(0).pageY - originImg.value.getBoundingClientRect().top
        } else if (isType(e, MouseEvent)) {
            offsetX = e.offsetX
            offsetY = e.offsetY
        }
    switch (state.zoomType) {
        case 'nwp':
            state.nw.top = Math.max(Math.max(0, state.se.top - state.se.left  / props.aspectRatio), Math.min(offsetY, state.se.top))
            state.nw.left = state.se.left - verticalLineLength.value * props.aspectRatio
            break;
        case 'sep':
            heightDiff = cropperMask.value.offsetHeight - state.nw.top - (cropperMask.value.offsetWidth - state.nw.left) / props.aspectRatio
            maxHeight = heightDiff > 0 ? cropperMask.value.offsetHeight - heightDiff : cropperMask.value.offsetHeight
            state.se.top = Math.min(maxHeight, Math.max(offsetY, state.nw.top))
            state.se.left = state.nw.left + verticalLineLength.value * props.aspectRatio
            break;
        case 'swp':
            heightDiff = cropperMask.value.offsetHeight - state.nw.top - state.se.left / props.aspectRatio
            maxHeight = heightDiff > 0 ? cropperMask.value.offsetHeight - heightDiff : cropperMask.value.offsetHeight
            state.se.top = Math.min(maxHeight, Math.max(offsetY, state.nw.top))
            state.nw.left = state.se.left - verticalLineLength.value * props.aspectRatio
            break;
        case 'nep':
            const minHeight = state.se.top - (cropperMask.value.offsetWidth - state.nw.left) / props.aspectRatio
            state.nw.top = Math.max(minHeight, Math.min(offsetY, state.se.top))
            state.se.left = state.nw.left + verticalLineLength.value * props.aspectRatio
            break;
        default:
            break;
    }
    if(!store.MOBILE_MODE){
        updateCanvas()
    }
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
        if(props.aspectRatio >= 1){
            if(state.se.top * props.aspectRatio > originImgOffsetWidth){
                state.se.left = originImgOffsetWidth
                state.se.top = state.se.left / props.aspectRatio
            }else {
                state.se.left = state.se.top * props.aspectRatio
            }
        }else {
            if(state.se.left / props.aspectRatio > originImgOffsetHeight){
                state.se.top = originImgOffsetHeight
                state.se.left = state.se.top * props.aspectRatio
            }else {
                state.se.top = state.se.left / props.aspectRatio
            }
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
    updateCanvas(horizontalLineLength.value * state.picZoomRatio, verticalLineLength.value * state.picZoomRatio)
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
    if(!props.originImgFile){
        fileInput.value.click()
    }
})
</script>