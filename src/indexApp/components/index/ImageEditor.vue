<template>
    <div class="bg-[#00000066] bottom-0 fixed flex flex-row items-center justify-center left-0 right-0 top-0 z-[111]">
        <div class="bg-white h-fit max-h-[90vh] overflow-y-auto relative rounded-[8px] w-[25%]">
            <div
                id="imgWrapper"
                class="flex flex-row items-center justify-center relative w-full">
                <div
                    v-if="state.imageInfo.hidden == 'true'"
                    class="absolute backdrop-blur-xl bg-white/5 h-full w-full" />
                <img
                    :src="state.image"
                    class="image-picker max-h-[90vh] max-w-full object-cover" />
                <div class="absolute bottom-0 flex flex-row gap-2 p-2 right-0">
                    <button
                        v-if="state.imageInfo.hidden == 'false'"
                        type="button"
                        title="标记为敏感内容">
                        <IconFlagOn
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] p-[0.3rem] rounded-full text-[15pt] text-white w-[1.2rem]"
                            @click="toggleHiddenFlag">
                        </IconFlagOn>
                    </button>
                    <button
                        v-else
                        type="button"
                        title="标记为敏感内容">
                        <IconFlagOff
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] p-[0.3rem] rounded-full text-[15pt] text-white w-[1.2rem]"
                            @click="toggleHiddenFlag">
                        </IconFlagOff>
                    </button>
                    <button
                        v-if="state.showAltEditor == true"
                        type="button"
                        title="添加描述文字">
                        <IconAltOn
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] p-[0.3rem] rounded-full text-[11pt] text-white w-[1.2rem]"
                            @click="toggleAltFlag">
                        </IconAltOn>
                    </button>
                    <button
                        v-else
                        type="button"
                        title="添加描述文字">
                        <IconAltOff
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] p-[0.3rem] rounded-full text-[11pt] text-white w-[1.2rem]"
                            @click="toggleAltFlag">
                        </IconAltOff>
                    </button>
                </div>
            </div>

            <!-- eslint-disable-next-line vue/html-self-closing -->
            <textarea
                v-if="state.showAltEditor == true"
                id="post-input"
                v-model="state.imageInfo.altText"
                class="focus:outline-none leading-6 overflow-y-auto p-3 resize-none rounded text-[14pt] text-justify tracking-wide w-full"
                maxlength="512"
                rows="2"
                placeholder="简述此图片的内容"
                name="post"
                @keydown="resize">
            </textarea>
            <div
                class="bg-blue-500 cursor-pointer font-bold mb-3 ml-3 mr-0 mt-3 px-4 py-1 rounded-full text-[11pt] text-white w-fit"
                @click="dismissImageEditPanel">
                确定
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import IconAltOff from '@/components/icons/IconAltOff.vue'
import IconFlagOn from '@/components/icons/IconFlagOn.vue'
import IconFlagOff from '@/components/icons/IconFlagOff.vue'

const props = defineProps({
    /** 图片元数据信息 */
    imageInfo: {
        type: Object,
        required: true
    },
    /** 图片链接 */
    image: {
        type: String,
        required: true
    },
    /** 是否显示此组件 */
    showAltEditor: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['closeImageEditor'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    imageInfo: props.imageInfo || [],
    imageEditIndex: 0,
    image: props.image,
    showAltEditor: props.showAltEditor
})

function toggleHiddenFlag() {
    const lastState = state.imageInfo.hidden
    state.imageInfo.hidden = lastState == 'false' ? 'true' : 'false'
}

function toggleAltFlag() {
    const lastState = state.showAltEditor
    state.showAltEditor = !lastState
}

function dismissImageEditPanel() {
    emits('closeImageEditor', {
        showAltEditor: state.showAltEditor,
        imageInfo: state.imageInfo
    })
}

function resize(){
    // TODO Not implement
}
</script>