<template>
    <div id="bookmark">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <TransitionGroup name="posts">
            <PostCard
                v-for="post in state.posts"
                :key="post.id"
                :post="post">
            </PostCard>
        </TransitionGroup>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewPost">
        </Footer>
    </div>
</template>

<style scoped>
.posts-move,
.posts-enter-active,
.posts-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.posts-enter-from,
.posts-leave-to {
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
import { reactive, computed, onMounted, provide, watch, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getMarkPostList } from '@/indexApp/js/api.js'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
const PostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/PostCard.vue'))

const state = reactive({
    headerConfig: {
        title: '书签',
        goBack: store.MOBILE_MODE,
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
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
        state.totalPages = totalPages
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

function fetchNewPost() {
    getPostList()
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

    preDeletePosts.forEach(post => {
        const index = state.posts.indexOf(post)
        state.posts.splice(index, 1)
    })
}

function postingNew(post) {
    state.posts.unshift(post)
}

watch(() => store.MOBILE_MODE, (newVal, _) => {
    state.headerConfig.goBack = newVal
})

onMounted(() => {
    getPostList()
})

provide('deleteBookmarkOnUi', { deleteBookmarkOnUi })
provide('deletePostOnUi', { deletePostOnUi })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
provide('postingNew', { postingNew })
</script>