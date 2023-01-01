<template>
    <div class="m-container w-[22rem] h-[12rem] rounded-[8px] shadow ring-1 ring-slate-900/5 ">
        <div>
            <img :src="bannerPic" class="w-full h-[6rem] object-cover rounded-t-[8px]" />
        </div>
        <div>
            <img :src="avatarPic"
                class="w-[3.5rem] h-[3.5rem] rounded-[8px] ml-3 absolute top-[4.25rem] border-[0.2rem] border-white" />
            <div class="absolute top-[8rem] ml-[0.95rem] flex flex-row gap-x-1 items-center">
                <div class=" font-bold text-[12pt]">{{ props.user.nickname }}</div>
                <i class="bi bi-patch-check-fill verify text-[10pt] text-blue-500" v-if="props.user.verified"></i>
            </div>
            <div class="absolute top-[9.8rem] ml-[0.95rem] text-[11pt]">{{ brief }}</div>
        </div>
        <div class="text-[11pt] flex flex-row gap-x-2 absolute right-3 top-[6.25rem]">
            <div>订阅者{{ props.user.followerCount }}</div>|<div>订阅{{ props.user.followingCount }}</div>
        </div>
        <div>
            <div v-if="!isCurUser"
                class="absolute bottom-3 right-3 bg-blue-500 text-white text-[11pt] px-7 py-[0.3rem] rounded-full">订阅
            </div>
        </div>
    </div>
</template>

<style scoped>
.m-container {
    background-color: white !important;

}
</style>

<script setup>
import { computed } from 'vue'
const props = defineProps(['user'])

const bannerPic = computed(() => {
    const bannerUrl = props.user.bannerUrl
    return bannerUrl || '/src/assets/default-bg.jpg'
})

const avatarPic = computed(() => {
    if (!props.user.avatarUrl) {
        return `https://api.multiavatar.com/${props.user.nickname}.svg`
    } else {
        return props.user.avatarUrl
    }
})

const brief = computed(() => {
    const remark = props.user.remark
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
})

const isCurUser = computed(() => {
    const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
    return curUser.id == props.user.id
})
</script>