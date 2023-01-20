<template>
    <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
        :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
        :menuAction="state.headerConfig.menuAction"></Header>
    <GlobalRefresh></GlobalRefresh>
    <PostEditor @get-data="getData"></PostEditor>
    <PostsTimeline :posts="state.posts" :curPageIndex="state.pageIdx" :totalPages="state.totalPages"></PostsTimeline>
</template>

<style scoped>

</style>

<script setup>
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import Header from '@/components/tailwind/Header.vue'
import { getUserTimeline } from '@/api.js'
import { store } from '@/store.js'
import PostEditor from '@/components/tailwind/PostEditor.vue'
import { onMounted, onUnmounted, reactive } from 'vue'
import GlobalRefresh from '@/components/tailwind/GlobalRefresh.vue'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    totalPages: 0,
    headerConfig: {
        title: '主页',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    }
})

async function getData(pageIdx, pageSize) {
    try {
        const response = await getUserTimeline(pageIdx, pageSize)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
        state.totalPages = totalPages
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNewPost() {
    if (state.pageIdx >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            state.pageIdx++
            getData(state.pageIdx, state.pageSize)
        }, 1000)
    }
}

onMounted(() => {
    getData(state.pageIdx, state.pageSize)
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
})
</script>