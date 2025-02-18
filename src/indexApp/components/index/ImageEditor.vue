<template>
    <div class="bg-[#00000066] fixed-page flex flex-row h-screen items-center justify-center max-sm:bg-black max-sm:flex-col max-sm:z-[1001] text-white w-screen z-[111]">
        <Header
            class="backdrop-blur-none fixed sm:hidden w-full"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            icon-color="white"
            no-border
            @handle-action="submit">
            <div class="flex font-bold gap-x-2 items-center justify-start w-full">
                <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                <div class="close-btn material-symbols-rounded text-[1.125rem] text-inherit" @click="dismiss">arrow_back_ios_new</div>
                <div>返回</div>
            </div>
        </Header>
        <div class="bg-white h-fit max-h-[90dvh] max-sm:bg-black max-sm:rounded-none modern-scrollbar-y overflow-y-auto relative rounded-[8px] sm:dark:bg-[#1e1e1e] sm:w-[min(25rem,100dvw)]">
            <div
                id="imgWrapper"
                class="flex flex-row items-center justify-center relative w-full">
                <div
                    v-if="state.imageInfo.hidden === true"
                    class="absolute backdrop-blur-xl bg-white/5 h-full w-full" />
                <img
                    :src="state.image.blob"
                    class="image-picker max-h-[90dvh] max-w-full object-cover" />
                <div class="absolute bottom-0 flex flex-row gap-x-2 max-sm:bg-zinc-900/75 max-sm:fixed max-sm:gap-x-0 max-sm:left-0 max-sm:p-0 max-sm:w-full p-2 sm:right-0">
                    <button
                        type="button"
                        title="裁剪"
                        @click="state.cropper.show = true">
                        <div
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] material-symbols-rounded max-sm:bg-transparent no-hover p-[0.3rem] rounded-full text-[1rem] text-white w-[1.2rem]">
                            crop
                        </div>
                        <Teleport to="#app">
                            <ImageCropper
                                v-if="state.cropper.show === true"
                                class="fixed h-full max-sm:z-[1001] top-0 w-full z-[111]"
                                :mode="state.cropper.mode"
                                :origin-img-file="state.image.file"
                                @image-file="handleCrop"
                                @dismiss="state.cropper.show = false">
                            </ImageCropper>
                        </Teleport>
                        <div class="sm:hidden text-[0.75rem]">裁剪</div>
                    </button>
                    <button
                        v-if="state.imageInfo.hidden == false"
                        type="button"
                        title="标记为敏感内容"
                        @click="toggleHiddenFlag">
                        <IconFlagOn
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] max-sm:bg-transparent p-[0.3rem] rounded-full text-[1rem] text-white w-[1.2rem]">
                        </IconFlagOn>
                        <div class="sm:hidden text-[0.75rem]">隐藏</div>
                    </button>
                    <button
                        v-else
                        type="button"
                        title="标记为敏感内容"
                        @click="toggleHiddenFlag">
                        <IconFlagOff
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] max-sm:bg-transparent p-[0.3rem] rounded-full text-[1rem] text-white w-[1.2rem]">
                        </IconFlagOff>
                        <div class="sm:hidden text-[0.75rem]">隐藏</div>
                    </button>
                    <button
                        v-if="state.showAltEditor == true"
                        type="button"
                        title="添加描述文字"
                        @click="toggleAltFlag">
                        <IconAltOn
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] max-sm:bg-transparent p-[0.3rem] rounded-full text-[11pt] text-white w-[1.2rem]">
                        </IconAltOn>
                        <div class="sm:hidden text-[0.75rem]">注释</div>
                    </button>
                    <button
                        v-else
                        type="button"
                        title="添加描述文字"
                        @click="toggleAltFlag">
                        <IconAltOff
                            class="bg-[#000000BB] box-content cursor-pointer h-[1.2rem] max-sm:bg-transparent p-[0.3rem] rounded-full text-[11pt] text-white w-[1.2rem]">
                        </IconAltOff>
                        <div class="sm:hidden text-[0.75rem]">注释</div>
                    </button>
                </div>
            </div>

            <!-- eslint-disable-next-line vue/html-self-closing -->
            <textarea
                v-if="state.showAltEditor == true"
                id="post-input"
                v-model="state.imageInfo.altText"
                class="break-all focus:outline-none leading-6 max-sm:bg-black/75 max-sm:bottom-[calc(1rem+1.2rem+1.2rem)] max-sm:fixed max-sm:h-fit max-sm:rounded-none overflow-y-auto p-3 resize-none rounded sm:bg-inherit sm:dark:text-inherit sm:text-[initial] text-[1rem] text-justify tracking-wide w-full"
                maxlength="100"
                rows="2"
                placeholder="简述此图片的内容"
                name="post"
                @keydown="resize">
            </textarea>
            <div
                class="active:bg-primary-inActive bg-primary cursor-pointer font-bold max-sm:hidden ml-[20rem] mr-2 my-2 py-2 rounded-full text-[11pt] text-center text-onPrimary tracking-widest"
                @click="submit">
                确定
            </div>
        </div>
    </div>
</template>

<style scoped>
@media not all and (min-width: 640px) {
    button {
        padding: 0.25rem 0;
        width: 3rem;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: center;
        align-items: center;
    }

    button:active {
        background-color: rgba(255, 255, 255, 0.25);
    }
}

#h {
    background-color: #000000dd;
}
</style>

<script setup>
import { defineAsyncComponent, reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import IconAltOff from '@/components/icons/IconAltOff.vue'
import IconFlagOn from '@/components/icons/IconFlagOn.vue'
import IconFlagOff from '@/components/icons/IconFlagOff.vue'
const ImageCropper = defineAsyncComponent(() => import('@/indexApp/components/profile/ImageCropper.vue'))

const props = defineProps({
    /** 图片元数据信息 */
    imageInfo: {
        type: Object,
        required: true
    },
    /** 图片，包含blob和file两个字段 */
    image: {
        type: Object,
        required: true
    },
    /** 是否显示此组件 */
    showAltEditor: {
        type: Boolean,
        required: true
    }
})
const emits = defineEmits(['closeImageEditor', 'submit'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交'
    },
    imageInfo: {
        hidden: props.imageInfo.hidden,
        altText: props.imageInfo.altText,
        contentType: props.imageInfo.contentType
    },
    imageEditIndex: 0,
    image: props.image,
    showAltEditor: props.showAltEditor,
    cropper: {
        show: false,
        mode: 'rectangle'
    }
})

function handleCrop({ file }) {
    state.image.file = file
    state.image.blob = loadImage(file)
}

function toggleHiddenFlag() {
    const lastState = state.imageInfo.hidden
    state.imageInfo.hidden = !lastState
}

function toggleAltFlag() {
    const lastState = state.showAltEditor
    state.showAltEditor = !lastState
}

function dismiss() {
    emits('closeImageEditor')
}

function submit() {
    emits('submit', {
        showAltEditor: state.showAltEditor,
        imageInfo: state.imageInfo,
        image: state.image
    })
}

function resize() {
    // Do nothing
}

function loadImage(file) {
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(file)
    return imgUrl
}
</script>