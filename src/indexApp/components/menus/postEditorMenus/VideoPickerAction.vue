<template>
    <div class="">
        <div id="video-panel">
            <div
                v-for="(video,index) in props.videoList"
                :key="index">
                <div class="relative w-fit">
                    <!-- eslint-disable-next-line vue/html-self-closing -->
                    <video
                        class="max-h-[50vh] relative rounded-[8px] video"
                        muted
                        autoplay
                        loop
                        :src="getVideoSrc(video)">
                    </video>
                    <span
                        class="absolute bg-white/25 material-symbols-rounded no-hover p-1 right-1 text-white top-1 z-[2]"
                        @click="deleteVideo(index)">
                        close
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive } from 'vue'
import Video from '@/indexApp/components/Video.vue'

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

function getVideoSrc(file){
    return URL.createObjectURL(new Blob([file], {type: file.type}))
}

function deleteVideo(index){
    emits('delete', index)
}
</script>