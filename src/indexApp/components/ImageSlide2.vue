<template>
    <div
        id="slide-container"
        ref="container"
        :class="{'scroll-smooth': state.scrollSmooth}"
        class="bg-black/75 fixed-page flex flex-row justify-between no-scrollbar overflow-x-auto overflow-y-hidden snap-mandatory snap-normal snap-x">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div class="cursor-pointer fixed ml-4 mt-4 p-2 z-[2]" @click="close">
            <span
                class="bg-[#6b728055] hover:bg-[#6b7280cc] material-symbols-rounded rounded-full">
                close
            </span>
        </div>
        <div
            v-show="showScrollPre"
            class="bg-transparent cursor-pointer fixed h-full hover:bg-gradient-to-r hover:from-black hover:text-white hover:to-transparent left-0 max-lg:hidden text-transparent w-[15%] z-[1]"
            @click="scrollToPre">
            <div class="flex h-full items-center justify-end pl-4">
                <span class="material-symbols-rounded">arrow_back_ios_new</span>
            </div>
        </div>
        <div
            v-for="(img, index) in state.imgs"
            :id="`img-${index}`"
            :key="index"
            class="flex-none grid h-screen overflow-y-auto place-items-center relative snap-center w-screen"
            @click.self="close">
            <picture>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <source :srcset="`${state.imageBaseUrl}${img.url}${state.editData[index].showOrigin ? '' : `?max_width=${innerWidth}&max_height=${innerHeight}`}`" type="image/webp" />
                <img
                    :id="`img-${index}`"
                    :style="imgClass(index, img.thumb)"
                    class="bg-center bg-cover bg-no-repeat max-h-screen max-w-[100vw] transition-all"
                    loading="lazy"
                    :src="img.thumb" />
            </picture>
            <Transition name="fade">
                <div
                    v-if="img.altText && state.editData[index].showAlt"
                    class="absolute bottom-20 flex items-center justify-center max-sm:bottom-0 w-full z-[1]">
                    <div class="bg-[#000000AA] break-all break-words h-fit leading-[1.5rem] max-h-[calc(100vh-6rem)] max-sm:bg-white max-sm:dark:bg-[#1e1e1e] max-sm:dark:text-inherit max-sm:pt-0 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:text-neutral-500 max-sm:w-screen no-scrollbar overflow-y-auto px-4 py-3 rounded-[8px] sm:max-w-[75vw] text-[0.9rem] text-justify text-white w-fit">
                        <div class="bg-white dark:bg-[#1e1e1e] flex h-6 items-center justify-center sm:hidden sticky top-0">
                            <div class="bg-gray-200 dark:bg-neutral-700 h-[0.35rem] rounded-full w-12" />
                        </div>
                        {{ img.altText }}
                    </div>
                </div>
            </Transition>
        </div>
        <div
            v-show="showScrollNext"
            class="bg-transparent cursor_pointer fixed h-full hover:bg-gradient-to-l hover:from-black hover:text-white hover:to-transparent max-lg:hidden right-0 text-transparent w-[15%] z-[105]"
            @click="scrollToNext">
            <div class="flex h-full items-center justify-start pl-4">
                <span class="material-symbols-rounded">arrow_forward_ios</span>
            </div>
        </div>
        <div class="-translate-x-1/2 backdrop-blur-md bg-gray-500/50 bottom-8 fixed flex flex-nowrap flex-row left-1/2 px-2 rounded-full">
            <div
                title="向左旋转"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="rotate(-90, state.activeImgIndex)">
                rotate_left
            </div>
            <div
                title="向右旋转"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="rotate(90, state.activeImgIndex)">
                rotate_right
            </div>
            <div
                title="放大"
                :class="state.editData[state.activeImgIndex].zoomRatio >= 5 ? 'cursor-not-allowed pointer-events-none text-white/25' : 'text-white/50 active:text-white'"
                class="material-symbols-rounded max-lg:hidden no-hover"
                @click="zoom(0.25, state.activeImgIndex)">
                zoom_in
            </div>
            <div
                title="缩小"
                :class="state.editData[state.activeImgIndex].zoomRatio <=0.25 ? 'cursor-not-allowed pointer-events-none text-white/25' : 'text-white/50 active:text-white'"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="zoom(-0.25, state.activeImgIndex)">
                zoom_out
            </div>
            <div
                v-show="state.editData[state.activeImgIndex].mode === 'fit-screen'"
                title="1:1"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="toggleZoomMode('fit-content', state.activeImgIndex)">
                zoom_in_map
            </div>
            <div
                v-show="state.editData[state.activeImgIndex].mode === 'fit-content'"
                title="适应屏幕"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="toggleZoomMode('fit-screen', state.activeImgIndex)">
                zoom_out_map
            </div>
            <div
                title="翻转"
                class="active:text-white material-symbols-rounded max-lg:hidden no-hover text-white/50"
                @click="flip(state.activeImgIndex)">
                flip
            </div>
            <div
                v-if="state.imgs[state.activeImgIndex].altText"
                title="显示替代文字"
                class="cursor-pointer p-2 rounded-full">
                <IconAltOn
                    fill-color="#EEEEEE"
                    :fill-opacity="state.editData[state.activeImgIndex].showAlt ? 1 : 0.5"
                    class="active:text-white h-[1.2rem] text-white/50 translate-y-[2px] w-[1.2rem]"
                    @click="state.editData[state.activeImgIndex].showAlt = !state.editData[state.activeImgIndex].showAlt">
                </IconAltOn>
            </div>
            <div
                v-if="!state.editData[state.activeImgIndex].showOrigin"
                class="active:text-white content-center cursor-pointer p-2 select-none text-[0.9rem] text-white/50"
                @click="showOriginImg(state.activeImgIndex)">
                原图
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { store } from '@/indexApp/js/store.js'
import IconAltOn from '@/components/icons/IconAltOn.vue'

