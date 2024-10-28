<template>
    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
    <div id="index">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.theme.iconMap.get(state.theme.mode)"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="state.theme.showMenu = true">
        </Header>
        <div class="max-sm:hidden sm:absolute sm:left-full">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                <div
                    v-if="state.theme.showMenu && store.MOBILE_MODE"
                    class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                    @click="state.theme.showMenu = false" />
                <Transition name="fade">
                    <ThemeMenu
                        v-if="state.theme.showMenu"
                        :icon-map="state.theme.iconMap"
                        :active-mode="state.theme.mode"
                        class="fixed h-fit max-sm:bottom-0 max-sm:left-0 max-sm:pb-4 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:-translate-x-[calc(100%+1rem)] sm:max-w-[18rem] sm:min-w-[10rem] sm:top-[1rem] z-[1002]"
                        @active-mode="toggleTheme"
                        @dismiss="state.theme.showMenu = false">
                    </ThemeMenu>
                </Transition>
            </Teleport>
        </div>
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
        <Transition name="fade">
            <PostEditor
                v-show="!store.MOBILE_MODE || (store.MOBILE_MODE && state.isShowPostEditor)"
                id="post-editor"
                :class="{'fixed-page': store.MOBILE_MODE && state.isShowPostEditor}"
                class="border-b-[1px] border-border max-sm:fixed max-sm:h-[calc(100vh-2.5rem)] max-sm:overflow-y-auto max-sm:w-screen max-sm:z-[1000] top-0"
                @close="state.isShowPostEditor = false"
                @get-data="getData"
                @posting-new="postingNew">
            </PostEditor>
        </Transition>
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
        <div
            id="create-post-btn"
            class="bg-primary bottom-20 dark:shadow-neutral-800/25 fixed material-symbols-rounded no-hover p-3 right-4 shadow-lg shadow-primary-disable sm:hidden text-white z-[111]"
            @click="state.isShowPostEditor = true">
            create
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

@media not all and (min-width: 640px) {
    #main:has(#back-to-top)>#index>#create-post-btn{
        display: none;
    }
}
</style>

<script setup>
import { computed, onMounted, reactive, provide, defineAsyncComponent } from 'vue'
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import Header from '@/indexApp/components/Header.vue'
import { getUserTimeline } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import PostEditor from '@/indexApp/components/index/PostEditor.vue'
import GlobalRefresh from '@/components/GlobalRefresh.vue'
import Footer from '@/indexApp/components/Footer.vue'
import { useRoute } from 'vue-router'
const ThemeMenu = defineAsyncComponent(() => import('@/indexApp/components/index/ThemeMenu.vue'))

const route = useRoute()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    headerConfig: {
        title: '动态',
        goBack: false,
        showMenu: true,
        menuIcon: undefined,
        iconTooltip: '切换主题'
    },
    isShowGlobalRefresh: true,
    isLoading: false,
    isShowPostEditor: false,
    theme: {
        showMenu: false,
        mode: 'followSystem',
        iconMap: new Map([
            ['dark', 'dark_mode'],
            ['light', 'light_mode'],
            ['followSystem', 'contrast']
        ])
    }
})

async function getData() {
    state.isLoading = true
    try {
        const response = await getUserTimeline(state.pageIdx, state.pageSize, state.lastTimestamp)
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

function toggleTheme(mode){
    state.theme.mode = mode
    if(mode !== 'followSystem'){
        localStorage.setItem('theme', mode)
        document.body.setAttribute('theme', mode)
    } else {
        localStorage.removeItem('theme')
        document.body.setAttribute('theme', store.SYS_THEME_MODE)
    }
    state.theme.showMenu = false
}

onMounted(() => {
    // PostEditor display settings
    if(route.query?.postEditor && store.MOBILE_MODE){
        state.isShowPostEditor = true
    }

    // Theme settings
    if(!('theme' in localStorage)){
        state.theme.mode = 'followSystem'
    } else{
        state.theme.mode = localStorage.theme
    }

    getData()
})

provide('postingNew', { postingNew })
</script>