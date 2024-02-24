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
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <PostCard v-if="state.post" :post="state.post"></PostCard>
        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <ReviewEditor v-if="allowReview" :post="state.post" :from-review-panel="false"></ReviewEditor>
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
        <div
            id="footer"
            class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
            <IconLoading
                v-if="state.isLoading == true"
                class="h-5 text-slate-500 w-5">
            </IconLoading>
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
import Header from '@/indexApp/components/Header.vue'
import { onMounted, reactive, onUnmounted, computed, provide } from 'vue'
import { getPostById, getPostReviews } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import PostCard from '@/indexApp/components/postDetail/PostCard.vue'
import Review from '@/indexApp/components/postDetail/Review.vue'
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
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
    const postId = route.params.id
    if (!state.post) { await getPost(postId) }

    await getReviews()
    window.addEventListener('scroll', fetchNewReview)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewReview)
})


function dismissPostMenus() {
    state.isShowMenu = false
}

function deletePostOnUi() {
    router.back()
}

function deleteAllPostsOfUserOnUi() {
    router.back()
}

function postingNew(post) {
    // Ignore this method body, nothing todo.
}

provide('dismissPostMenus', { dismissPostMenus })
provide('deletePostOnUi', { deletePostOnUi })
provide('postingNew', { postingNew })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })

provide('newReview', { newReview })
</script>