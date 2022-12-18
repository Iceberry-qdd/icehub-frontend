<template>
    <div v-if="isShow" class="flex flex-row fixed justify-between w-screen h-screen bg-[#000000cc] z-[105]">
        <div @click="close" class="fixed text-white z-[106]">
            <span class="material-icons-round mt-4 ml-4 bg-[#6b728055] cursor-pointer hover:bg-[#6b7280cc] p-2 rounded-full">close</span>
        </div>
        <div @click="this.activeIndex--"
            class="cursor-pointer h-full w-[15%] z-[105] bg-transparent text-transparent hover:text-white hover:bg-gradient-to-r hover:from-black hover:to-transparent">
            <div class="flex h-full pl-4 justify-end items-center ">
                <span class="material-icons-round">arrow_back_ios</span>
            </div>
        </div>
        <div class="flex absolute flex-col w-screen h-screen items-center justify-center">
            <img v-show="index == activeImgIndex" class=" max-h-screen max-w-screen" :src="url"
                v-for="(url, index) in this.store.SLIDE_DATA.urls" :key="index" />
        </div>
        <div @click="this.activeIndex++"
            class="cursor_pointer h-full w-[15%] z-[105] bg-transparent text-transparent hover:text-white hover:bg-gradient-to-l hover:from-black hover:to-transparent">
            <div class="flex h-full pl-4 justify-start items-center ">
                <span class="material-icons-round">arrow_forward_ios</span>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script>
import { store } from '../../store.js'
export default {
    data() {
        return {
            imgs: [],
            store,
            activeIndex: 0
        }
    },
    methods: {
        close() {
            this.store.dismissSlide()
            document.querySelector("body").removeAttribute("style", "overflow:hidden")
        }
    },
    computed: {
        isShow() {
            return this.store.SLIDE_DATA.urls.length > 0
        },
        activeImgIndex() {
            const len = this.store.SLIDE_DATA.urls.length
            return Math.abs(this.activeIndex) % len;
        }
    },
    unmounted(){
        this.activeIndex=0;
    }
}
</script>