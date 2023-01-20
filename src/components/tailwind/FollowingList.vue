<template>
    <div>
        <FollowItem v-for="(user, index) in state.followingList" :key="index" :index="index" :user="user"></FollowItem>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="hasMore" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>
    
<style scoped>

</style>
    
<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import { getUserInfoByNickname, getFollowingList } from '@/api.js'
import FollowItem from '@/components/tailwind/FollowItem.vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const $route = useRoute()

const state = reactive({
    followingList: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    nickname: null
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getFollowing(nickname, pageIndex, pageSize) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        const response2 = await getFollowingList(id, pageIndex, pageSize)
        if (!response2.ok) throw new Error((await response2.json()).error)

        const { content, totalPages } = await response2.json()
        state.followingList.push(...content)
        state.totalPages = totalPages
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNewList() {
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            state.pageIndex++
            getFollowing(state.nickname, state.pageIndex, state.pageSize)
        }, 1000)
    }
}

onMounted(() => {
    const nickname = $route.params.nickname
    state.nickname = nickname
    getFollowing(nickname, state.pageIndex, state.pageSize)
    window.addEventListener('scroll', fetchNewList)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewList)
})
</script>