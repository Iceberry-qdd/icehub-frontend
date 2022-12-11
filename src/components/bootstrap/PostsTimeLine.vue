<template>
    <div>
        <!-- <Header></Header> -->
        <PostEditor @get-data="getData"></PostEditor>
        <PostCard v-for="(post, index) in state.posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div id="footer" class="w-full flex flex-row justify-center pt-4 text-sm text-gray-500">没有更多了</div>
    </div>

</template>

<style scoped>
#footer{
    height: 10vh;
}
</style>

<script setup>
import PostCard from './PostCard.vue'
import { getTimeline } from '../../api.js'
import { store } from '../../store.js'
import PostEditor from '../tailwind/PostEditor.vue'
import { onMounted, onUnmounted, reactive } from 'vue'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10
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
        // console.log("已触底")
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