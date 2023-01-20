<template>
    <div class="border-[1px] border-gray-300 rounded-[8px] flex flex-col gap-y-1 pt-2">
        <div class="flex flex-row items-center px-2 gap-x-2 text-[11pt]">
            <img :src="avatar" class="w-[1.5rem] h-[1.5rem] rounded-[4px]" />
            <span class="font-bold">{{ state.post.user.nickname }}</span>
            <span class="text-gray-400">发布于 {{ formattedTime }}</span>
        </div>
        <div class="px-2 break-all">{{ state.post.content }}</div>
        <div class="flex flex-col gap-y-1">
            <img v-if="state.post.attachmentsUrl.length > 0" :src="state.post.attachmentsUrl[0]" class=" rounded-b-[8px] w-full h-[15rem] object-cover" />
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import { humanizedTime } from '@/utils/formatUtils.js'

const props = defineProps(['post'])

const state = reactive({
    post: props.post
})

const formattedTime = computed(() => {
    return humanizedTime(state.post.createdTime) || '未知'
})

const avatar = computed(() => {
    if (state.post.user.avatarUrl == null) {
        return `https://api.multiavatar.com/${state.post.user.nickname}.svg`
    } else {
        return state.post.user.avatarUrl
    }
})
</script>