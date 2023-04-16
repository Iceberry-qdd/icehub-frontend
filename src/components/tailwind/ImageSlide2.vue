<template>
    <div class="flex flex-row fixed justify-between w-screen h-screen bg-[#000000cc] z-[105]">
        <div @click="close" class="fixed text-white z-[106]">
            <span
                class="material-icons-round mt-4 ml-4 bg-[#6b728055] cursor-pointer hover:bg-[#6b7280cc] p-2 rounded-full">close</span>
        </div>
        <div @click="state.activeIndex--" v-show="state.activeIndex > 0"
            class="cursor-pointer fixed left-0 h-full w-[15%] z-[105] bg-transparent text-transparent hover:text-white hover:bg-gradient-to-r hover:from-black hover:to-transparent">
            <div class="flex h-full pl-4 justify-end items-center ">
                <span class="material-icons-round">arrow_back_ios</span>
            </div>
        </div>
        <div class="flex absolute flex-col w-screen h-screen items-center justify-center">
            <div v-for="(url, index) in state.imgs" :key="index" :index="index" >
                <img v-show="index == state.activeIndex && url.originUrl" class=" max-h-screen max-w-screen" :src="url.originUrl"  />
                <img v-show="index == state.activeIndex && !url.originUrl && url.previewUrl" class=" min-h-[25rem] min-w-[25rem] max-h-screen max-w-screen" :src="url.previewUrl"/>
            </div>
        </div>
        <div @mouseenter="state.showAlt = true" v-if="state.showAlt == false && state.imgs[state.activeIndex].altText" class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#000000BB] rounded-full p-2 cursor-pointer">
            <IconAltOn class="w-[1.2rem] h-[1.2rem]"></IconAltOn>
        </div>
        <div @mouseleave="state.showAlt = false" v-if="state.showAlt == true && state.imgs[state.activeIndex].altText" class="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[11pt] leading-[1.5rem] text-justify break-words bg-[#000000AA] px-4 py-3 rounded-[8px]">
            {{ state.imgs[state.activeIndex].altText }}
        </div>
        <div @click="state.activeIndex++" v-show="state.activeIndex < state.imgs.length - 1"
            class="cursor_pointer fixed right-0 h-full w-[15%] z-[105] bg-transparent text-transparent hover:text-white hover:bg-gradient-to-l hover:from-black hover:to-transparent">
            <div class="flex h-full pl-4 justify-start items-center ">
                <span class="material-icons-round">arrow_forward_ios</span>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { store } from '@/store.js'
import { reactive } from 'vue'
import IconAltOn from '../icons/IconAltOn.vue';

const state = reactive({
    imgs: store.SLIDE_DATA.urls,
    activeIndex: store.SLIDE_DATA.curIdx,
    showAlt:false
})

function close() {
    store.dismissSlide()
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
}

</script>