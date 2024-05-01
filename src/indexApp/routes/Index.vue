<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div id="index" class="relative">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction"
            :icon-tooltip="state.headerConfig.iconTooltip">
        </Header>
        <Transition>
            <GlobalRefresh
                v-if="state.isShowGlobalRefresh && showUnImpl"
                class="-translate-x-1/2 fixed left-1/2 z-[99]"
                :class="[isShowGlobalNotifyBannerMsg ? 'top[6.5rem]' : 'top-[4rem]']"
                @close-global-refresh="state.isShowGlobalRefresh=false">
            </GlobalRefresh>
        </Transition>
        <PostEditor
            @get-data="getData"
            @posting-new="postingNew">
        </PostEditor>
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

<style scoped>
.v-enter-active {
    animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.v-leave-active {
    animation: slide-out-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
}

@keyframes slide-in-top {
    0% {
        translate: 0 -1000px;
        opacity: 0
    }

    100% {
        translate: 0 0;
        opacity: 1
    }
}

@keyframes slide-out-top {
    0% {
        translate: 0 0;
        opacity: 1;
    }

    100% {
        translate: 0 -1000px;
        opacity: 0;
    }
}
</style>

<script setup>
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import Header from '@/indexApp/components/Header.vue'
import { getUserTimeline } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import PostEditor from '@/indexApp/components/index/PostEditor.vue'
import { computed, onMounted, reactive, provide, onBeforeUnmount } from 'vue'
import GlobalRefresh from '@/components/GlobalRefresh.vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    headerConfig: {
        title: '主页',
        goBack: false,
        showMenu: showUnImpl, // TODO implement it.
        menuIcon: 'campaign',
        menuAction: { action: 'route', param: '' },
        iconTooltip: '公告'
    },
    isShowGlobalRefresh: true,
    isLoading: false
})

async function getData() {
    state.isLoading = true
    try {
        const response = await getUserTimeline(state.pageIdx, state.pageSize, state.lastTimestamp)
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

function postingNew(post) {
    state.posts.unshift(post)
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return store.GLOBAL_NOTIFY_BANNER_MSG.length > 0
})

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