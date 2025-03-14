<template>
    <div ref="reviewBody">
        <div
            :class="{'hover:bg-gray-50 dark:hover:bg-neutral-900': route.name !== 'replyDetail'}"
            class="border-b-[1px] border-gray-100 dark:border-b-[#1e1e1e] flex flex-row gap-x-4 max-sm:gap-x-3 max-sm:p-3 p-4 relative">
            <div
                v-if="tieSub == 'mid'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-full left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="tieSub == 'top'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-[calc(100%-2.5rem)] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="tieSub == 'bottom'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-[2.5rem] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-bottom top-0 w-[0.15rem] z-0" />
            <div
                v-if="route.name !== 'replyDetail'"
                class="absolute bg-transparent cursor-pointer h-full left-0 top-0 w-full z-10"
                @click.self="routeToReplyDetail(review.id)" />

            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                <div
                    v-if="state.showUserInfoPop && store.MOBILE_MODE"
                    class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                    @click="state.showUserInfoPop = false" />
                <Transition name="fade">
                    <UserInfoPop
                        v-if="state.showUserInfoPop"
                        :user="state.review.user"
                        class="absolute h-fit max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:w-screen max-sm:z-[1001] sm:top-4 w-[20rem] z-[98]"
                        @mouseleave="state.showUserInfoPop = false">
                    </UserInfoPop>
                </Transition>
            </Teleport>
            <div class="flex relative z-10">
                <Avatar
                    :user="state.review.user"
                    class="h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]"
                    @mouseenter="handleAvatarMouseenter()"
                    @click="handleAvatarClick()">
                </Avatar>
            </div>

            <div class="flex flex-1 flex-col flex-nowrap max-sm:w-[calc(100%-2.5rem-0.75rem*3)] w-[calc(100%-2.5rem-1rem*3)]">
                <div class="flex flex-row justify-between leading-none text-[0.9rem] z-20">
                    <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                        <div
                            class="font-bold hover:underline hover:underline-offset-4 text-[1rem]"
                            @click="routeToUser(state.review.user.nickname)">
                            {{ state.review.user.nickname }}
                        </div>
                        <IconVerify
                            v-if="state.review.user.verified"
                            class="dark:text-onPrimary h-[0.9rem] text-primary w-[0.9rem]">
                        </IconVerify>
                        <div
                            v-if="state.review.user.confirmFollow"
                            class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                            lock
                        </div>
                    </div>
                    <div
                        :title="standardDateTime(state.review.createdTime)"
                        class="dark:text-white/50 text-[0.8rem] text-gray-400">
                        {{ humanizedTime(state.review.createdTime) }}
                    </div>
                </div>
                <div
                    v-if="!props.post"
                    class="dark:text-white/50 text-[0.85rem] text-gray-400"
                    @click="routeToUser(replyTo)">
                    回复
                    <span class="cursor-pointer hover:dark:text-white hover:underline">@{{ replyTo }}</span>
                </div>
                <div class="relative">
                    <div
                        v-if="state.shrinkContent"
                        class="-translate-x-1/2 absolute bg-primaryContainer-inActive bottom-2 cursor-pointer dark:bg-neutral-800 dark:text-onPrimary left-1/2 px-[1rem] py-[0.25rem] rounded-full text-[0.9rem] z-[96]"
                        @click="state.shrinkContent = false">
                        展开
                    </div>
                    <VueShowdown
                        tag="markdown"
                        :extensions="['exts']"
                        class="break-all overflow-y-hidden"
                        :class="{'shrink-content': state.shrinkContent, 'max-h-[45dvh]': state.shrinkContent}"
                        :markdown="state.review.content">
                    </VueShowdown>
                </div>
                <ImageGrid
                    v-if="state.review.images?.length"
                    :id="`img-${state.review.id}`"
                    :images="state.review.images"
                    type="review"
                    class="py-2 relative z-[20]"
                    @real-image="handleRealImage">
                </ImageGrid>
                <div class="flex flex-row gap-x-8 justify-end z-[97]">
                    <button
                        :id="`rmb-${state.review.id}`"
                        type="button"
                        title="更多"
                        class="btn flex flex-row gap-x-2 items-center op relative text-[11pt]"
                        @click="toggleMenu">
                        <span
                            class="hover:bg-[#d3d3d5] material-symbols-rounded p-[0.4rem] text-[20px]">
                            more_horiz
                        </span>
                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                        <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                            <div
                                v-if="state.showReviewMenu && store.MOBILE_MODE"
                                class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1000]" />
                            <Transition name="fade">
                                <ReviewMenu
                                    v-if="state.showReviewMenu"
                                    class="absolute bottom-0 h-auto max-sm:fixed max-sm:left-0 max-sm:pb-2 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1000] rounded-[8px] sm:max-w-[18rem] sm:min-w-[10rem]"
                                    :review="state.review">
                                </ReviewMenu>
                            </Transition>
                        </Teleport>
                    </button>
                    <button
                        type="button"
                        :title="`${state.totalReplyCount} 评论`"
                        class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                        :class="{'cursor-not-allowed text-[#C1C1C1] dark:text-white/25': !state.post?.allowReview}"
                        @click="state.post?.allowReview ? state.showReplyPanel = true : undefined">
                        <span
                            class="icon-message p-[0.4rem] rounded-full"
                            :class="{'not-allowed': !state.post?.allowReview}">
                            <IconMessage
                                :size="19"
                                :stroke-width="3">
                            </IconMessage>
                        </span>
                        {{ humanizedNumber(state.totalReplyCount) }}
                        <Teleport to="#app">
                            <Transition name="fade">
                                <ReviewPanel
                                    v-if="state.showReplyPanel"
                                    class="fixed top-0"
                                    :parent-review="state.review"
                                    @dismiss="dismissReplyPanel">
                                </ReviewPanel>
                            </Transition>
                        </Teleport>
                    </button>
                    <button
                        type="button"
                        :title="`${state.review.likeCount} 点赞`"
                        class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                        @click="toggleLike">
                        <span
                            class="icon-like p-[0.4rem] rounded-full"
                            :class="{'liked' : isLiked}">
                            <IconLike
                                :fill="likedIconFillColor"
                                :size="20"
                                :stroke-width="3">>
                            </IconLike>
                        </span>
                        {{ humanizedNumber(state.review.likeCount) }}
                    </button>
                </div>
            </div>
        </div>
        <div v-if="state.replies.length > 0 && !!state.post">
            <TransitionGroup name="reviews">
                <Reply
                    v-for="(reply, index) in state.replies"
                    :key="reply.id"
                    :index="index"
                    class="z-10"
                    :reply="reply"
                    :review="state.review"
                    :tie-sub="index < state.totalReplyCount - 1 ? 'mid' : 'bottom'"
                    :total-reply-count="state.totalReplyCount"
                    :fetched-reply-count="state.replies.length"
                    :allow-reply="state.post?.allowReview"
                    :is-loading="state.isLoading"
                    @fetch-more-reply="fetchMoreReply">
                </Reply>
            </TransitionGroup>
        </div>
    </div>
