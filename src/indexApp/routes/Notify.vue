<template>
    <div id="notify">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>

        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="markAllNotifyReadOfCurUser">
            </ConfirmDialogBox>
        </Teleport>

        <div id="container">
            <div id="notify-cards">
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
            </div>
            <Footer
                :is-loading="state.isLoading"
                :has-more="hasMore"
                @fetch-more="fetchNewList">
            </Footer>
        </div>
    </div>
</template>

<script setup>
import Header from '@/indexApp/components/Header.vue'
import { computed, onMounted, reactive } from 'vue'
import NotifyCard from '@/indexApp/components/notify/NotifyCard.vue'
import { getUsersNotifyList, markNotifyRead, markAllNotifyRead } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import Footer from '@/indexApp/components/Footer.vue'

const router = useRouter()
const state = reactive({
    headerConfig: {
        title: '消息',
        goBack: false,
        showMenu: true,
        menuIcon: 'checklist',
        width: 0,
        iconTooltip: '全部已读'
    },
    messages: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: new Date().getTime(),
    totalPages: 0,
    isLoading: false,
    confirmBDialogUi: {
        show: false,
        title: '确定要已读全部消息吗？(已读后不可撤回)',
        confirmButton: {
            text: '全部已读',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '取消',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '正在将全部消息设为已读...',
            color: 'rgb(239 68 68)'
        }
    },
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
        const response = await getUsersNotifyList(state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).message)

        const { content, totalPages } = await response.json()
        state.messages.push(...content)
        state.totalPages = totalPages

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].timestamps
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
        state.messages.filter(message => message.id == messageId)[0].read = true
        const lastUnreadCount = store.UNREAD_MSG_COUNT
        store.setUnreadMsgCount(lastUnreadCount - 1)
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
            break
        case 'REVIEW':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId } })
            break
        case 'REVIEW_LIKE':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId } })
            break
        case 'REPOST':
            contentId = message.content.id
            router.push({ name: 'postDetail', params: { id: contentId } })
            break
        case 'USER_FOLLOW':
            contentId = message.content.nickname
            router.push({ name: 'profile', params: { nickname: contentId } })
            return
        default:
            break
    }
}

async function markAllNotifyReadOfCurUser({ choice }) {
    try {
        state.confirmBDialogUi.loading.show = true
        if (choice != 'confirm') return
        if (store.UNREAD_MSG_COUNT <= 0) {
            store.setWarningMsg(`所有消息已全部已读！`)
            state.confirmBDialogUi.show = false
            return
        }

        const response = await markAllNotifyRead()
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.messages.forEach(it => it.read = true)
        store.setUnreadMsgCount(0)
        store.setSuccessMsg(`已将${result}条消息设为已读`)
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.confirmBDialogUi.loading.show = false
        state.confirmBDialogUi.show = false
    }
}

function handleAction() {
    state.confirmBDialogUi.show = true
}

onMounted(() => {
    fetchNotify()
})
</script>