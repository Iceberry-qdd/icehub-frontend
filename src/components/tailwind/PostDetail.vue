<template>
    <div id="post-detail">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction">
        </Header>
        <PostCardDetail v-if="state.post" :post="state.post"></PostCardDetail>
        <ReviewEditor
            :post="state.post"
            v-if="allowReview">
        </ReviewEditor>
        <div v-if="!allowReview && state.post" class="w-[96%] h-[3rem] translate-x-[2%] my-[2%] p-4 bg-[#e8f0ff] rounded-lg flex justify-left items-center gap-2 cursor-default">
            <IconInfo class="bg-[#3b82f6] text-white rounded-full box-content p-[0.1rem]"></IconInfo>
            <span class="text-[11pt] text-[#303133]">该帖子的评论功能已关闭</span>
        </div>
        <div v-if="state.reviews.length > 0">
            <TransitionGroup name="reviews">
                <Review 
                    v-for="(review, index) in state.reviews"
                    :review="review"
                    :post="state.post"
                    :key="review.id"
                    :index="index">
                </Review>
            </TransitionGroup>
        </div>
        <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
            <IconLoading v-if="state.isLoading==true" class="h-5 w-5 text-slate-500"></IconLoading>
            <span v-else>没有更多了</span>
        </div>
    </div>
</template>

<style scoped>
#footer {
    height: 10vh;
}

.reviews-move,
.reviews-enter-active,
.reviews-leave-active {
    transition: all 0.5s cubic-bezier(0.39, 0.58, 0.57, 1);
}

.reviews-enter-from,
.reviews-leave-to {
    opacity: 0;
}

.reviews-leave-active {
    position: absolute;
    width: 100%;
    height: fit-content;
}
</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import { onMounted, reactive, onUnmounted, computed, provide } from 'vue'
import { getPostById, getPostReviews } from '@/api.js'
import { store } from '@/store';
import PostCardDetail from '@/components/bootstrap/PostCardDetail.vue'
import Review from '@/components/tailwind/Review.vue'
import ReviewEditor from '@/components/tailwind/ReviewEditor.vue'
import { useRoute } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconInfo from '@/components/icons/IconInfo.vue'

const $route = useRoute()

const state = reactive({
    post: null,
    reviews: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    headerConfig: {
        title: '帖子详情',
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0
    },
    isLoading: false
})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

const allowReview = computed(() => {
    return state.post && !state.post.plan && state.post.allowReview
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

async function getReviews() {
    try {
        state.isLoading = true
        const postId = state.post.id
        const response = await getPostReviews(postId, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.reviews.push(...content)
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

function fetchNewReview() {
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            getReviews()
        }, 1000)
    }
}

function newReview({ review }) {
    state.post.reviewCount++;
    state.reviews.unshift(review)
}

onMounted(async () => {
    const postId = $route.params.id
    if (!state.post) { await getPost(postId) }

    await getReviews()
    window.addEventListener('scroll', fetchNewReview)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewReview)
})

provide('newReview', { newReview })
</script>