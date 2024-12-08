<template>
    <div class="min-h-max w-[calc(5rem*3+1rem)] z-[99]">
        <Teleport to="#app">
            <ImageEditor
                v-if="state.showImageEditPanel == true"
                id="imageEditPanel"
                class="fixed top-0"
                :image="loadImage(props.imgList[state.imageEditIndex])"
                :image-info="props.imagesInfo[state.imageEditIndex]"
                :show-alt-editor="!!props.imagesInfo[state.imageEditIndex].altText"
                @close-image-editor="closeImageEditor"
                @submit="submit">
            </ImageEditor>
        </Teleport>
        <div id="image-panel">
            <div class="gap-2 grid grid-cols-3 grid-rows-1">
                <div
                    v-for="(item, key) in props.imgList"
                    :key="key"
                    class="relative">
                    <div
                        v-if="props.imagesInfo[key].hidden"
                        class="absolute backdrop-blur-xl bg-white/5 h-full rounded-[8px] w-full" />
                    <img
                        class="cursor-default h-[5rem] image-picker object-cover rounded-[8px] w-[5rem]"
                        :src="loadImage(item).blob" />
                    <div class="absolute bg-transparent cursor-pointer h-full left-0 rounded-[8px] top-0 w-[5rem]">
                        <div
                            class="flex h-full hover:bg-[#00000055] hover:text-white items-center justify-center rounded-[8px] text-transparent w-full"
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
                    v-if="props.imgList.length < 9"
                    class="active:bg-zinc-300 cursor-pointer dark:active:bg-neutral-700 dark:hover:bg-[#1e1e1e] flex h-[5rem] hover:bg-zinc-200 items-center justify-center max-w-[5rem] min-w-[5rem] rounded-[8px]"
                    @click="choosePics">
                    <IconAdd class="dark:text-white/25 text-gray-500"></IconAdd>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive } from 'vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconError from '@/components/icons/IconError.vue'
import IconMagic from '@/components/icons/IconMagic.vue'
import ImageEditor from '@/indexApp/components/index/ImageEditor.vue'

const emits = defineEmits(['delete', 'update'])
const props = defineProps({
    /** 用于定位菜单使用的imgFile */
    editorMenuId: {
        type: String,
        required: true
    },
    /** 传入的图片列表 */
    imgList: {
        type: Array,
        required: true
    },
    /** 图片信息列表 */
    imagesInfo: {
        type: Array,
        required: true
    }
})

const state = reactive({
    imgList: props.imgList || [],
    imagesInfo: props.imagesInfo || [],
    showImageEditPanel: false,
    imageEditIndex: 0,
    showAltEditor: [false, false, false, false, false, false, false, false, false],
    fileSelector: document.querySelector(`#${props.editorMenuId} Input[id="imgFile"]`)
})

function loadImage(file) {
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(file)
    return {blob: imgUrl, file: file}
}

function deleteImg(item, key) {
    emits('delete', key)
    state.imageEditIndex = 0
}

function editImage(imageIndex) {
    state.showImageEditPanel = true
    state.imageEditIndex = imageIndex
}

function choosePics() {
    state.fileSelector.showPicker()
}

function submit({ image, imageInfo }) {
    emits('update', {
        image: image,
        imageInfo: imageInfo,
        index: state.imageEditIndex
    })
    state.imageEditIndex = 0
    closeImageEditor()
}

function closeImageEditor(){
    state.showImageEditPanel = false
}
</script>