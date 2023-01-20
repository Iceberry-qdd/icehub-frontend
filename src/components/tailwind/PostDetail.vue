<template>
    <div>
        <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>
        <PostCardDetail v-if="state.post.user != undefined" :post="state.post"></PostCardDetail>
        <ReviewEditor v-if="store.SHOW_REVIEW_PANEL" :post="state.post"></ReviewEditor>
        <div v-if="state.reviews.length > 0">
            <Review v-for="(review, index) in state.reviews" :review="review" :post="state.post" :key="review.id"
                :index="index"></Review>
        </div>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="hasMore" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
#footer {
    height: 10vh;
}
</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import { onMounted, reactive, onUnmounted, computed } from 'vue'
import { getPostById, getPostReviews } from '@/api.js'
import { store } from '@/store';
import PostCardDetail from '@/components/bootstrap/PostCardDetail.vue'
import Review from '@/components/tailwind/Review.vue'
import ReviewEditor from '@/components/tailwind/ReviewEditor.vue'
import { useRoute } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'

const $route = useRoute()

const state = reactive({
    post: store.SELECT_POST,
    reviews: [],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
    headerConfig: {
        title: '帖子详情',
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    }
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getPost(id) {
    try {
        const response = await getPostById(id)
        if (!response.ok) throw new Error((await response.json()).error)

        state.post = await response.json()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function getReviews(postId, pageIndex, pageSize) {
    try {
        const response = await getPostReviews(postId, pageIndex, pageSize)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.reviews.push(...content)
        state.totalPages = totalPages
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNewReview() {
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            state.pageIndex++
            getReviews(state.post.id, state.pageIndex, state.pageSize)
        }, 1000)
    }
}

onMounted(() => {
    const postId = $route.params.id
    if (!state.post) { getPost(postId) }

    getReviews(postId, state.pageIndex, state.pageSize)
    window.addEventListener('scroll', fetchNewReview)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewReview)
})
</script>