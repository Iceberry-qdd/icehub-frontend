<template>
    <div>
        <ImageEditor
            :image="loadImage(state.imgList[state.imageEditIndex])"
            :imageInfo="state.imagesInfo[state.imageEditIndex]"
            :showAltText="state.showAltEditor[state.imageEditIndex]"
            @closeImageEditor="closeImageEditor"
            v-if="state.showImageEditPanel == true">
        </ImageEditor>
        <div id="imagePanel"
            class="z-[99] absolute top-[2.5rem] min-w-max min-h-max bg-white rounded-[6px] p-3 shadow-md ring-1 ring-gray-200">
            <div class="grid grid-cols-3 grid-rows-1 gap-2">
                <div class="relative" v-for="(item, key) in state.imgList" :key="key" :index="key">
                    <div v-if="state.imagesInfo[key].hidden == 'true'"
                        class="absolute h-full w-full rounded-[8px] bg-white/5 backdrop-blur-xl"></div>
                    <img class="max-w-[5rem] min-w-[5rem] h-[5rem] rounded-[8px] cursor-default object-cover"
                        :src="loadImage(item)" />
                    <div class="absolute w-full h-full rounded-[8px] top-0 left-0 bg-transparent cursor-pointer">
                        <div @click="editImage(key)"
                            class="flex h-full w-full justify-center items-center rounded-[8px] hover:bg-[#00000066] hover:text-white text-transparent">
                            <IconMagic class="text-[16pt]" />
                        </div>
                    </div>

                    <div @click="deleteImg(item, key)"
                        class="absolute w-[1.25rem] h-[1.25rem] top-0 right-0 rounded-tr-[8px] rounded-[4px] bg-[#000000BB] cursor-pointer">
                        <div class="flex w-full h-full justify-center items-center">
                            <IconError class="text-gray-300 text-[10pt]"></IconError>
                        </div>
                    </div>
                </div>
                <div @click="choosePics" v-if="state.imgList.length < 9"
                    class="flex justify-center items-center max-w-[5rem] min-w-[5rem] h-[5rem] hover:bg-zinc-200 rounded-[8px] cursor-pointer active:bg-zinc-300">
                    <IconAdd class="text-gray-500"></IconAdd>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { computed, reactive, watch } from 'vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconError from '@/components/icons/IconError.vue'
import IconMagic from '@/components/icons/IconMagic.vue'
import ImageEditor from '../tailwind/ImageEditor.vue'

const props = defineProps(['imgList', 'imagesInfo'])
const state = reactive({
    imgList: props.imgList || [],
    imagesInfo: props.imagesInfo || [],
    showImageEditPanel: false,
    imageEditIndex:0,
    showAltEditor: [false, false, false, false, false, false, false, false, false]
})

function loadImage(file) {
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(file)
    return imgUrl
}

function deleteImg(item,key) {
    state.imgList.splice(state.imgList.indexOf(item), 1)
    state.imagesInfo[key].hidden = false
    state.imagesInfo[key].altText = ''
}

function editImage(imageIndex) {
    state.showImageEditPanel = true
    state.imageEditIndex = imageIndex
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
}

watch(() => state.showImageEditPanel, (newVal, oldVal) => {
    if (newVal == true) {
        document.querySelector("body").setAttribute("style", "overflow:hidden")
    } else {
        document.querySelector("body").removeAttribute("style")
    }
})

function closeImageEditor(args){
    state.showImageEditPanel = false
    // const index = state.imageEditIndex
    // if (state.showAltEditor[index] == false) { state.imagesInfo[index].altText = '' }
}
</script>