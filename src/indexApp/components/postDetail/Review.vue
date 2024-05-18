<template>
    <div>
        <div
            class="border-b-[1px] border-gray-100 cursor-pointer flex flex-col gap-y-2 hover:bg-[#f5f5f5] px-[1rem] py-[1rem] relative">
            <div
                v-if="tieSub == 'mid'"
                class="absolute bg-gray-200 h-full left-[2.2rem] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="tieSub == 'top'"
                class="absolute bg-gray-200 left-[2.2rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="tieSub == 'bottom'"
                class="absolute bg-gray-200 h-[2.5rem] left-[2.2rem] timeline-bottom top-0 w-[0.15rem] z-0" />
            <div
                class="absolute bg-transparent h-full left-0 top-0 w-full z-10"
                @click.self="routeToReplyDetail(review.id)" />
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-4 items-center relative">
                    <Transition name="fade">
                        <UserInfoPop
                            v-if="state.showUserInfoPop"
                            :user="state.review.user"
                            class="absolute shadow-lg top-0 user-info-pop z-[99]"
                            @mouseleave="state.showUserInfoPop = false">
                        </UserInfoPop>
                    </Transition>
                    <div class="relative z-10">
                        <Avatar
                            :user="state.review.user"
                            class="h-[2.5rem] rounded-[6px] text-[2.5rem] w-[2.5rem]"
                            @mouseenter="state.showUserInfoPop = true"
                            @click="routeToUser(state.review.user.nickname)">
                        </Avatar>
                    </div>
                    <div class="z-20">
                        <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                            <div
                                class="font-bold hover:underline hover:underline-offset-4 text-[12pt]"
                                @click="routeToUser(state.review.user.nickname)">
                                {{ state.review.user.nickname }}
                            </div>
                            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                            <IconVerify v-if="state.review.user.verified" class="h-[0.9rem] text-blue-500 w-[0.9rem]"></IconVerify>
                        </div>
                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                        <div v-if="props.post != null" class="text-[11pt]" @click="routeToUser(replyTo)">
                            回复
                            <span class="cursor-pointer hover:underline">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div class="z-[20]">
                    <div
                        :title="standardDateTime(state.review.createdTime)"
                        class="text-[10pt] text-gray-400">
                        {{ humanizedTime(state.review.createdTime) }}
                    </div>
                </div>
            </div>
            <div class="pl-[3.5rem] text-[12pt]">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.review.content"></VueShowdown>
                <ImageGrid
                    v-if="state.review.images?.length"
                    :id="`img-${state.review.id}`"
                    :images="state.review.images"
                    type="review"
                    class="bottom-[0.5rem] pt-[0.5rem] relative z-[20]"
                    @real-image="handleRealImage">
                </ImageGrid>
            </div>
            <div class="flex flex-row justify-between pl-[3.5rem] z-20">
                <button
                    :id="`rmb-${state.review.id}`"
                    type="button"
                    title="更多"
                    class="btn flex flex-row gap-x-2 items-center op relative text-[11pt]"
                    @click="toggleMenu">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <More theme="outline" size="20" fill="#333" :stroke-width="3"></More>
                    <Transition name="fade">
                        <ReviewMenu
                            v-if="state.showReviewMenu"
                            class="absolute bottom-0"
                            :review="state.review">
                        </ReviewMenu>
                    </Transition>
                </button>
                <button
                    type="button"
                    :title="`${state.totalReplyCount} 评论`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                    @click="state.showReplyPanel = true">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <Message theme="outline" size="19" fill="#333" :stroke-width="3"></Message>
                    {{ humanizedNumber(state.totalReplyCount) }}
                    <Teleport to="#app">
                        <ReviewPanel
                            v-if="state.showReplyPanel"
                            class="fixed top-0"
                            :parent-review="state.review"
                            @dismiss="dismissReplyPanel">
                        </ReviewPanel>
                    </Teleport>
                </button>
                <button
                    type="button"
                    :title="`${state.review.likeCount} 点赞`"
                    class="btn flex flex-row gap-x-1 items-center op text-[11pt]"
                    @click="toggleLike">
                    <Like
                        :theme="likedIconTheme"
                        size="20"
                        :fill="likedIconColor"
                        :stroke-width="3"
                        :class="isLiked ? 'text-red-500 bg-red-200 hover:bg-red-200' : ''">
                    </Like>
                    {{ humanizedNumber(state.review.likeCount) }}
                </button>
            </div>
        </div>
        <div v-if="state.replies.length > 0">
            <TransitionGroup name="reviews">
                <Reply
                    v-for="(reply, index) in state.replies"
                    :key="reply.id"
                    :index="index"
                    class="cursor-pointer hover:bg-[#f5f5f5] z-10"
                    :reply="reply"
                    :review="state.review"
                    :tie-sub="index < state.totalReplyCount - 1 ? 'mid' : 'bottom'"
                    :total-reply-count="state.totalReplyCount"
                    :fetched-reply-count="state.replies.length"
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

