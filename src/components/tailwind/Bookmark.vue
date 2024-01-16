<template>
    <div id="bookmark">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <TransitionGroup name="posts">
            <PostCard
                v-for="(post, index) in state.posts"
                :post="post"
                :key="post.id"
                :index="index">
            </PostCard>
        </TransitionGroup>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="hasMore || state.isLoading" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
.posts-move,.posts-enter-active,.posts-leave-active{
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.posts-enter-from,.posts-leave-to{
    opacity: 0;
}

.posts-leave-active {
  position: absolute;
  width: 100%;
  height: fit-content;
  z-index: 0;
}
</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import { reactive, computed, onMounted, onUnmounted, provide } from 'vue'
import PostCard from '@/components/bootstrap/PostCard.vue'
import { store } from '@/store.js'
import { getMarkPostList } from '@/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'

const state = reactive({
    headerConfig: {
        title: '书签',
        goBack: false,
        showMenu: false,
        menuIcon: 'create',
        menuAction: { action: 'route', param: '/profile/edit' }
    },
    posts: [],
    isLoading: false,
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getPostList() {
    state.isLoading = true
    try {
        const response = await getMarkPostList(state.pageIndex, state.pageSize, state.lastTimestamp)
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
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => { getPostList() }, 1000)
    }
}

function deleteBookmarkOnUi(postId) {
    if (!postId) return
    const preDeletePostIndex = state.posts.findIndex(it => it.id == postId)
    if (preDeletePostIndex != -1) {
        state.posts.splice(preDeletePostIndex, 1)
    }
}

function deletePostOnUi(postId) {
    if (!postId) return
    const preDeletePostIndex = state.posts.findIndex(it => it.id == postId)
    if (preDeletePostIndex != -1) {
        state.posts.splice(preDeletePostIndex, 1)
    }
}

function deleteAllPostsOfUserOnUi(userId) {
    if (!userId) return

    const preDeletePosts = state.posts.filter(it => it.user.id == userId)
    if (!preDeletePosts) {
        store.setErrorMsg("删除失败，该帖子不存在！")
        return
    }

    preDeletePosts.forEach( post => {
        const index = state.posts.indexOf(post)
        state.posts.splice(index, 1)
    })
}

function postingNew(post) {
    state.posts.unshift(post)
}

onMounted(() => {
    getPostList()
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
})

provide('deleteBookmarkOnUi', { deleteBookmarkOnUi })
provide('deletePostOnUi', { deletePostOnUi })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
provide('postingNew', { postingNew })
</script>