<template>
    <div
        class="border-[#EEEEEE] border-b-[1px] cursor-pointer flex flex-row gap-4 max-sm:gap-3 max-sm:p-3 notify-card p-4"
        :class="postStatus">
        <div>
            <Like
                v-if="state.type == 'POST_LIKE' || state.type == 'REVIEW_LIKE'"
                theme="filled"
                size="20"
                fill="red"
                stroke-width="3"
                class="bg-[#fecaca] hover:bg-[#fecaca] icon">
            </Like>
            <Message
                v-else-if="state.type == 'REVIEW' || state.type == 'REVIEW_REPLY'"
                theme="filled"
                size="19"
                fill="#f97316"
                :stroke-width="3"
                class="bg-[#fed7aa] hover:bg-[#fed7aa] icon">
            </Message>
            <Share
                v-else-if="state.type == 'REPOST'"
                theme="filled"
                size="19"
                fill="#198754"
                :stroke-width="3"
                class="bg-[#d1e7dd] hover:bg-[#d1e7dd] icon">
            </Share>
            <span
                v-else-if="state.type == 'SYS_NOTIFY'"
                class="bg-[#bfdbfe] icon material-symbols-rounded p-[0.2rem] text-[#3b82f6]">
                notifications
            </span>
            <PeoplePlusOne
                v-else-if="state.type == 'USER_FOLLOW'"
                theme="filled"
                size="19"
                fill="#8b5cf6"
                :stroke-width="3"
                class="bg-[#ddd6fe] hover:bg-[#ddd6fe] icon icon-user-followed">
            </PeoplePlusOne>
            <AtSign
                v-else-if="state.type == 'AT_SIGN'"
                theme="outline"
                size="19"
                fill="#ec4899"
                :stroke-width="3"
                class="bg-[#fecdd3] hover:bg-[#fecdd3] icon">
            </AtSign>
        </div>
        <div class="notify-container">
            <Avatar
                class="h-[2rem] mb-2 relative rounded-full text-[2rem] w-[2rem] z-[97]"
                :user="state.from"
                @click="routeToUserProfile">
            </Avatar>
            <div class="brief flex flex-row h-fit items-center justify-between pb-2 w-full">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="event-text z-[100]">
                    <span
                        class="hover:underline"
                        @click="routeToUserProfile">
                        {{ state.from.nickname }}
                    </span>
                    &nbsp;
                    {{ brief }}
                </div>
                <div 
                    class="text-[#9ca3af] text-[0.9rem] time z-[97]"
                    :title="standardDateTime(state.timestamps)">
                    {{ humanizedTime(state.timestamps) }}
                </div>
            </div>

            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="state.type == 'REVIEW'" class="content text-[1rem]">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="py-1">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.content.content"></VueShowdown>
                </div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="state.type == 'REPOST'" class="content">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="py-2">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.content.content"></VueShowdown>
                </div>
                <RepostCard :post-id="state.content.parentId"></RepostCard>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="state.type == 'POST_LIKE'" class="content">
                <RepostCard :post="state.content"></RepostCard>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="state.type == 'REVIEW_LIKE'" class="content">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="py-1">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <VueShowdown tag="markdown" :extensions="['exts']" :markdown="state.content.content"></VueShowdown>
                </div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="state.type == 'USER_FOLLOW'" class="content">
                <UserProfileCard :user="state.content"></UserProfileCard>
            </div>
            <!-- eslint-disable-next-line vue/html-self-closing vue/max-attributes-per-line -->
            <div v-if="state.type == 'AT_SIGN'" class="content"></div>
            <!-- eslint-disable-next-line vue/html-self-closing vue/max-attributes-per-line -->
            <div v-if="state.type == 'SYS_NOTIFY'" class="content"></div>
        </div>
    </div>
</template>

<style scoped>
.notify-card:not(.UNREAD):hover {
    background-color: #f5f5f5;
}

.icon {
    display: block;
    padding: 0.4rem;
}

.i-icon:hover {
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 99rem;
}

.material-symbols-rounded.icon:hover {
    padding: 0.2rem !important;
    background-color: #bfdbfe;
}

.UNREAD {
    background-color: #eff6ff;
}

.material-symbols-rounded {
    padding: 0.2rem;
    font-size: 19pt;
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
</style>

<script setup>
import { computed, reactive, watch, defineAsyncComponent } from 'vue'
import { Like, Message, Share, PeoplePlusOne, AtSign } from '@icon-park/vue-next'
import { humanizedTime, standardDateTime } from '@/indexApp/utils/formatUtils.js'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { VueShowdown } from 'vue-showdown'
const RepostCard = defineAsyncComponent(() => import('@/indexApp/components/postDetail/RepostCard.vue'))
const UserProfileCard = defineAsyncComponent(() => import('@/indexApp/components/notify/UserProfileCard.vue'))

const router = useRouter()
const props = defineProps({
    /** 传入的通知消息对象 */
    message: {
        type:Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    type: props.message.type, // POST_LIKE, POST_REVIEW, POST_REPOST, SYS_NOTIFY, USER_FOLLOW AT_SIGN
    content: props.message.content,
    from: props.message.from,
    to: props.message.to,
    timestamps: props.message.timestamps,
    read: props.message.read
})

const brief = computed(() => {
    switch (state.type) {
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
    router.push({ name: 'profile', params: { nickname: state.from.nickname } })
}

watch(() => props.message.read, function (newVal, oldVal) {
    state.read = newVal
})
</script>