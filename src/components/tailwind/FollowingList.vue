<template>
    <div>
        <FollowItem v-for="(user, index) in state.followingList" :key="index" :index="index" :user="user"></FollowItem>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">没有更多了</div>
    </div>
</template>
    
<style scoped>

</style>
    
<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../../store'
import { getUserInfoByNickname } from '../../api'
import { getFollowingList } from '../../api'
import FollowItem from '../tailwind/FollowItem.vue'

const $route = useRoute()

const state = reactive({
    followingList: [],
    index: 1,
    size: 10,
    nickname:null
})

async function getFollowing(nickname, index, size) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error(await response.text())

        const { id } = await response.json()
        const response2 = await getFollowingList(id, index, size)
        if (!response2.ok) throw new Error(await response2.text())
        const { content } = await response2.json()
        //console.log(content)
        state.followingList.push(...content)
    } catch (e) {
        store.setMsg(e.message)
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
        getFollowing(state.nickname, state.pageIdx, state.pageSize)
    }
}

onMounted(() => {
    const nickname = $route.params.nickname
    state.nickname = nickname
    getFollowing(nickname,state.index,state.size)
    window.addEventListener('scroll', fetchNew)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNew)
})
</script>