const container = ref()
const state = reactive({
    imgs: store.SLIDE_DATA.urls,
    activeImgIndex: store.SLIDE_DATA.curIdx,
    imageBaseUrl: import.meta.env.VITE_OBJECT_BASE_URL,
    scrollSmooth: false,
    editData: store.SLIDE_DATA.urls.map((_) => {return {rotateAngle: 0, zoomRatio: 1, flip: false, mode: 'fit-content', showOrigin: false, showAlt: false}}),
})

function close() {
    if(store.MOBILE_MODE && state.imgs[state.activeImgIndex].altText && state.editData[state.activeImgIndex].showAlt){
        state.editData[state.activeImgIndex].showAlt = false
        return
    }
    store.dismissSlide()
}

const innerWidth = computed(() => {
    return window.innerWidth
})

const innerHeight = computed(() => {
    return window.innerHeight
})

const showScrollNext = computed(() => {
    return state.activeImgIndex < state.imgs.length - 1
})

const showScrollPre = computed(() => {
    return state.activeImgIndex > 0
})

function scrollToNext() {
    container.value.scrollLeft += container.value.offsetWidth
}

function scrollToPre() {
    container.value.scrollLeft -= container.value.offsetWidth
}

function scrollToSpec(index){
    if(index < 0 || index > state.imgs.length) index = 0
    container.value.scrollLeft = container.value.offsetWidth * index
}

function imgClass(index, thumb){
    const editData = state.editData[index]
    return {
        'background-image': `url(${thumb})`,
        'transform': `rotate(${editData.rotateAngle}deg) ${editData.flip ? 'scaleX(-1)' : ''} scale(${Math.max(editData.zoomRatio, 0)})`,
        'width': editData.mode === 'fit-screen' ? '100vw' : ''
    }
}

function rotate(angle, index){
    state.editData[index].rotateAngle += angle
}

function zoom(ratio, index){
    const lastRatio = state.editData[index].zoomRatio
    state.editData[index].zoomRatio += Math.abs(lastRatio + ratio) > 5 ? 0 : ratio
}

/**
 * 切换缩放模式
 * @param {string} mode 缩放模式，支持fit-content | fit-screen
 * @param {number} index 图片数组下标
 */
function toggleZoomMode(mode = 'fit-content', index){
    state.editData[index].zoomRatio = 1
    state.editData[index].mode = mode
}

function flip(index){
    state.editData[index].flip = !state.editData[index].flip
}

function showOriginImg(index){
    state.editData[index].showOrigin = true
}

function handleIntersection(e){
    const activeImgIndex = [...e].filter(it => it.isIntersecting)
          .map(it => parseInt(it.target.id.split('-').at(-1)))
          .at(0)
    state.activeImgIndex = activeImgIndex || store.SLIDE_DATA.curIdx
}

onMounted(() => {
    scrollToSpec(state.activeImgIndex)
    state.scrollSmooth = true
    const observer = new IntersectionObserver(handleIntersection, {
        root: container.value,
        rootMargin: '0px',
        threshold: 0.5
    })
    state.imgs.forEach((_, index) => observer.observe(container.value.querySelector(`#img-${index}`)))
})
</script>