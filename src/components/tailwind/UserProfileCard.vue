<template>
    <div class="relative rounded-[8px] border-[1px] bg-white">
        <div class="w-full h-1/2">
            <img :src="bannerPic" class="w-full h-[10rem] object-cover rounded-t-[8px]"/>
        </div>
        <div class="flex flex-row justify-center items-center w-full -translate-y-1/2">
            <img :src="avatar" class="w-[3.5rem] h-[3.5rem] border-white box-content border-[0.2rem] object-cover rounded-[8px]"/>
        </div>
        <div class="flex flex-col justify-center items-center w-full -translate-y-[1.5rem]">
            <div class="text-[14pt] font-bold">{{ state.user.nickname }}</div>
            <div class="text-[11pt] max-w-[85%] break-all brief">{{ state.user.remark }}</div>
            <div class="flex flex-row w-full mt-[1rem]">
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center"><div class="font-bold">12K</div><div>帖子</div></div>
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center"><div class="font-bold">{{ state.user.followerCount }}</div><div>订阅他的</div></div>
                <div class="w-1/3 flex flex-col gap-1 justify-center items-center"><div class="font-bold">{{ state.user.followingCount }}</div><div>他的订阅</div></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.brief {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
}
</style>

<script setup>
import { reactive,computed } from 'vue'

const props = defineProps(['user'])
const state = reactive({
    user : props.user
})

const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${state.user.nickname}.svg`
    const { previewUrl, originUrl,contentType } = state.user.avatarUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

const bannerPic = computed(() => {
    const defaultUrl = '/src/assets/default-bg.jpg'
    const { previewUrl, originUrl,contentType } = state.user.bannerUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

</script>