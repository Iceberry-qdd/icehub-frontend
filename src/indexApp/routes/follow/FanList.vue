<template>
    <div>
        <FollowItem
            v-for="user in state.fanList"
            :key="user.id"
            :user="user">
        </FollowItem>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewList">
        </Footer>
    </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { getUserInfoByNickname, getFanList } from '@/indexApp/js/api.js'
import FollowItem from '@/indexApp/components/follow/FollowItem.vue'
import Footer from '@/indexApp/components/Footer.vue'

const route = useRoute()
const state = reactive({
    fanList: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    nickname: null,
    isLoading: false
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getFans() {
    state.isLoading = true
    try {
        const response = await getUserInfoByNickname(state.nickname)
        if (!response.ok) throw new Error((await response.json()).message)

        const { id } = await response.json()
        const response2 = await getFanList(id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response2.ok) throw new Error((await response2.json()).error)

        const { content, totalPages } = await response2.json()
        state.fanList.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function fetchNewList() {
    getFans()
}

onMounted(() => {
    const nickname = route.params.nickname
    state.nickname = nickname
    getFans()
})
</script>