</template>

<style scoped>
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

.icon-like.liked{
    background-color: #fecaca;
    color: #ef4444;
}

.icon-like.liked>.m-icon{
    color: #ef4444;
}

.icon-like.liked:where([theme="dark"], [theme="dark"] *){
    background-color: #262626;
}

.icon-message.not-allowed{
    background-color: transparent;
    cursor: not-allowed;
}

.icon-message.not-allowed>.m-icon:where([theme="dark"], [theme="dark"] *){
    color: rgb(255 255 255 / 0.25);
}
</style>

<script setup>
// 只包括评论和一层回复
import { computed, reactive, onMounted, provide, defineAsyncComponent, ref } from 'vue'
import { dislikeAReview, getPostById, getSubReviewById, likeAReview } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter, useRoute } from 'vue-router'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
import { humanizedNumber, standardDateTime, humanizedTime } from '@/indexApp/utils/formatUtils.js'
import IconVerify from '@/components/icons/IconVerify.vue'
import IconLike from '@/components/icons/IconLike.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import { debounce } from '@/indexApp/utils/jsHelper'
const ImageGrid = defineAsyncComponent(() => import('@/indexApp/components/ImageGrid.vue'))
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const ReviewPanel = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewPanel.vue'))
const Reply = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/Reply.vue'))
const ReviewMenu = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewMenu.vue'))