.timeline-top {
    height: calc(100% - 2.5rem);
}

.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
// 只包括评论和一层回复
import { computed, reactive, onMounted, provide, defineAsyncComponent } from 'vue'
import { dislikeAReview, getSubReviewById, likeAReview } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { Like, Message, More } from '@icon-park/vue-next'
import { useRouter, useRoute } from 'vue-router'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
import ImageGrid from '@/indexApp/components/ImageGrid.vue'
import { humanizedNumber, standardDateTime, humanizedTime } from '@/indexApp/utils/formatUtils.js'
const UserInfoPop = defineAsyncComponent(() => import('@/indexApp/components/postDetail/UserInfoPop.vue'))
const ReviewPanel = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewPanel.vue'))
const Reply = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/Reply.vue'))
const ReviewMenu = defineAsyncComponent(() => import('@/indexApp/components/replyDetail/ReviewMenu.vue'))
import IconVerify from '@/components/icons/IconVerify.vue'

const router = useRouter()
const route = useRoute()
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
    showReviewMenu: false    
})

const replyTo = computed(() => {
    return props.post.user.nickname || '神秘用户'
})

// eslint-disable-next-line vue/no-dupe-keys
const tieSub = computed(() => {
    return state.totalReplyCount == 0 ? 'none' : 'top'
})

async function getReply() {
    try {
        const response = await getSubReviewById(state.review.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)
        const { content, totalCount } = await response.json()
        state.replies.push(...content)
        state.totalReplyCount = totalCount
        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchMoreReply() {
    state.pageSize = 10
    getReply()
}

function dismissReplyPanel() {
    state.showReplyPanel = false
}

async function toggleLike() {
    try {
        if (state.review.liked == false) {
            const response = await likeAReview(state.review.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = state.review.likeCount
            state.review.likeCount = lastCount + 1
            state.review.liked = true
        } else {
            const response = await dislikeAReview(state.review.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = state.review.likeCount
            state.review.likeCount = lastCount - 1
            state.review.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

const isLiked = computed(() => {
    return state.review.liked
})

const likedIconTheme = computed(() => {
    return state.review.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

function routeToReplyDetail(reviewId) {
    router.push({ name: 'replyDetail', params: { id: reviewId } })
}

function routeToUser(nickname) {
    router.push({ name: 'profile', params: { nickname: nickname } })
}

function newReview({ review }) {
    state.totalReplyCount++;
    state.replies.unshift(review)
}

function toggleMenu(){
    state.showReviewMenu = true
}

function handleRealImage({index, image}){
    state.review.images[index] = image
}

function dismissReviewMenus() {
    state.showReviewMenu = false
}

onMounted(() => {
    getReply()
})

function deleteReplyOnUi(replyId){
    if (!replyId) return
    const preDeleteReplyIndex = state.replies.findIndex(it => it.id == replyId)
    if (preDeleteReplyIndex != -1) {
        state.replies.splice(preDeleteReplyIndex, 1)
    }
    if(route.name === 'replyDetail'){
        router.back()
    }
}

provide('dismissReviewMenus', { dismissReviewMenus: dismissReviewMenus })
provide('newReview', { newReview })
provide('deleteReplyOnUi', { deleteReplyOnUi: deleteReplyOnUi })
</script>