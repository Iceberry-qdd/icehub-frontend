<template>
    <div id="post-detail">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <PostCard
            v-if="state.post"
            :post="state.post"
            @show-review-panel="state.showReviewPanel = true">
        </PostCard>
        <ReviewEditor 
            v-if="allowReview && !store.MOBILE_MODE"
            :post="state.post"
            :from-review-panel="false">
        </ReviewEditor>
        <Teleport to="#app">
            <Transition name="fade">
                <ReviewPanel
                    v-if="state.post && state.showReviewPanel && store.MOBILE_MODE && allowReview"
                    class="max-sm:fixed max-sm:top-0"
                    :post="state.post"
                    @dismiss="state.showReviewPanel = false">
                </ReviewPanel>
            </Transition>
        </Teleport>
        <div
            v-if="!allowReview && state.post"
            class="bg-[#e8f0ff] cursor-default flex gap-2 h-[3rem] items-center justify-left my-[2%] p-4 rounded-lg translate-x-[2%] w-[96%]">
            <IconInfo class="bg-[#3b82f6] box-content p-[0.1rem] rounded-full text-white"></IconInfo>
            <span class="text-[#303133] text-[11pt]">该帖子的评论功能已关闭</span>
        </div>
        <div v-if="state.reviews.length > 0">
            <TransitionGroup name="reviews">
                <Review
                    v-for="(review, index) in state.reviews"
                    :key="review.id"
                    :review="review"
                    :post="state.post"
                    :index="index">
                </Review>
            </TransitionGroup>
        </div>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewReview">
        </Footer>
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
import Header from '@/indexApp/components/Header.vue'
import { onMounted, reactive, computed, provide } from 'vue'
import { getPostById, getPostReviews } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import PostCard from '@/indexApp/components/postDetail/PostCard.vue'
import Review from '@/indexApp/components/postDetail/Review.vue'
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import { useRouter, useRoute } from 'vue-router'
import Footer from '@/indexApp/components/Footer.vue'
import ReviewPanel from '@/indexApp/components/replyDetail/ReviewPanel.vue'

const router = useRouter()
const route = useRoute()
const state = reactive({
    post: undefined,
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
    isLoading: false,
    showReviewPanel: false
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
    getReviews()
}

function newReview({ review }) {
    state.post.reviewCount++;
    state.reviews.unshift(review)
}

function dismissPostMenus() {
    state.isShowMenu = false
}

function deletePostOnUi() {
    router.back()
}

function deleteAllPostsOfUserOnUi() {
    router.back()
}

function deleteReviewOnUi(reviewId){
    if (!reviewId) return
    const preDeleteReviewIndex = state.reviews.findIndex(it => it.id == reviewId)
    if (preDeleteReviewIndex != -1) {
        state.reviews.splice(preDeleteReviewIndex, 1)
    }
}

function postingNew(post) {
    // Ignore this method body, nothing todo.
}

onMounted(async () => {
    const postId = route.params.id
    if (!state.post) { await getPost(postId) }

    await getReviews()
})

provide('dismissPostMenus', { dismissPostMenus })
provide('deletePostOnUi', { deletePostOnUi })
provide('postingNew', { postingNew })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
provide('deleteReviewOnUi', { deleteReviewOnUi })
provide('newReview', { newReview })
</script>