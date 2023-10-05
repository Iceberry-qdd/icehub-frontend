<template>
    <div class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div class="w-[25%] h-fit max-h-[95vh] bg-white rounded-[8px] overflow-y-auto">
            <div id="imgWrapper" class="relative flex flex-row justify-center items-center w-full">
                <div v-if="state.imageInfo.hidden == 'true'"
                    class="absolute h-full w-full bg-white/5 backdrop-blur-xl"></div>
                <img :src="state.image" class="max-w-full max-h-[90vh] object-cover" />
                <div class="absolute bottom-0 right-0 flex flex-row gap-2 p-2">
                    <button v-if="state.imageInfo.hidden == 'false'" title="标记为敏感内容">
                        <IconFlagOn @click="toggleHiddenFlag"
                            class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[15pt] rounded-full cursor-pointer">
                        </IconFlagOn>
                    </button>
                    <button v-else title="标记为敏感内容">
                        <IconFlagOff @click="toggleHiddenFlag"
                            class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[15pt] rounded-full cursor-pointer">
                        </IconFlagOff>
                    </button>
                    <button v-if="state.showAltEditor == true" title="添加描述文字">
                        <IconAltOn @click="toggleAltFlag"
                            class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[11pt] rounded-full cursor-pointer">
                        </IconAltOn>
                    </button>
                    <button v-else title="添加描述文字">
                        <IconAltOff @click="toggleAltFlag"
                            class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[11pt] rounded-full cursor-pointer">
                        </IconAltOff>
                    </button>
                </div>
            </div>

            <textarea v-if="state.showAltEditor == true"
                v-model="state.imageInfo.altText" @keydown="resize"
                class="p-3 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                maxlength="512" rows="2" placeholder="简述此图片的内容" id="post-input" name="post"></textarea>
            <div @click="dismissImageEditPanel"
                class="cursor-pointer bg-blue-500 w-fit text-[11pt] mt-3 mb-3 mr-0 ml-3 text-white font-bold px-4 py-1 rounded-full">
                确定
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { reactive } from 'vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import IconAltOff from '@/components/icons/IconAltOff.vue'
import IconFlagOn from '@/components/icons/IconFlagOn.vue'
import IconFlagOff from '@/components/icons/IconFlagOff.vue'

const props = defineProps(['imageInfo','image','showAltText'])
const emits = defineEmits(['closeImageEditor'])

const state = reactive({
    imageInfo: props.imageInfo || [],
    imageEditIndex: 0,
    image:props.image,
    showAltEditor:props.showAltEditor
})

function toggleHiddenFlag() {
    const lastState = state.imageInfo.hidden
    state.imageInfo.hidden = lastState == 'false' ? 'true' : 'false'
}

function toggleAltFlag() {
    const lastState = state.showAltEditor
    state.showAltEditor = !lastState
}

function dismissImageEditPanel(){
    emits('closeImageEditor',{
        showAltEditor:state.showAltEditor,
        imageInfo:state.imageInfo
    })
}
</script>