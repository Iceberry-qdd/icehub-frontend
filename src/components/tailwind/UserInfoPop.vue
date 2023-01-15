<template>
    <div class="m-container w-[22rem] h-[12rem] rounded-[8px] shadow ring-1 ring-slate-900/5 ">
        <div>
            <img :src="bannerPic" class="w-full h-[6rem] object-cover rounded-t-[8px]" />
        </div>
        <div>
            <img :src="avatarPic"
                class="w-[3.5rem] h-[3.5rem] rounded-[8px] ml-3 absolute top-[4.25rem] border-[0.2rem] border-white" />
            <div class="absolute top-[8rem] ml-[0.95rem] flex flex-row gap-x-1 items-center">
                <div class=" font-bold text-[12pt]">{{ state.user.nickname }}</div>
                <i class="bi bi-patch-check-fill verify text-[10pt] text-blue-500" v-if="state.user.verified"></i>
            </div>
            <div class="absolute top-[9.8rem] ml-[0.95rem] text-[11pt]">{{ brief }}</div>
        </div>
        <div class="text-[11pt] flex flex-row gap-x-2 absolute right-3 top-[6.25rem]">
            <div>订阅者{{ state.user.followingCount }}</div>|<div>订阅{{ state.user.followerCount }}</div>
        </div>
        <div>
            <div v-if="!isCurUser" @click="toggleFollowState"
                :class="{ 'bg-gray-300': state.user.following, 'bg-blue-500': !state.user.following, 'text-black': state.user.following, 'text-white': !state.user.following }"
                class="absolute bottom-3 right-3  text-[11pt] px-5 py-[0.3rem] rounded-full">
                <div v-if="!state.loading"> {{ state.user.following ? '已订阅' : '订阅' }}</div>
                <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
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
import { computed, reactive } from 'vue'
import { followUser, unFollowUser } from '@/api'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/store'

const props = defineProps(['user'])

const state = reactive({
    user: props.user,
    loading: false
})

const bannerPic = computed(() => {
    const bannerUrl = state.user.bannerUrl
    return bannerUrl || '/src/assets/default-bg.jpg'
})

const avatarPic = computed(() => {
    if (!state.user.avatarUrl) {
        return `https://api.multiavatar.com/${state.user.nickname}.svg`
    } else {
        return state.user.avatarUrl
    }
})

const brief = computed(() => {
    const remark = state.user.remark
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
})

const isCurUser = computed(() => {
    const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
    return curUser.id == state.user.id
})

function toggleFollowState() {
    const userId = state.user.id
    if (state.user.following) {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

async function followAUser(userId) {
    state.loading = true
    try {
        const response = await followUser(userId)
        if (!response.ok) throw new Error(await response.text())

        const result = await response.json()
        if (result == false) throw new Error('关注失败！')
        state.user.following = result
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser(userId) {
    state.loading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error(await response.text())

        const result = await response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.user.following = !result
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}
</script>