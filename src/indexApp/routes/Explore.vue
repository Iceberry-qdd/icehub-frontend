<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div id="explore" class="relative">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>
        <PostsTimeline
            :is-loading="state.isLoading"
            :posts="state.posts"
            :cur-page-index="state.pageIdx"
            :total-pages="state.totalPages">
        </PostsTimeline>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewPost">
        </Footer>
    </div>
</template>

<script setup>
import { onMounted, computed, reactive, provide, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { getTimeline } from '@/indexApp/js/api.js'
import { useRouter } from 'vue-router'
import Header from '@/indexApp/components/Header.vue'
import Footer from '@/indexApp/components/Footer.vue'
const PostsTimeline = defineAsyncComponent(() => import('@/indexApp/components/PostsTimeline.vue'))

const router = useRouter()
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
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
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

const hasMore = computed(() => {
    return state.pageIdx < state.totalPages
})

function fetchNewPost() {
    getData()
}

function handleAction() {
    router.push({ name: 'search' })
}

function postingNew(post) {
    state.posts.unshift(post)
}

onMounted(() => {
    getData()
})

provide('postingNew', { postingNew })
</script>