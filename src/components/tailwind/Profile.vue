<template>
    <div v-if="state.mounted">
        <Header v-if="state.mounted" :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
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
import { reactive, onMounted, onUnmounted } from 'vue';
import { getUserPosts, getUserInfoByNickname } from '../../api';
import { store } from '../../store';

const state = reactive({
    user: null,
    isCurUser: false,
    posts: [],
    mounted: false,
    pageIndex: 1,
    pageSize: 10,
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
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
        state.headerConfig.title = user.nickname || ''
        state.user = user
        //store.setSelectUser(user)
    } catch (e) {
        store.setMsg(e)
        console.error(e)
    }
}

onMounted(async () => {
    //state.mounted=false
    const nickname = window.location.href.replace(/.*\//, '')
    await getUser(nickname)

    const user = JSON.parse(localStorage.getItem("CUR_USER"))
    state.isCurUser = nickname == user.nickname
    state.headerConfig.goBack = !state.isCurUser
    state.headerConfig.showMenu = state.isCurUser

    if (state.isCurUser) {
        state.headerConfig.menuIcon = 'create'
        state.headerConfig.menuAction.param = '/profile/edit'
    }

    await getPosts()
    state.mounted = true
})

onUnmounted(() => {
    store.clearSelectUser()
})
</script>