const router = useRouter()
const route = useRoute()
const reviewBody = ref()
const emits = defineEmits(['incrReviewCount'])
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 传入的评论对象 */
    review: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    review: props.review,
    replies: [],
    totalReplyCount: props.review.replyCount,
    pageIndex: 1,
    pageSize: 2,
    lastTimestamp: new Date().getTime(),
    showUserInfoPop: false,
    showReplyPanel: false,
    showReviewMenu: false,
    post: props.post,
    shrinkContent: true,
    isLoading: false // reply组件是否处于加载状态
})

const replyTo = computed(() => {
    return state.post?.user?.nickname || '神秘用户'
})

// eslint-disable-next-line vue/no-dupe-keys
const tieSub = computed(() => {
    return state.totalReplyCount == 0 ? 'none' : 'top'
})

async function getReply() {
    try {
        state.isLoading = true
        const response = await getSubReviewById(state.review.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content } = await response.json()
        state.replies.push(...content)

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally{
        state.isLoading = false
    }
}

function fetchMoreReply() {
    state.pageSize = 10
    getReply()
}

function dismissReplyPanel() {
    state.showReplyPanel = false
}

const toggleLike = debounce(async function() {
    try {
        if (state.review.liked == false) {
            const response = await likeAReview(state.review.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = state.review.likeCount
            state.review.likeCount = lastCount + 1
            state.review.liked = true
        } else {
            const response = await dislikeAReview(state.review.id)
            if (!response.ok) throw new Error((await response.json()).message)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = state.review.likeCount
            state.review.likeCount = lastCount - 1
            state.review.liked = false
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    }
}, 300)

const isLiked = computed(() => {
    return state.review.liked
})

const likedIconStrokeColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

const likedIconFillColor = computed(() => {
    return isLiked.value ? '#FF0000' : 'none'
})

function routeToReplyDetail(reviewId) {
    router.push({ name: 'replyDetail', params: { id: reviewId } })
}

function routeToUser(nickname) {
    router.push({ name: 'profile', params: { nickname: nickname } })
}

function newReviewOnUi({ review }) {
    state.totalReplyCount++;
    emits('incrReviewCount')
    state.replies.unshift(review)
}

function toggleMenu() {
    state.showReviewMenu = true
}

function handleRealImage({ index, image }) {
    state.review.images[index] = image
}

function dismissReviewMenus() {
    state.showReviewMenu = false
}


function deleteReplyOnUi(replyId) {
    if (!replyId) return
    const preDeleteReplyIndex = state.replies.findIndex(it => it.id == replyId)
    if (preDeleteReplyIndex != -1) {
        state.replies.splice(preDeleteReplyIndex, 1)
    }
    if (route.name === 'replyDetail') {
        router.back()
    }
}

function handleAvatarClick() {
    if (!store.MOBILE_MODE) {
        routeToUser(state.review.user.nickname)
    } else {
        state.showUserInfoPop = true
    }
}

function handleAvatarMouseenter() {
    if (!store.MOBILE_MODE) {
        state.showUserInfoPop = true
    }
}

async function getPost(id) {
    try {
        const response = await getPostById(id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.post = result
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    }
}

function setSuitableHeight() {
    const markdown = reviewBody.value.querySelector('markdown')
    state.shrinkContent = markdown.clientHeight < markdown.scrollHeight
}

onMounted(async () => {
    await getReply()
    if (!state.post) {
        await getPost(props.review.postId)
    }

    if(route.name !== 'replyDetail'){
        setSuitableHeight()
    } else {
        state.shrinkContent = false
    }
})

provide('dismissReviewMenus', { dismissReviewMenus: dismissReviewMenus })
provide('newReviewOnUi', { newReviewOnUi })
provide('deleteReplyOnUi', { deleteReplyOnUi: deleteReplyOnUi })
provide('postCreatorId', { userId: computed(() => state.post?.user?.id) })
</script>