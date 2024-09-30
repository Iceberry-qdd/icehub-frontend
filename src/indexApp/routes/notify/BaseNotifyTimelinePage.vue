<template>
    <div>
        <div
            v-for="(msg, index) in state.messages"
            :key="index"
            class="relative">
            <div
                class="absolute bg-transparent cursor-pointer h-full w-full z-[96]"
                @click.self="AckMsgAndRouteTo(msg)" />
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <NotifyCard v-if="msg.from && msg.content" :message="msg"></NotifyCard>
        </div>
        <Footer
            :is-loading="state.isLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewList">
        </Footer>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import NotifyCard from '@/indexApp/components/notify/NotifyCard.vue'
import { getUsersNotifyList, markNotifyRead } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import Footer from '@/indexApp/components/Footer.vue'

const router = useRouter()
const props = defineProps({
    /** 消息类型 */
    types: {
        type: Array,
        required: false,
        default: new Array()
    }
})
const state = reactive({
    messages: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    isLoading: false,

})

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

function fetchNewList() {
    fetchNotify()
}

async function fetchNotify() {
    state.isLoading = true
    try {
        const response = await getUsersNotifyList(state.pageIndex, state.pageSize, state.lastTimestamp, props.types)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.messages.push(...content)
        state.totalPages = totalPages

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1).at(0).timestamps
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.isLoading = false
    }
}

async function ackMessage(messageId) {
    try {
        const response = await markNotifyRead(messageId)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) { throw new Error("无法设置消息状态！") }
        
        const readMsg = state.messages.find(it => it.id === messageId)
        readMsg.read = true
        store.incrNotifyUnreadCountByType({ type: readMsg.type, delta: -1 })
        return true
    } catch (e) {
        store.setErrorMsg(e.message)
        return false
    }
}

async function AckMsgAndRouteTo(message) {
    let contentId = message.content.id
    let isAck = false
    if (!message.read) { isAck = await ackMessage(message.id) }
    if (!isAck && !message.read) return

    switch (message.type) {
        case 'POST_LIKE':
            contentId = message.content.id
            router.push({ name: 'postDetail', params: { id: contentId } })
            return
        case 'REVIEW':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId } })
            return
        case 'REVIEW_LIKE':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId } })
            return
        case 'REPOST':
            contentId = message.content.id
            router.push({ name: 'postDetail', params: { id: contentId } })
            return
        case 'USER_FOLLOW':
            contentId = message.content.nickname
            router.push({ name: 'profile', params: { nickname: contentId } })
            return
        default:;
    }
}

function markReadByTypesOnUi(types = []) {
    if (!types || types.length == 0) {
        state.messages.forEach(it => it.read = true)
        return
    }
    state.messages.filter(it => types.includes(it.type)).forEach(it => it.read = true)
}

defineExpose({
    markReadByTypesOnUi
})

onMounted(() => {
    fetchNotify()
})
</script>