<template>
    <div
        class="border-[#EEEEEE] border-b-[1px] cursor-pointer dark:border-[#1e1e1e] flex flex-row gap-4 max-sm:gap-3 max-sm:p-3 notify-card p-4"
        :class="postStatus">
        <div>
            <div
                v-if="props.message.type == 'POST_LIKE' || props.message.type == 'REVIEW_LIKE'"
                class="bg-red-200 dark:bg-neutral-800 p-[0.4rem] rounded-full">
                <IconLike
                    fill="#FF0000"
                    :size="20"
                    stroke-color="#FF0000"
                    :stroke-width="3">
                </IconLike>
            </div>
            <div
                v-else-if="props.message.type == 'REVIEW' || props.message.type == 'REVIEW_REPLY'"
                class="bg-[#fed7aa] dark:bg-neutral-800 p-[0.4rem] rounded-full">
                <IconMessage
                    class="dark:text-inherit text-[#f97316]"
                    :size="19"
                    :stroke-width="3">
                </IconMessage>
            </div>
            <div
                v-else-if="props.message.type == 'REPOST'"
                class="bg-[#d1e7dd] dark:bg-neutral-800 p-[0.4rem] rounded-full">
                <IconShare
                    class="dark:text-inherit text-[#198754]"
                    :stroke-width="3">
                </IconShare>
            </div>
            <span
                v-else-if="props.message.type == 'SYS_NOTIFY'"
                class="bg-[#bfdbfe] dark:bg-neutral-800 dark:text-inherit icon material-symbols-rounded p-[0.2rem] text-[#3b82f6] text-[19px]">
                notifications
            </span>
            <span
                v-else-if="props.message.type == 'USER_FOLLOW'"
                class="bg-[#ddd6fe] dark:bg-neutral-800 dark:text-inherit icon material-symbols-rounded text-[#8b5cf6] text-[19px]">
                person_add
            </span>
            <span
                v-else-if="props.message.type == 'AT_SIGN'"
                class="bg-[#fecdd3] dark:bg-neutral-800 dark:text-inherit icon material-symbols-rounded text-[#ec4899] text-[19px]">
                alternate_email
            </span>
        </div>
        <div
            ref="notifyContainer"
            class="notify-container">
            <Avatar
                class="h-[2rem] mb-2 relative rounded-full text-[2rem] w-[2rem] z-[97]"
                :user="props.message.from"
                @click="routeToUserProfile">
            </Avatar>
            <div class="brief flex flex-row h-fit items-center justify-between pb-2 w-full">
                <div class="event-text text-[0.9rem] z-[100]">
                    <span
                        class="hover:underline"
                        @click="routeToUserProfile">
                        {{ props.message.from.nickname }}
                    </span>
                    <span class="dark:text-white-50 pl-1">{{ brief }}</span>
                </div>
                <div 
                    class="dark:text-white/50 text-[0.8rem] text-neutral-400 time z-[97]"
                    :title="standardDateTime(props.message.timestamps)">
                    {{ humanizedTime(props.message.timestamps) }}
                </div>
            </div>

            <div
                v-if="props.message.type === 'REVIEW'"
                class="bg-white border-[1px] border-gray-200 content dark:bg-[#121212] dark:border-neutral-700 overflow-hidden relative rounded-[8px]">
                <ReviewCard
                    class="clientHeight review-card"
                    :class="{'shrink-content': state.shrinkContent.review}"
                    tire-direction="bottom"
                    :review="props.message.content">
                </ReviewCard>
            </div>
            
            <div
                v-if="props.message.type === 'REPOST'"
                ref="repost"
                class="bg-white border-[1px] border-gray-300 dark:bg-[#121212] dark:border-neutral-700 mb-2 p-2 rounded-[8px]">
                <div class="mb-2 relative">
                    <VueShowdown
                        repost
                        tag="markdown"
                        :extensions="['exts']"
                        :markdown="props.message.content.content"
                        :class="{'shrink-content': state.shrinkContent.repost, 'max-h-[45vh]': state.shrinkContent.repost}">
                    </VueShowdown>
                </div>
                <RepostCard :post-id="props.message.content.parentId"></RepostCard>
            </div>

            <div
                v-if="props.message.type === 'POST_LIKE'"
                class="content">
                <RepostCard :post="props.message.content"></RepostCard>
            </div>

            <div
                v-if="props.message.type === 'REVIEW_LIKE'"
                class="border-[1px] border-gray-300 content dark:border-neutral-700 overflow-hidden relative rounded-[8px]">
                <ReviewCard
                    :review="props.message.content"
                    tire-direction="bottom"
                    :class="{'shrink-content': state.shrinkContent.reviewLike}"
                    class="max-sm:pb-0 pb-0 review-card">
                </ReviewCard>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.message.type === 'USER_FOLLOW'" class="content">
                <UserProfileCard :user="props.message.content"></UserProfileCard>
            </div>
            <!-- eslint-disable-next-line vue/html-self-closing vue/max-attributes-per-line -->
            <div v-if="props.message.type === 'AT_SIGN'" class="content"></div>
            <!-- eslint-disable-next-line vue/html-self-closing vue/max-attributes-per-line -->
            <div v-if="props.message.type === 'SYS_NOTIFY'" class="content"></div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    display: block;
    padding: 0.4rem;
}

