<template>
    <div v-if="state.user">
        <Header v-if="state.user" :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <ProfileInfo :user="state.user"></ProfileInfo>
        <PostCard v-for="(post, index) in state.posts" :post="post" :key="post.id" :index="index"></PostCard>
        <div id="footer" class="w-full flex flex-row justify-center pt-4 pb-4 text-sm text-gray-500">没有更多了</div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import Header from '../tailwind/Header.vue'
import ProfileInfo from '../tailwind/ProfileInfo.vue'
import PostCard from '../bootstrap/PostCard.vue'
import { reactive, onMounted, onUnmounted, computed } from 'vue';
import { getUserPosts, getUserInfoByNickname } from '../../api';
import { store } from '../../store';
import { useRoute } from 'vue-router';

const $route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return $route.params.nickname == user.nickname
})

const state = reactive({
    user: null,
    posts: [],
    pageIndex: 1,
    pageSize: 10,
    headerConfig: {
        title: $route.params.nickname,
        goBack: !isCurUser.value,
        showMenu: isCurUser.value,
        menuIcon: isCurUser.value ? 'create' : '',
        menuAction: { action: 'route', param: '/profile/edit' }
    }
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

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error(await response.text())

        const user = await response.json()
        state.user = user
    } catch (e) {
        store.setMsg(e)
        console.error(e)
    }
}

onMounted(async () => {
    const nickname = $route.params.nickname

    await getUser(nickname)
    await getPosts()
})

onUnmounted(() => {
    store.clearSelectUser()
})
</script>