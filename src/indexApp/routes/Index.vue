<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div id="index">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction"
            :icon-tooltip="state.headerConfig.iconTooltip">
        </Header>
        
        <div  
            class="absolute content-center flex items-center justify-center pointer-events-none w-full z-[99]">
            <Transition>
                <GlobalRefresh
                    v-if="state.isShowGlobalRefresh && showUnImpl"
                    class="fixed h-auto top-[4rem]"
                    @close-global-refresh="state.isShowGlobalRefresh=false">
                </GlobalRefresh>
            </Transition>
        </div>
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
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewPost">
        </Footer>
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
import { computed, onMounted, reactive, provide } from 'vue'
import GlobalRefresh from '@/components/GlobalRefresh.vue'
import Footer from '@/indexApp/components/Footer.vue'

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
    getData()
}

function postingNew(post) {
    state.posts.unshift(post)
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return store.GLOBAL_NOTIFY_BANNER_MSG.length > 0
})

onMounted(() => {
    getData()
})

provide('postingNew', { postingNew })
</script>