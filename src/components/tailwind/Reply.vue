<template>
    <div>
        <div class="flex relative flex-col gap-y-4 px-[1rem] py-[1rem] border-gray-100 border-b-[1px]">
            <div v-if="state.tieSub == 'mid'" class="timeline-mid absolute w-1 h-full top-0 left-[2.6rem] bg-gray-200 z-0"></div>
            <div v-if="state.tieSub == 'top'" class="timeline-top absolute w-1 top-[2.5rem] left-[2.6rem] bg-gray-200 z-0"></div>
            <div v-if="state.tieSub == 'bottom'" class="timeline-bottom absolute w-1 h-[2.5rem] top-0 left-[2.6rem] bg-gray-200 z-0"></div>
            <div class='flex flex-row pl-[0.5rem] justify-between items-center'>
                <div class="flex relative flex-row items-center gap-x-4">
                    <Transition name="fade">
                            <UserInfoPop
                                @mouseleave="state.showUserInfoPop = false"
                                :user="props.reply.user"
                                v-if="state.showUserInfoPop"
                                class="user-info-pop z-[99] absolute top-0 shadow-lg">
                            </UserInfoPop>
                        </Transition>
                    <div class="w-[2.5rem] h-[2.5rem] relative z-10">
                        <a @mouseenter="state.showUserInfoPop = true" @click="routeToUser(props.reply.user.nickname)">
                            <img :src="avatar" class="rounded-[6px]" />
                        </a>
                    </div>
                    <div>
                        <div @click="routeToUser(props.reply.user.nickname)"
                            class="text-[12pt] font-bold cursor-pointer hover:underline">{{ props.reply.user.nickname }}
                            <i v-if="props.reply.user.verified"
                                class="bi bi-patch-check-fill verify relative text-[10pt] text-blue-500"></i>
                        </div>
                        <div @click="routeToUser(replyTo)" class="text-[11pt]"> 回复
                            <span class="cursor-pointer hover:underline font-bold">@{{ replyTo }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div class='text-[10pt] text-gray-400'>{{ formattedTime }}</div>
                </div>
            </div>
            <div class="pl-[4rem] text-[12pt]"> {{ props.reply.content }} </div>
            <div class="flex flex-row justify-between pl-[4rem]">
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-2" @click="toggleMenu">
                    <more-two theme="outline" size="20" fill="#333" :strokeWidth="3" />
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1"
                    @click="store.setReviewPanelData(props.reply)">
                    <message theme="outline" size="19" fill="#333" :strokeWidth="3" />
                    {{ props.reply.reviewCount }}
                </button>
                <button type="button" class="btn op text-[11pt] flex flex-row items-center gap-x-1" @click="toggleLike">
                    <like :theme="likedIconTheme" size="20" :fill="likedIconColor" :strokeWidth="3"
                        :class="isLiked ? 'liked' : ''" />
                    {{ props.reply.likeCount }}
                </button>
            </div>
            <div class="text-[11pt] text-[#0d6efd] cursor-pointer hover:underline ml-[4rem]"
                @click="fetchMoreReply" v-if="showMoreReplyButton">加载更多回复</div>

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
// 只包括回复，单独从Review复制出来
import { computed, reactive } from 'vue'
import { humanizedTime } from '@/utils/formatUtils.js'
import { dislikeAReview, likeAReview } from '@/api.js'
import { store } from '@/store'
import { Like, Message, MoreTwo } from '@icon-park/vue-next'
import router from '@/route'
import UserInfoPop from '@/components/tailwind/UserInfoPop.vue'

const props = defineProps(['review', 'tieSub', 'reply', 'totalReplyCount', 'fetchedReplyCount', 'index'])
const emit = defineEmits(['fetchMoreReply'])

const state = reactive({
    review: props.review,
    tieSub: props.tieSub,
    showUserInfoPop: false
})

const formattedTime = computed(() => {
    return humanizedTime(props.reply.createdTime)
})

const replyTo = computed(() => {
    try {
        if (state.review != null) {
            return state.review.user.nickname
        } else {
            throw new Error('获取评论用户名失败！')
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
})

function fetchMoreReply(){
    emit('fetchMoreReply')
}

async function toggleLike() {
    try {
        if (props.reply.liked == false) {
            const response = await likeAReview(props.reply.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('点赞失败！')

            const lastCount = props.reply.likeCount
            props.reply.likeCount = lastCount + 1
            props.reply.liked = true
        } else {
            const response = await dislikeAReview(props.reply.id)
            if (!response.ok) throw new Error((await response.json()).error)

            const result = await response.text()
            if (result == false) throw new Error('取消点赞失败！')

            const lastCount = props.reply.likeCount
            props.reply.likeCount = lastCount - 1
            props.reply.liked = false
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

const isLiked = computed(() => {
    return props.reply.liked
})

const likedIconTheme = computed(() => {
    return props.reply.liked ? 'filled' : 'outline'
})

const likedIconColor = computed(() => {
    return isLiked.value ? '#FF0000' : '#333'
})

const hasMore = computed(() => {
    return props.fetchedReplyCount < props.totalReplyCount
})

const showMoreReplyButton = computed(() => {
    return hasMore.value && props.index >= props.fetchedReplyCount - 1
})

const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${props.reply.user.nickname}.svg`
    const { previewUrl, originUrl, contentType } = props.reply.user.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

function routeToUser(nickname) {
    router.push({ name: 'profile', params: { nickname: nickname } })
}
</script>