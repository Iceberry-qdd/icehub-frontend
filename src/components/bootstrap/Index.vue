<template>
    <div class="position-relative">
        <Header
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
        <PostEditor @get-data="getData"></PostEditor>
        <PostsTimeline
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
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import GlobalRefresh from '@/components/tailwind/GlobalRefresh.vue'

const state = reactive({
    posts: [],
    pageIdx: 1,
    pageSize: 10,
    totalPages: 0,
    headerConfig: {
        title: '主页',
        goBack: false,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    },
    isShowGlobalRefresh:true
})

async function getData(pageIdx, pageSize) {
    try {
        const response = await getUserTimeline(pageIdx, pageSize)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
        state.totalPages = totalPages
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNewPost() {
    if (state.pageIdx >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            state.pageIdx++
            getData(state.pageIdx, state.pageSize)
        }, 1000)
    }
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return store.GLOBAL_NOTIFY_BANNER_MSG.length > 0
})

onMounted(() => {
    getData(state.pageIdx, state.pageSize)
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
})
</script>