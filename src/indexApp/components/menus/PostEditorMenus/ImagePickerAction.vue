<template>
    <div class="bg-white min-h-max w-[calc(5rem*3+1rem)] z-[99]">
        <Teleport to="#app">
            <ImageEditor
                v-if="state.showImageEditPanel == true"
                id="imageEditPanel"
                class="fixed top-0"
                :image="loadImage(state.imgList[state.imageEditIndex])"
                :image-info="state.imagesInfo[state.imageEditIndex]"
                :show-alt-editor="state.showAltEditor[state.imageEditIndex]"
                @close-image-editor="closeImageEditor"
                @toggle-hidden="toggleHidden">
            </ImageEditor>
        </Teleport>
        <div id="image-panel">
            <div class="gap-2 grid grid-cols-3 grid-rows-1">
                <div
                    v-for="(item, key) in state.imgList"
                    :key="key"
                    class="relative">
                    <div
                        v-if="state.imagesInfo[key].hidden"
                        class="absolute backdrop-blur-xl bg-white/5 h-full rounded-[8px] w-full" />
                    <img
                        class="cursor-default h-[5rem] image-picker object-cover rounded-[8px] w-[5rem]"
                        :src="loadImage(item)" />
                    <div class="absolute bg-transparent cursor-pointer h-full left-0 rounded-[8px] top-0 w-[5rem]">
                        <div
                            class="flex h-full hover:bg-[#00000066] hover:text-white items-center justify-center rounded-[8px] text-transparent w-full"
                            @click="editImage(key)">
                            <IconMagic class="text-[16pt]"></IconMagic>
                        </div>
                    </div>

                    <div
                        class="absolute bg-[#000000BB] cursor-pointer h-[1.25rem] right-0 rounded-[4px] rounded-tr-[8px] top-0 w-[1.25rem]"
                        @click="deleteImg(item, key)">
                        <div class="flex h-full items-center justify-center w-full">
                            <IconError class="text-[10pt] text-gray-300"></IconError>
                        </div>
                    </div>
                </div>
                <div
                    v-if="state.imgList.length < 9"
                    class="active:bg-zinc-300 cursor-pointer flex h-[5rem] hover:bg-zinc-200 items-center justify-center max-w-[5rem] min-w-[5rem] rounded-[8px]"
                    @click="choosePics">
                    <IconAdd class="text-gray-500"></IconAdd>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconError from '@/components/icons/IconError.vue'
import IconMagic from '@/components/icons/IconMagic.vue'
import ImageEditor from '@/indexApp/components/index/ImageEditor.vue'

const props = defineProps({
    /** 传入的图片列表 */
    imgList: {
        type: Array,
        required: true
    },
    /** 图片信息列表 */
    imagesInfo: {
        type: Array,
        required: true
    },
    /** 传入的文件选择器 */
    selector: {
        type:Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    imgList: props.imgList || [],
    imagesInfo: props.imagesInfo || [],
    showImageEditPanel: false,
    imageEditIndex: 0,
    showAltEditor: [false, false, false, false, false, false, false, false, false]
})

function loadImage(file) {
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(file)
    return imgUrl
}

function deleteImg(item, key) {
    state.imgList.splice(state.imgList.indexOf(item), 1)
    state.imagesInfo[key].hidden = false
    state.imagesInfo[key].altText = ''
}

function editImage(imageIndex) {
    state.showImageEditPanel = true
    state.imageEditIndex = imageIndex
}

function choosePics() {
    props.selector.click()
}

function closeImageEditor(args) {
    state.showImageEditPanel = false
}

function toggleHidden({hidden}){
    state.imagesInfo[state.imageEditIndex].hidden = hidden
}
</script>