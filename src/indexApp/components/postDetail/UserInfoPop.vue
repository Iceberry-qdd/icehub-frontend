<template>
    <div class="bg-white h-[12rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg w-[22rem]">
        <Banner
            :user="state.user"
            class="h-[6rem] object-cover rounded-t-[8px] w-full"
            @click="routeToProfile">
        </Banner>
        <div class="-top-[calc(3.5rem/2)] h-[calc(6rem+3.5rem/2)] mx-[0.95rem] relative">
            <div class="flex flex-row items-end justify-between">
                <Avatar
                    :user="state.user"
                    class="border-[0.2rem] border-white h-[3.5rem] rounded-[8px] text-[3.5rem] w-[3.5rem]">
                </Avatar>
                <div class="flex flex-row gap-x-2 text-[11pt]">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="cursor-pointer hover:underline" @click="routeToFollowerList">{{ followingCountText }}</div>
                    <span>|</span>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="cursor-pointer hover:underline" @click="routeToFollowingList">{{ followerCountText }}</div>
                </div>
            </div>
            <div class="flex flex-row gap-x-1 items-center">
                <div
                    class="cursor-pointer font-bold hover:underline text-[12pt]"
                    @click="routeToProfile">
                    {{ state.user.nickname }}
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconVerify v-if="state.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
            </div>
            <div class="flex flex-nowrap flex-row items-center">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="basis-3/4 text-[10pt] webkit-box-1">{{ brief }}</div>
                <div
                    v-if="!isCurUser"
                    :class="followBtnClass"
                    class="basis-1/4 cursor-pointer h-auto py-[0.3rem] rounded-full text-[11pt] text-center"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.loading"> {{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const router = useRouter()
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false
})

const isMyself = computed(() => { return state.user.id == state.curUser.id })

const followBtnClass = computed(() => ({
    'bg-blue-500': !state.user.following,
    'bg-gray-300': state.user.following,
    'text-white': !state.user.following,
    'text-zinc-700': state.user.following
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

const followButtonText = computed(() => {
    if(state.user.following && state.user.follower) return '相互订阅'
    return state.user.following ? '已订阅' : '订阅'
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