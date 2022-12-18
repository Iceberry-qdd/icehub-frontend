<template>
    <div v-if="state.user != null">
        <ProfileInfo :user="state.user"></ProfileInfo>
        <PostCard v-for="(post, index) in state.posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div id="footer" class="w-full flex flex-row justify-center pt-4 pb-4 text-sm text-gray-500">没有更多了</div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import ProfileInfo from '../tailwind/ProfileInfo.vue'
import PostCard from '../bootstrap/PostCard.vue'
import { reactive, onMounted } from 'vue';
import { getUserPosts } from '../../api';
import { store } from '../../store';

const state = reactive({
    user: null,
    posts: [],
    pageIndex: 1,
    pageSize: 10
})

async function getPosts() {
    try {
        const response = await getUserPosts(state.user.id, state.pageIndex, state.pageSize)
        if (!response.ok) throw new Error(await response.text())

        const { content } = await response.json()
        state.posts.push(...content)
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

onMounted(() => {
    state.user = JSON.parse(localStorage.getItem("CUR_USER"))
    getPosts()
})
</script>