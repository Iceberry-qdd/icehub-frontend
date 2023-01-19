<template>
    <FollowItem v-for="(user, index) in state.followerList" :key="index" :index="index" :user="user"></FollowItem>
    <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">没有更多了</div>
</template>
    
<style scoped>

</style>
    
<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import { getUserInfoByNickname } from '@/api'
import { getFollowerList } from '@/api'
import FollowItem from '@/components/tailwind/FollowItem.vue'

const $route = useRoute()

const state = reactive({
    followerList: [],
    index: 1,
    size: 10,
    nickname:null
})

async function getFollower(nickname, index, size) {
    try {
        console.log(nickname)
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error(await response.text())

        const { id } = await response.json()
        const response2 = await getFollowerList(id, index, size)
        if (!response2.ok) throw new Error(await response2.text())
        
        const { content } = await response2.json()
        state.followerList.push(...content)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNew() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let clientHeight = document.documentElement.clientHeight
    let scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        state.pageIdx++;
        setTimeout(() => { }, 3000)
        getFollower(state.nickname, state.pageIdx, state.pageSize)
    }
}

onMounted(() => {
    const nickname = $route.params.nickname
    state.nickname = nickname
    getFollower(nickname, state.index, state.size)
    window.addEventListener('scroll', fetchNew)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNew)
})
</script>