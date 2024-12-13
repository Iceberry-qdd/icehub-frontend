<template>
    <div>
        <div id="video-panel">
            <div
                v-for="(video,index) in props.videoList"
                :key="index">
                <div class="relative w-fit">
                    <!-- eslint-disable-next-line vue/html-self-closing -->
                    <video
                        class="relative rounded-[8px] video"
                        :class="{'aspect-square object-cover': isVerticalVideo}"
                        muted
                        autoplay
                        loop
                        :src="getVideoSrc(video)"
                        @loadedmetadata="handleVideoLoaded">
                    </video>
                    <span
                        class="absolute bg-white/25 material-symbols-rounded no-hover p-1 right-1 text-white top-1 z-[2]"
                        @click="deleteVideo(index)">
                        close
                    </span>
                </div>
            </div>
        </div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="resetDialog">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { computed, reactive, watch, defineAsyncComponent } from 'vue'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

/** 最长支持处理(后台处理)300s的视频，超过则默认截取前300s视频 */
const MAX_DURATION_LIMIT = 300 

const emits = defineEmits(['delete'])
const props = defineProps({
    /** 用于定位菜单使用的imgFile */
    // eslint-disable-next-line vue/no-unused-properties
    editorMenuId: {
        type: String,
        required: true
    },
    /** 传入的视频列表 */
    videoList: {
        type: Array,
        required: true
    }
})

const state = reactive({
    video: {
        width: 0,
        height: 0,
        duration: 0
    },
    confirmBDialogUi: {
        show: false,
        title: '',
        confirmButton: {
            selected: false,
            color: 'text-onError',
            bgColor: 'bg-error',
            text: '我已了解'
        },
        cancelButton: {
            show: false,
            selected: false
        },
        loading: {
            show: false,
            text: ''
        }
    },
})

const isVerticalVideo = computed(() => {
    return state.video.width < state.video.height
})

watch(() => state.video.duration, (newVal, _) => {
    if(newVal > MAX_DURATION_LIMIT){
        state.confirmBDialogUi.title = '仅支持处理时长不超过300秒的视频，超过则默认截取前300s的内容。'
        state.confirmBDialogUi.show = true
    }
})

function getVideoSrc(file){
    return URL.createObjectURL(new Blob([file], {type: file.type}))
}

function deleteVideo(index){
    emits('delete', index)
}

function handleVideoLoaded(e){
    const {duration, videoWidth, videoHeight} = e.target
    state.video.duration = duration
    state.video.width = videoWidth
    state.video.height = videoHeight
}

function resetDialog(){
    state.confirmBDialogUi.title = ''
    state.confirmBDialogUi.show = false
}
</script>