<template>
    <div v-if="state.from != null" class="notify-card notify-POST_LIKE-card" :class="`${state.status}`">
        <div>
            <Like v-if="state.type == 'POST_LIKE'" theme="filled" size="20" fill="red" strokeWidth="3" class="icon bg-[#fecaca]" />
            <message v-else-if="state.type == 'POST_REVIEW'" theme="filled" size="19" fill="#f97316" :strokeWidth="3" class="icon bg-[#fed7aa]" />
            <share v-else-if="state.type == 'POST_REPOST'" theme="filled" size="19" fill="#198754" :strokeWidth="3" class="icon bg-[#d1e7dd]" />
            <span v-else-if="state.type == 'SYS_NOTIFY'" class="material-icons-round icon bg-[#bfdbfe] text-[#3b82f6]">notifications</span>
            <people-plus-one v-else-if="state.type == 'USER_FOLLOW'" theme="filled" size="19" fill="#8b5cf6" :strokeWidth="3" class="icon icon-user-followed bg-[#ddd6fe]" />
            <at-sign v-else-if="state.type == 'AT_SIGN'" theme="outline" size="19" fill="#ec4899" :strokeWidth="3" class="icon bg-[#fecdd3]" />
        </div>
        <div class="w-full -translate-y-1">
            <div class="brief">
                <div class="event-text">{{ brief }}</div>
                <div class="time">{{ formattedTime }}</div>
            </div>
            <div class="content">{{ content }}</div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    display: block;
    width: 2rem;
    height: 2rem;
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
</style>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { Like, Message, Share, PeoplePlusOne, AtSign } from '@icon-park/vue-next'
import { getUserInfoById } from '@/api'
import { humanizedTime } from '@/utils/formatUtils.js'
import { store } from '@/store'

const props = defineProps(['message'])

const state = reactive({
    type: props.message.type, // POST_LIKE, POST_REVIEW, POST_REPOST, SYS_NOTIFY, USER_FOLLOW AT_SIGN
    content: props.message.content,
    from: null,
    to: JSON.parse(localStorage.getItem("CUR_USER")),
    timestamp: props.message.timestamp,
    status: props.message.status
})

async function getUserInfo() {
    if (state.type == 'SYS_NOTIFY'){
        state.from = 'SYSTEM'
        return
    }

    try {
        const fromId = props.message.from
        const response = await getUserInfoById(fromId)
        if (!response.ok) throw new Error((await response.json()).error)

        state.from = await response.json()
    } catch (e) {
        store.setErrorMsg('无法获取用户信息！')
        console.error(e)
    }
}

const brief = computed(() => {
    const fromName = state.from.nickname || null
    switch (state.type) {
        case 'POST_LIKE':
            return `${fromName} 赞了您的帖子`
        case 'POST_REVIEW':
            return `${fromName} 评论了您的帖子`
        case 'POST_REPOST':
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
    return humanizedTime(state.timestamp)
})

const content=computed(()=>{
    return state.content
})

onMounted(() => {
    getUserInfo()
})
</script>