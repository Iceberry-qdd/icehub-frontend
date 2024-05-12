<template>
    <div class="bg-[#000000cc] fixed flex flex-row h-screen justify-between w-screen z-[105]">
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <div class="fixed text-white z-[106]" @click="close">
            <span
                class="bg-[#6b728055] cursor-pointer hover:bg-[#6b7280cc] material-icons-round ml-4 mt-4 p-2 rounded-full">
                close
            </span>
        </div>
        <div
            v-show="state.activeIndex > 0"
            class="bg-transparent cursor-pointer fixed h-full hover:bg-gradient-to-r hover:from-black hover:text-white hover:to-transparent left-0 text-transparent w-[15%] z-[105]"
            @click="state.activeIndex--">
            <div class="flex h-full items-center justify-end pl-4">
                <span class="material-icons-round">arrow_back_ios</span>
            </div>
        </div>
        <div class="absolute flex flex-col h-screen items-center justify-center w-screen">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-for="(img, index) in state.imgs" :key="index">
                <picture>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <source :srcset="`${state.imageBaseUrl}${img.url}?max_width=${innerWidth}&max_height=${innerHeight}`" type="image/webp" />
                    <img
                        v-show="index == state.activeIndex"
                        :style="{ 'background-image': `url(${img.thumb})` }"
                        class="bg-center bg-cover bg-no-repeat max-h-screen max-w-screen"
                        :src="img.thumb" />
                </picture>
            </div>
        </div>
        <div
            v-if="!state.showAlt && state.imgs[state.activeIndex].altText"
            class="-translate-x-1/2 absolute bg-[#000000BB] bottom-3 cursor-pointer left-1/2 p-2 rounded-full"
            @mouseenter="state.showAlt = true">
            <IconAltOn class="h-[1.2rem] w-[1.2rem]"></IconAltOn>
        </div>
        <div
            v-if="state.showAlt && state.imgs[state.activeIndex].altText"
            class="-translate-x-1/2 absolute bg-[#000000AA] bottom-3 break-all break-words leading-[1.5rem] left-1/2 px-4 py-3 rounded-[8px] text-[11pt] text-justify text-white"
            @mouseleave="state.showAlt = false">
            {{ state.imgs[state.activeIndex].altText }}
        </div>
        <div
            v-show="state.activeIndex < state.imgs.length - 1"
            class="bg-transparent cursor_pointer fixed h-full hover:bg-gradient-to-l hover:from-black hover:text-white hover:to-transparent right-0 text-transparent w-[15%] z-[105]"
            @click="state.activeIndex++">
            <div class="flex h-full items-center justify-start pl-4">
                <span class="material-icons-round">arrow_forward_ios</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { store } from '@/indexApp/js/store.js'
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'

const state = reactive({
    imgs: store.SLIDE_DATA.urls,
    activeIndex: store.SLIDE_DATA.curIdx,
    showAlt: false,
    imageBaseUrl: import.meta.env.VITE_OBJECT_BASE_URL
})

function close() {
    store.dismissSlide()
}

const innerWidth = computed(() => {
    return window.innerWidth
})

const innerHeight = computed(() => {
    return window.innerHeight
})

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
})
</script>