<template>
    <div>
        <div class=" flex relative flex-col gap-y-4 px-[1rem] py-[1rem] border-gray-100 border-b-[1px] hover:bg-[#f5f5f5] cursor-pointer">
            <div v-if="tieSub == 'mid'" class="timeline-mid absolute w-[0.15rem] h-full top-0 left-[2.7rem] bg-gray-200 z-0"></div>
            <div v-if="tieSub == 'top'" class="timeline-top absolute w-[0.15rem] top-[2.5rem] left-[2.7rem] bg-gray-200 z-0"></div>
            <div v-if="tieSub == 'bottom'" class="timeline-bottom absolute w-[0.15rem] h-[2.5rem] top-0 left-[2.7rem] bg-gray-200 z-0"></div>
            <div class="absolute left-0 top-0 w-full h-full z-10 bg-transparent" @click.self="routeToReplyDetail(review.id)"></div>
            <div class='flex flex-row pl-[0.5rem] justify-between items-center'>
                <div class="flex relative flex-row items-center gap-x-4">
                    <Transition name="fade">
                            <UserInfoPop
                                @mouseleave="state.showUserInfoPop = false"
                                :user="props.review.user"
                                v-if="state.showUserInfoPop"
                                class="user-info-pop z-[99] absolute top-0 shadow-lg">
                            </UserInfoPop>
                    </Transition>
                    <div class="relative z-10">
                        <Avatar
                            :user="props.review.user"
                            @mouseenter="state.showUserInfoPop = true"
                            @click="routeToUser(props.review.user.nickname)"
                            class="w-[2.5rem] h-[2.5rem] rounded-[6px]">
                        </Avatar>
                    </div>
                    <div class="z-20">
                        <div @click="routeToUser(props.review.user.nickname)"
                            class="text-[12pt] font-bold cursor-pointer hover:underline">
                            {{ props.review.user.nickname }}
                            <i v-if="props.review.user.verified" class="bi bi-patch-check-fill verify relative text-[10pt] text-blue-500"></i>
                        </div>
                        <div v-if="props.post != null" @click="routeToUser(replyTo)" class="text-[11pt]"> 回复 
                            <span class="cursor-pointer hover:underline font-bold">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class='text-[10pt] text-gray-400'>{{ formattedTime }}</div>
                </div>
            </div>
            <div class="pl-[4rem] text-[12pt]">
                <VueShowdown tag="markdown" :extensions="['exts']" :markdown="props.review.content"></VueShowdown>
            </div>
            <div class="flex flex-row justify-between pl-[4rem] z-20">
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2" @click="toggleMenu">
                    <more-two theme="outline" size="20" fill="#333" :strokeWidth="3" />
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1"
                    @click="state.showReplyPanel = true">
                    <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                    {{ state.totalReplyCount }}
                    <Teleport to = '#app'>
                        <ReviewPanel
                            :parentReview = "props.review"
                            @dismiss = "dismissReplyPanel"
                            v-if="state.showReplyPanel">
                        </ReviewPanel>
                    </Teleport>
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1" @click="toggleLike">
                    <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3" :class="isLiked ? 'liked' : ''" />
                    {{ props.review.likeCount }}
                </button>
            </div>
        </div>
        <div v-if="state.replies.length > 0">
            <TransitionGroup name="reviews">
                <Reply class="z-10 hover:bg-[#f5f5f5] cursor-pointer" v-for="(review, index) in state.replies"
                    @fetchMoreReply="fetchMoreReply"
                    :reply="review"
                    :index="index"
                    :review="props.review"
                    :tieSub="index < state.totalReplyCount - 1 ? 'mid' : 'bottom'"
                    :totalReplyCount="state.totalReplyCount"
                    :fetchedReplyCount="state.replies.length"
                    :key="review.id">
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

.liked {
    color: red;
    background-color: #fecaca;
}

.timeline-top {
    height: calc(100% - 2.5rem);
}

.fade-enter-active{
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active{
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from{
    opacity: 0;
}

.fade-leave-to{
    opacity: 0;
}
</style>

<script setup>
// 只包括评论和一层回复
import { computed, reactive, onMounted, provide } from 'vue'
import { dislikeAReview, getSubReviewById, likeAReview } from '@/api'
import { humanizedTime } from '@/utils/formatUtils.js'
import { store } from '@/store'
import { Like, Message, MoreTwo } from '@icon-park/vue-next'
import router from '@/route'
import Reply from '@/components/tailwind/Reply.vue'
import UserInfoPop from '@/components/tailwind/UserInfoPop.vue'
import { VueShowdown } from 'vue-showdown'
import ReviewPanel from '@/components/tailwind/ReviewPanel.vue'
import Avatar from '@/components/tailwind/Avatar.vue'

const props = defineProps(['review', 'post', 'tieSub'])
const state = reactive({
    replies: [],
    totalReplyCount: props.review.replyCount,
    pageIndex: 1,
    pageSize: 2,
    lastTimestamp: new Date().getTime(),
    showUserInfoPop: false,
    showReplyPanel: false,
})

const formattedTime = computed(() => {
    return humanizedTime(props.review.createdTime)
})

const replyTo = computed(() => {
    try {
        if (props.post.user.nickname) {
            return props.post.user.nickname
        } else {
            throw new Error('获取评论用户名失败！')
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
})

const tieSub = computed(()=> {
    return state.totalReplyCount == 0 ? 'none' : 'top'
})

async function getReply() {
    try {
        const response = await getSubReviewById(props.review.id, state.pageIndex, state.pageSize,state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)
        const { content, totalCount } = await response.json()
        state.replies.push(...content)
        state.totalReplyCount = totalCount
        if(content.length>1) {
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

function dismissReplyPanel(){
    state.showReplyPanel = false
}

async function toggleLike() {
    try {
        if (props.review.liked == false) {
            const response = await likeAReview(props.review.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = props.review.likeCount
            props.review.likeCount = lastCount + 1
            props.review.liked = true
        } else {
            const response = await dislikeAReview(props.review.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = props.review.likeCount
            props.review.likeCount = lastCount - 1
            props.review.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

const isLiked = computed(() => {
    return props.review.liked
})

const likedIconTheme = computed(() => {
    return props.review.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

const hasReply = computed(() => {
    return state.replies.length > 0
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

onMounted(() => {
    getReply()
})

provide('newReview', { newReview })
</script>