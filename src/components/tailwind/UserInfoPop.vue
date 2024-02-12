<template>
    <div class="white-bg w-[22rem] h-[12rem] rounded-[8px] shadow ring-1 ring-slate-900/5 ">
        <Banner :user="state.user" @click="routeToProfile" class="w-full h-[6rem] object-cover rounded-t-[8px]"></Banner>
        <div class="relative -top-[calc(3.5rem/2)] mx-[0.95rem] h-[calc(6rem+3.5rem/2)]">
            <div class="flex flex-row justify-between items-end">
                <Avatar :user="state.user" class="w-[3.5rem] h-[3.5rem] border-[0.2rem] border-white rounded-[8px] text-[16pt]"></Avatar>
                <div class="text-[11pt] flex flex-row gap-x-2">
                    <div @click="routeToFollowerList" class="hover:underline cursor-pointer">{{ followingCountText }}</div>
                    <span>|</span>
                    <div @click="routeToFollowingList" class="hover:underline cursor-pointer">{{ followerCountText }}</div>
                </div>
            </div>
            <div class="flex flex-row gap-x-1 items-center">
                <div @click="routeToProfile" class=" font-bold text-[12pt] hover:underline cursor-pointer">
                    {{ state.user.nickname }}
                    <i class="bi bi-patch-check-fill verify text-[10pt] text-blue-500" v-if="state.user.verified"></i>
                </div>
            </div>
            <div class="flex flex-row flex-nowrap items-center">
                <div class="webkit-box-1 text-[10pt] basis-4/5">{{ brief }}</div>
                <div v-if="!isCurUser" @click="toggleFollowState"
                    :class="followBtnClass"
                    class="basis-1/5 h-auto py-[0.3rem] rounded-full cursor-pointer text-center text-[11pt]">
                    <div v-if="!state.loading"> {{ state.user.following ? '已订阅' : '订阅' }}</div>
                    <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.white-bg {
    background-color: white !important;
}
</style>

<script setup>
import { computed, reactive } from 'vue'
import { followUser, unFollowUser } from '@/api'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/store'
import { useRouter } from 'vue-router'
import Avatar from '@/components/tailwind/Avatar.vue'
import Banner from '@/components/tailwind/Banner.vue'
import { humanizedNumber } from '@/utils/formatUtils'

const props = defineProps(['user'])
const router = useRouter()
const state = reactive({
    user: props.user,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false
})

const isMyself = computed(() => { return state.user.id == state.curUser.id })

const followBtnClass = computed(() => ({
    'bg-blue-500': !state.user.isFollowing,
    'bg-gray-300': state.user.isFollowing,
    'text-white': !state.user.isFollowing,
    'text-zinc-700': state.user.isFollowing
}))

const brief = computed(() => {
    const remark = state.user.remark
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
})

const isCurUser = computed(() => { return state.curUser.id == state.user.id })

const followingCountText = computed(() => {
    const gender = state.user.gender
    const followingCount = humanizedNumber(state.user.followingCount)
    if (isMyself.value == true) return `订阅我的 ${followingCount}`
    if (gender == 'FEMALE') return `订阅她的 ${followingCount}`
    return `订阅他的 ${followingCount}`
})

const followerCountText = computed(() => {
    const gender = state.user.gender
    const followerCount = humanizedNumber(state.user.followerCount)
    if (isMyself.value == true) return `我的订阅 ${followerCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followerCount}`
    return `他的订阅 ${followerCount}`
})

function toggleFollowState() {
    const userId = state.user.id
    if (state.user.following) {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

function routeToProfile() {
    router.push({ name: 'profile', params: { nickname: state.user.nickname } })
}

function routeToFollowingList() {
    router.push({ name: 'followingList', params: { nickname: state.user.nickname } })
}

function routeToFollowerList() {
    router.push({ name: 'followerList', params: { nickname: state.user.nickname } })
}

async function followAUser(userId) {
    state.loading = true
    try {
        const response = await followUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('关注失败！')
        state.user.following = result
    } catch (e) {
        store.setErrorMsg('关注失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser(userId) {
    state.loading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.user.following = !result
    } catch (e) {
        store.setErrorMsg('取消关注失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}
</script>