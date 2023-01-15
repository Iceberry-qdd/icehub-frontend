<template>
    <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
        :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
        :menuAction="state.headerConfig.menuAction"></Header>
    <PostsTimeline :posts="state.posts"></PostsTimeline>
</template>

<style scoped>

</style>

<script setup>
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import Header from '@/components/tailwind/Header.vue'
import { getTimeline } from '@/api.js'
import { store } from '@/store.js'
import { onMounted, onUnmounted, reactive } from 'vue'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    headerConfig: {
        title: '探索',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    }
})

async function getData(pageIdx, pageSize) {
    try {
        const response = await getTimeline(pageIdx, pageSize)
        if (!response.ok) throw new Error(await response.text())

        const { content } = await response.json()
        state.posts.push(...content)
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

function fetchNewPost() {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let clientHeight = document.documentElement.clientHeight
    let scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        state.pageIdx++;
        setTimeout(() => { }, 3000)
        getData(state.pageIdx, state.pageSize)
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