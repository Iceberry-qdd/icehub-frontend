<template>
    <div class="flex flex-row flex-nowrap justify-center items-start gap-x-3 border-b-[1px] p-2">
        <Avatar :user="state.user" class="flex-initial w-[3rem] h-[3rem] object-cover rounded-[8px] text-[18pt]" @click="routeToUserProfile"></Avatar>
        <div class="flex-auto">
            <div @click="routeToUserProfile" class="font-bold text-[14pt] cursor-pointer hover:underline">
                {{ state.user.nickname }}
                <i v-show="state.user.verified == true" class="bi bi-patch-check-fill verify text-[11pt] text-blue-500"></i>
            </div>
            <div class="text-[10pt] brief">{{ brief(state.user.remark) }}</div>
        </div>
        <div @click="toggleFollowState" :class="buttonClass"
            class="flex-initial place-self-center w-[5rem] px-[1rem] py-[0.4rem] text-white text-[11pt] font-bold rounded-full cursor-pointer">
            <div v-if="!state.loading" class="text-center">{{ state.user.following ? '已订阅' : '订阅' }}</div>
            <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
        </div>
    </div>
</template>

<style scoped>
.brief {
    width: 24.5rem;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

</style>

<script setup>
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import router from '@/route.js'
import Avatar from '@/components/tailwind/Avatar.vue'

const props = defineProps(["user"])

const state = reactive({
    user: props.user,
    loading: false
})

const buttonClass = reactive({
    'bg-blue-500': !state.user.following,
    'bg-gray-300': state.user.following,
    'text-black': state.user.following,
    'text-white': !state.user.following
})

const isSelf = computed(() => {
    const { id } = JSON.parse(localStorage.getItem("CUR_USER"))
    return state.user.id == id
})

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: state.user.nickname } })
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