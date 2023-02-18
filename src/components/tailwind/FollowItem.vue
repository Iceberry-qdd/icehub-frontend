<template>
    <div class="flex flex-row justify-between items-center h-[6rem] border-b-[1px] px-2 py-2 ">
        <div class="flex flex-row items-center basis-5/6 gap-x-4">
            <div @click="routeToUserProfile">
                <img :src="avatarUrl(state.user.avatarUrl, state.user.nickname)"
                    class="w-[72px] h-[72px] rounded-[8px]" />
            </div>
            <div class="h-full w-full">
                <div @click="routeToUserProfile" class="font-bold text-[14pt] cursor-pointer hover:underline">
                    {{ state.user.nickname }}
                    <i v-show="state.user.verified == true" class="bi bi-patch-check-fill verify text-[11pt] text-blue-500"></i>
                </div>
                <div class="text-[11pt] brief">{{ brief(state.user.remark) }}</div>
            </div>
        </div>
        <div v-if="!isSelf" class="basis-1/6 h-full flex flex-row justify-center items-center">
            <div @click="toggleFollowState" :class="{
                'bg-blue-500': !state.user.following,
                'bg-gray-300': state.user.following,
                'text-black': state.user.following,
                'text-white': !state.user.following
            }" class=" px-[1rem] py-[0.4rem] text-white text-[11pt] font-bold rounded-full cursor-pointer">
                <div v-if="!state.loading">{{ state.user.following ? '已订阅' : '订阅' }}</div>
                <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
            </div>
        </div>
    </div>
</template>

<style scoped>
.brief {
    width: 24.5rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

img {
    max-width: 64px;
    max-height: 64px;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import router from '@/route.js'

const props = defineProps(["user"])

const state = reactive({
    user: props.user,
    loading: false
})

const isSelf = computed(() => {
    const { id } = JSON.parse(localStorage.getItem("CUR_USER"))
    return state.user.id == id
})

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: state.user.nickname } })
}

function avatarUrl(avatarUrl, nickname) {
    const {previewUrl,originUrl} = avatarUrl || [null,null]
    const defaultUrl = `https://api.multiavatar.com/${nickname}.svg`
    return previewUrl||originUrl||defaultUrl
}

function brief(remark) {
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
}

function toggleFollowState() {
    const { following } = state.user
    if (following) {
        unFollowAUser()
    } else {
        followAUser()
    }
}

async function followAUser() {
    const { id } = state.user
    state.loading = true
    try {
        const response = await followUser(id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('关注失败！')
        state.user.following = result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser() {
    const { id } = state.user
    state.loading = true
    try {
        const response = await unFollowUser(id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.user.following = !result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}
</script>