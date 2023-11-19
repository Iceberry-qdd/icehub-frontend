<template>
    <div v-if="state.from  && state.content" class="notify-card" :class="postStatus">
        <div>
            <Like v-if="state.type == 'POST_LIKE' || state.type == 'REVIEW_LIKE'" theme="filled" size="20" fill="red" strokeWidth="3" class="icon bg-[#fecaca] hover:bg-[#fecaca]" />
            <message v-else-if="state.type == 'REVIEW' || state.type == 'REVIEW_REPLY'" theme="filled" size="19" fill="#f97316" :strokeWidth="3" class="icon bg-[#fed7aa] hover:bg-[#fed7aa]" />
            <share v-else-if="state.type == 'REPOST'" theme="filled" size="19" fill="#198754" :strokeWidth="3" class="icon bg-[#d1e7dd] hover:bg-[#d1e7dd]" />
            <span v-else-if="state.type == 'SYS_NOTIFY'" class="material-icons-round icon p-[0.2rem] bg-[#bfdbfe] text-[#3b82f6]">notifications</span>
            <people-plus-one v-else-if="state.type == 'USER_FOLLOW'" theme="filled" size="19" fill="#8b5cf6" :strokeWidth="3" class="icon icon-user-followed bg-[#ddd6fe] hover:bg-[#ddd6fe]" />
            <at-sign v-else-if="state.type == 'AT_SIGN'" theme="outline" size="19" fill="#ec4899" :strokeWidth="3" class="icon bg-[#fecdd3] hover:bg-[#fecdd3]" />
        </div>
        <div class="w-full">
            <div>
                <img @click.self="routeToUserProfile(state.from)" class="w-[2rem] h-[2rem] mb-2 rounded-full z-[97] relative" :src="avatar(state.from.nickname,state.from.avatarUrl)"/>
            </div>
            <div class="brief">
                <div class="event-text">{{ brief }}</div>
                <div class="time">{{ formattedTime }}</div>
            </div>

            <div class="content" v-if="state.type == 'REVIEW'">
                <div class="py-1">{{ state.content.content }}</div>
            </div>
            <div class="content" v-if="state.type == 'REPOST'">
                <div class="py-2">{{ state.content.content }}</div>
                <RepostCard :postId="state.content.rootId"></RepostCard>
            </div>
            <div class="content" v-if="state.type == 'POST_LIKE'">
                <RepostCard :postId="state.content.rootId"></RepostCard>
            </div>
            <div class="content" v-if="state.type == 'REVIEW_LIKE'">
                <div class="py-1">{{ state.content.content }}</div>
            </div>
            <div class="content" v-if="state.type == 'USER_FOLLOW'">
                <UserProfileCard :user="state.content"></UserProfileCard>
            </div>
            <div class="content" v-if="state.type == 'AT_SIGN'">
                
            </div>
            <div class="content" v-if="state.type == 'SYS_NOTIFY'">
            
            </div>
        </div>
    </div>
</template>

<style scoped>
.notify-card:not(.UNREAD):hover{
    background-color: #f5f5f5;
}

.icon {
    display: block;
    width: 2rem;
    height: 2rem;
}

.i-icon:hover{
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 99rem;
}

.material-icons-round.icon:hover {
    padding: 0.2rem !important;
    background-color: #bfdbfe;
}

.UNREAD {
    background-color: #eff6ff;
}

.material-icons-round {
    padding: 0.2rem;
    font-size: 19pt;
}

.material-icons-round:hover {
    padding: 0 !important;
    background-color: transparent;
}

.notify-card {
    padding: 1rem 1.5rem 1rem 1.5rem;
    border-bottom: 1px solid #EEEEEE;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    cursor: pointer;
}

.brief {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
}

.time {
    font-size: 10pt;
    color: #9ca3af;
}

.content{
    font-size: 11pt;
}
</style>

<script setup>
import { computed, reactive,watch } from 'vue'
import { Like, Message, Share, PeoplePlusOne, AtSign } from '@icon-park/vue-next'
import { humanizedTime } from '@/utils/formatUtils.js'
import RepostCard from '@/components/tailwind/RepostCard.vue'
import UserProfileCard from '@/components/tailwind/UserProfileCard.vue'
import { store } from '@/store'
import router from '@/route'

const props = defineProps(['message'])

const state = reactive({
    type: props.message.type, // POST_LIKE, POST_REVIEW, POST_REPOST, SYS_NOTIFY, USER_FOLLOW AT_SIGN
    content: props.message.content,
    from: props.message.from,
    to: props.message.to,
    timestamps: props.message.timestamps,
    read: props.message.read
})

const brief = computed(() => {
    const fromName = state.from.nickname || null
    switch (state.type) {
        case 'POST_LIKE':
            return `${fromName} 赞了您的帖子`
        case 'REVIEW':
            return `${fromName} 评论了您的帖子`
        case 'REVIEW_LIKE':
            return `${fromName} 赞了您的评论`
        case 'REVIEW_REPLY':
            return `${fromName} 回复了您的评论`
        case 'REPOST':
            return `${fromName} 转发了您的帖子`
        case 'SYS_NOTIFY':
            return `系统消息`
        case 'USER_FOLLOW':
            return `${fromName} 订阅了您`
        case 'AT_SIGN':
            return `${fromName} 提到了您`
        default:
            return ''
    }
})

const formattedTime = computed(() => {
    return humanizedTime(state.timestamps)
})

const postStatus = computed(()=>{
    return state.read?'READ':'UNREAD'
})

function routeToUserProfile(user){
    router.push({ name: 'profile', params: { nickname: user.nickname }})
}

watch(()=>props.message.read,function(newVal,oldVal){
    state.read = newVal
})

function avatar(nickname,avatarUrl) {
    const defaultUrl = `https://api.multiavatar.com/${nickname}.svg`
    const { previewUrl, originUrl,contentType } = avatarUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
}

function banner(bannerUrl) {
    const defaultUrl = '/src/assets/default-bg.jpg'
    const { previewUrl, originUrl,contentType } = bannerUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
}
</script>