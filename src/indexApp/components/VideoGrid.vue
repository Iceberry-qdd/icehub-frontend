<template>
    <div>
        <div
            v-for="video in props.videos"
            :key="video.id">
            <Video
                v-if="video.status === 'OK'"
                class="z-[97]"
                :video="video"
                :show-controls="props.showControls">
            </Video>
            <SnowScreen
                v-else
                class="aspect-video w-full"
                :text="store.getVideoErrorMsg(video.status)">
            </SnowScreen>
        </div>
    </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
const Video = defineAsyncComponent(() => import('@/indexApp/components/Video.vue'))
const SnowScreen = defineAsyncComponent(() => import('@/indexApp/components/SnowScreen.vue'))

const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL
const props = defineProps({
    /** 要展示的视频列表 */
    videos: {
        type: Array,
        required: true
    },
    /** 是否显示视频控制选项 */
    showControls: {
        type: Boolean,
        required: false,
        default: false
    }
})
</script>