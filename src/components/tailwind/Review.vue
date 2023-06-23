<template>
    <div>
        <div class=" flex relative flex-col gap-y-4 px-[1rem] py-[1rem] border-gray-100 border-b-[1px] hover:bg-[#f5f5f5] cursor-pointer">
            <div v-if="state.tieSub == 'mid'" class="timeline-mid absolute w-[0.15rem] h-full top-0 left-[2.7rem] bg-gray-200 z-0"></div>
            <div v-if="state.tieSub == 'top'" class="timeline-top absolute w-[0.15rem] top-[2.5rem] left-[2.7rem] bg-gray-200 z-0"></div>
            <div v-if="state.tieSub == 'bottom'" class="timeline-bottom absolute w-[0.15rem] h-[2.5rem] top-0 left-[2.7rem] bg-gray-200 z-0"></div>
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
                    <div class="w-[2.5rem] h-[2.5rem] relative z-10">
                        <a @mouseenter="state.showUserInfoPop = true" @click="routeToUser(props.review.user.nickname)">
                            <img :src="avatar" class="rounded-[6px]" />
                        </a>
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
            <div class="pl-[4rem] text-[12pt]"> {{ props.review.content }} </div>
            <div class="flex flex-row justify-between pl-[4rem] z-20">
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2" @click="toggleMenu">
                    <more-two theme="outline" size="20" fill="#333" :strokeWidth="3" />
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1"
                    @click="store.setReviewPanelData(props.review)">
                    <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                    {{ props.review.reviewCount }}
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1" @click="toggleLike">
                    <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3" :class="isLiked ? 'liked' : ''" />
                    {{ props.review.likeCount }}
                </button>
            </div>
        </div>
        <div v-if="state.replies.length > 0">
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
        </div>
    </div>
</template>

<style scoped>
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
import { computed, reactive, onMounted } from 'vue'
import { dislikeAReview, getSubReviewById, likeAReview } from '@/api'
import { humanizedTime } from '@/utils/formatUtils.js'
import { store } from '@/store'
import { Like, Message, MoreTwo } from '@icon-park/vue-next'
import router from '@/route'
import Reply from '@/components/tailwind/Reply.vue'
import UserInfoPop from '@/components/tailwind/UserInfoPop.vue'

const props = defineProps(['review', 'post', 'tieSub'])

const state = reactive({
    showPanel: false,
    replies: [],
    totalReplyCount: 0,
    pageIndex: 0,
    pageSize: 2,
    tieSub: props.tieSub,
    showUserInfoPop: false
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

async function toggleReviewPanel() {
    const isShow = state.showPanel
    if (isShow == false) { await getReply() }
    state.showPanel = !isShow
}

async function getReply() {
    try {
        state.pageIndex++;
        const response = await getSubReviewById(props.review.id, state.pageIndex, state.pageSize)
        if (!response.ok) throw new Error((await response.json()).error)
        const { content, totalCount } = await response.json()
        const newReplies = content.filter(item => {
            return !state.replies.find(it => it.id == item.id)
        })
        state.replies.push(...newReplies)
        state.totalReplyCount = totalCount
        if (hasReply.value) { state.tieSub = 'top' }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchMoreReply() {
    state.pageSize = 10
    state.pageIndex = 0
    getReply()
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

const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${props.review.user.nickname}.svg`
    const { previewUrl, originUrl, contentType } = props.review.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

onMounted(() => {
    getReply()

})

function routeToUser(nickname) {
    router.push({ name: 'profile', params: { nickname: nickname } })
}
</script>