.i-icon:hover {
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 99rem;
}

.UNREAD {
    background-color: #eff6ff;
}

.UNREAD:where([theme="dark"], [theme="dark"] *){
    background-color: #1e1e1e;
}

.material-symbols-rounded:hover {
    padding: 0 !important;
    background-color: transparent;
}

.notify-container:has(markdown){
    width: calc(100% - 2rem - 1rem);
}

.notify-container:not(:has(markdown)){
    width: 100%;
}

markdown {
    overflow-y: hidden;
}

markdown.shrink-content::before {
    border-radius: 8px;
}
</style>

<script setup>
import { computed, reactive, watch, defineAsyncComponent, onMounted, ref } from 'vue'
import { humanizedTime, standardDateTime } from '@/indexApp/utils/formatUtils.js'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { VueShowdown } from 'vue-showdown'
import IconLike from '@/components/icons/IconLike.vue'
import IconMessage from '@/components/icons/IconMessage.vue'
import IconShare from '@/components/icons/IconShare.vue'
import ReviewCard from '@/indexApp/components/replyDetail/ReviewCard.vue'
const RepostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostCard.vue'))
const UserProfileCard = defineAsyncComponent(() => import('@/indexApp/components/notify/UserProfileCard.vue'))

const notifyContainer = ref()
const repost = ref()
const router = useRouter()
const props = defineProps({
    /** 传入的通知消息对象 */
    message: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    read: props.message.read,
    shrinkContent: {
        review: true,
        repost: true,
        reviewLike: true
    }
})

const brief = computed(() => {
    switch (props.message.type) {
        case 'POST_LIKE':
            return `赞了您的帖子`
        case 'REVIEW':
            return `评论了您的帖子`
        case 'REVIEW_LIKE':
            return `赞了您的评论`
        case 'REVIEW_REPLY':
            return `回复了您的评论`
        case 'REPOST':
            return `转发了您的帖子`
        case 'SYS_NOTIFY':
            return `系统消息`
        case 'USER_FOLLOW':
            return `订阅了您`
        case 'AT_SIGN':
            return `提到了您`
        default:
            return ''
    }
})

const postStatus = computed(() => {
    return state.read ? 'READ' : 'UNREAD'
})

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: props.message.from.nickname } })
}

watch(() => props.message.read, function (newVal, oldVal) {
    state.read = newVal
})

function setSuitableHeight() {
    let markdown = undefined

    switch (props.message.type) {
        case 'REPOST':
            markdown = repost.value.querySelector('markdown[repost]')
            state.shrinkContent.repost = markdown.clientHeight < markdown.scrollHeight
            return
        case 'REVIEW':
            markdown = notifyContainer.value.querySelector('.review-card')
            state.shrinkContent.review = markdown.clientHeight < markdown.scrollHeight
            return
        case 'REVIEW_LIKE':
            markdown = notifyContainer.value.querySelector('.review-card')
            state.shrinkContent.reviewLike = markdown.clientHeight < markdown.scrollHeight
            return
        default:;
    }
}

onMounted(() => {
    setSuitableHeight()
})
</script>