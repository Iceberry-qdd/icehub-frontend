<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div id="explore" class="relative">
        <Header
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
        <div
            id="footer"
            class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <IconLoading
                v-if="hasMore || state.isLoading"
                class="h-5 text-slate-500 w-5">
            </IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<script setup>
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import Header from '@/indexApp/components/Header.vue'
import { getTimeline } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { onMounted, computed, reactive, provide, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'

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

const hasMore = computed(() => {
    return state.pageIdx < state.totalPages
})

function fetchNewPost() {
    if (!hasMore.value){
        footerObserver.unobserve(document.querySelector('#footer'))
        return
    }

    getData()
}

function handleAction() {
    router.push({ name: 'search' })
}

function postingNew(post) {
    state.posts.unshift(post)
}

const options = {root: null, rootMargin: '0px', threshold: 0}

const footerObserver = new IntersectionObserver((entries) => {
    if(entries[0].intersectionRatio > options.threshold && !state.isLoading){
        fetchNewPost()
    }
}, options)

onMounted(() => {
    getData()
    footerObserver.observe(document.querySelector('#footer'))
})

onBeforeUnmount(() => {
    footerObserver.unobserve(document.querySelector('#footer'))
})

provide('postingNew', { postingNew })
</script>