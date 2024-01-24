<template>
    <div class="position-relative" id="explore">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :iconTooltip="state.headerConfig.iconTooltip"
            @handleAction="handleAction">
        </Header>
        <PostsTimeline
            :isLoading="state.isLoading"
            :posts="state.posts"
            :curPageIndex="state.pageIdx"
            :totalPages="state.totalPages">
        </PostsTimeline>
    </div>

</template>

<style scoped>
.position-relative {
    position: relative;
}
</style>

<script setup>
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import Header from '@/components/tailwind/Header.vue'
import { getTimeline } from '@/api.js'
import { store } from '@/store.js'
import { onMounted, onUnmounted, reactive, provide } from 'vue'
import router from '@/route'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    headerConfig: {
        title: '探索',
        goBack: false,
        showMenu: true,
        menuIcon: 'search',
        iconTooltip: '搜索'
    },
    isLoading: false
})

async function getData() {
    state.isLoading = true
    try {
        const response = await getTimeline(state.pageIdx, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.isLoading = false
    }
}

function fetchNewPost() {
    if (state.pageIdx >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            getData()
        }, 1000)
    }
}

function handleAction() {
    router.push({ name: 'search' })
}

function postingNew(post) {
    state.posts.unshift(post)
}

onMounted(() => {
    getData()
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
})

provide('postingNew', { postingNew })
</script>