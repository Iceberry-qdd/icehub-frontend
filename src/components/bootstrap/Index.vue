<template>
    <div class="position-relative" id="index">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <Transition>
            <GlobalRefresh v-if="state.isShowGlobalRefresh==true"
                @closeGlobalRefresh="state.isShowGlobalRefresh=false"
                class="fixed z-[99] left-1/2 -translate-x-1/2"
                :class="[isShowGlobalNotifyBannerMsg ? 'top-6.5-rem' : 'top-4-rem']"></GlobalRefresh>
        </Transition>
        <PostEditor @get-data="getData" @postingNew="postingNew"></PostEditor>
        <PostsTimeline
            :isLoading="state.isLoading"
            :posts="state.posts"
            :curPageIndex="state.pageIdx"
            :totalPages="state.totalPages"></PostsTimeline>
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

.position-relative {
    position: relative;
}

.top-4-rem {
    top: 4rem;
}

.top-6\.5-rem {
    top: 6.5rem;
}
</style>

<script setup>
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import Header from '@/components/tailwind/Header.vue'
import { getUserTimeline } from '@/api.js'
import { store } from '@/store.js'
import PostEditor from '@/components/tailwind/PostEditor.vue'
import { computed, onMounted, onUnmounted, reactive, provide } from 'vue'
import GlobalRefresh from '@/components/tailwind/GlobalRefresh.vue'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    totalPages: 0,
    lastTimestamp: new Date().getTime(),
    headerConfig: {
        title: '主页',
        goBack: false,
        showMenu: true,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
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

function fetchNewPost() {
    if (state.pageIdx >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            getData()
        }, 1000)
    }
}

function postingNew(post) {
    state.posts.unshift(post)
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return store.GLOBAL_NOTIFY_BANNER_MSG.length > 0
})

onMounted(() => {
    getData()
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
})

provide('postingNew', { postingNew })
</script>