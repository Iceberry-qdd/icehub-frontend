<template>
    <div>
        <FollowItem
            v-for="user in state.followerList"
            :key="user.id"
            :user="user">
        </FollowItem>
        <div
            id="footer"
            class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <IconLoading
                v-if="hasMore || state.isLoading"
                class="h-5 text-slate-500 w-5">
            </IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>
    
<script setup>
import { reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { getUserInfoByNickname, getFollowerList } from '@/indexApp/js/api.js'
import FollowItem from '@/indexApp/components/follow/FollowItem.vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const route = useRoute()
const state = reactive({
    followerList: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    nickname: null,
    lastTimestamp: new Date().getTime(),
    isLoading: false
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getFollower() {
    state.isLoading = true
    try {
        const response = await getUserInfoByNickname(state.nickname)
        if (!response.ok) throw new Error((await response.json()).error)

        const { id } = await response.json()
        const response2 = await getFollowerList(id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response2.ok) throw new Error((await response2.json()).error)

        const { content, totalPages } = await response2.json()
        state.followerList.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally{
        state.isLoading = false
    }
}

function fetchNewList() {
    if (!hasMore.value){
        footerObserver.unobserve(document.querySelector('#footer'))
        return
    }

    getFollower()
}

const options = {root: null, rootMargin: '0px', threshold: 0}

const footerObserver = new IntersectionObserver((entries) => {
    if(entries[0].intersectionRatio > options.threshold && !state.isLoading){
        fetchNewList()
    }
}, options)

onMounted(() => {
    const nickname = route.params.nickname
    state.nickname = nickname
    getFollower()
    footerObserver.observe(document.querySelector('#footer'))
})

onBeforeUnmount(() => {
    footerObserver.unobserve(document.querySelector('#footer'))
})
</script>