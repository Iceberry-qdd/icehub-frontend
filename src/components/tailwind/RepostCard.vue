<template>
    <div @click="routeToUserProfile"
        class="border-[1px] m-bg-white border-gray-300 rounded-[8px] flex flex-col gap-y-1 pt-2 cursor-pointer">
        <div class="flex flex-row items-center px-2 gap-x-2 text-[11pt]">
            <img :src="avatar" class="w-[1.5rem] h-[1.5rem] rounded-[4px]" />
            <div class="font-bold">{{ state.post.user.nickname }}</div>
            <div class="text-gray-400 top-[1px]">发布于 {{ formattedTime }}</div>
        </div>
        <div class="px-2 break-all text-[11pt]">{{ state.post.content }}</div>
        <div class="flex relative flex-col gap-y-1">
            <img loading="lazy" v-if="state.post.attachmentsUrl.length > 0" :src="getCoverImageUrl(state.post.attachmentsUrl[0])"
                class=" rounded-b-[8px] w-full h-[15rem] object-cover" />
            <div v-if="isGifCover"
                class="absolute flex justify-center items-center w-full h-full top-0 right-0  text-white cursor-pointer">
                <IconGif class="w-[2.5rem] h-[2.5rem] rounded-full bg-[#000000BB] gif"></IconGif>
            </div>
        </div>
    </div>
</template>

<style scoped>
.m-bg-white {
    background-color: white !important;
}
</style>

<script setup>
import { computed, reactive } from 'vue'
import { humanizedTime } from '@/utils/formatUtils.js'
import router from '@/route.js'
import IconGif from '@/components/icons/IconGif.vue'

const props = defineProps(['post'])

const state = reactive({
    post: props.post
})

const formattedTime = computed(() => {
    return humanizedTime(state.post.createdTime) || '未知'
})

function routeToUserProfile() {
    router.push({ name: 'postDetail', params: { id: state.post.id } })
}

const avatar = computed(() => {
    const { previewUrl, originUrl } = state.post.user.avatarUrl || [null, null]
    const defaultUrl = `https://api.multiavatar.com/${state.post.user.nickname}.svg`
    return previewUrl || originUrl || defaultUrl
})

function getCoverImageUrl(attachment) {
    return attachment.previewUrl || attachment.originUrl
}

const isGifCover = computed(() => {
    if (!state.post.attachmentsUrl[0]) return false
    else return state.post.attachmentsUrl[0].contentType == 'image/gif'
})
</script>