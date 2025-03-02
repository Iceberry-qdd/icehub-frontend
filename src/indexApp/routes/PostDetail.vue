<template>
    <div id="post-detail">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon">
        </Header>
        <PostCard
            v-if="state.post"
            :post="state.post"
            @show-review-panel="state.showReviewPanel = true">
        </PostCard>
        <StatisticAndSorting
            class="backdrop-blur-xl bg-white/80 dark:bg-[#121212dd] dark:border-[#1e1e1e] dark:text-white/50 max-sm:top-[48px] sticky text-neutral-500 top-[56px] z-[99]"
            :like-count="state.post?.likeCount"
            :review-count="state.post?.reviewCount"
            :repost-count="state.post?.repostCount"
            :bookmark-count="state.post?.collectCount"
            :sort="state.sort"
            @select-order-by="(by) => state.sort.by = by"
            @select-order-direction="(direction) => state.sort.direction = direction">
        </StatisticAndSorting>
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
        <!-- eslint-disable-next-line vue/no-undef-components, vue/component-name-in-template-casing -->
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component
                    :is="Component"
                    :allow-review="allowReview"
                    :post="state.post"
                    :sort="state.sort"
                    :new-review="state.newReview"
                    @incr-review-count="state.post.reviewCount++">
                </component>
            </keep-alive>
        </router-view>
    </div>
</template>

<style scoped>
#footer {
    height: 10dvh;
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
import { onMounted, reactive, computed, provide, defineAsyncComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { getPostById } from '@/indexApp/js/api.js'
import Header from '@/indexApp/components/Header.vue'
import PostCard from '@/indexApp/components/postDetail/PostCard.vue'
const StatisticAndSorting = defineAsyncComponent(() => import('@/indexApp/components/postDetail/StatisticAndSorting.vue'))
const ReviewPanel = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewPanel.vue'))

const router = useRouter()
const route = useRoute()
const state = reactive({
    post: undefined,
    headerConfig: {
        title: '帖子详情',
        goBack: true,
        showMenu: false,
        menuIcon: null
    },
    sort: {
        by: 'CREATE_TIME',
        direction: 'DESC'
    },
    newReview: undefined
})

const allowReview = computed(() => {
    return state.post && !state.post.plan && state.post.allowReview
})

async function getPost(id) {
    try {
        const response = await getPostById(id)
        if (!response.ok) throw new Error((await response.json()).message)

        state.post = await response.json()
    } catch (e) {
        console.error(e)
    }
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

function postingNew(post) {
    // Ignore this method body, nothing todo.
}

function newReviewOnUi(review){
    state.newReview = review
}

onMounted(() => {
    const postId = route.params.id
    if (!state.post) {
        getPost(postId)
    }
})

provide('dismissPostMenus', { dismissPostMenus })
provide('deletePostOnUi', { deletePostOnUi })
provide('postingNew', { postingNew })
provide('deleteAllPostsOfUserOnUi', { deleteAllPostsOfUserOnUi })
provide('newReviewOnUi', { newReviewOnUi })
</script>