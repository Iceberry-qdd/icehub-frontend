<template>
    <div id="notify">
        <Header
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
            <div
                id="footer"
                class="flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
                <IconLoading
                    v-if="hasMore || state.loading == true"
                    class="h-5 text-slate-500 w-5">
                </IconLoading>
                <span v-else>没有更多了</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    display: block;
    width: 2rem;
    height: 2rem;
}

.unread {
    background-color: #eff6ff;
}

.icon-post-like {
    background-color: #fecaca;
}

.icon-post-review {
    background-color: #fed7aa;
}

.icon-post-repost {
    background-color: #d1e7dd;
}

.icon-sys-notify {
    color: #3b82f6;
    background-color: #bfdbfe;
}

.icon-user-followed {
    background-color: #ddd6fe;
}

.icon-at-sign {
    background-color: #fecdd3;
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
import Header from '@/indexApp/components/Header.vue'
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import NotifyCard from '@/indexApp/components/notify/NotifyCard.vue'
import { getUsersNotifyList, markNotifyRead, markAllNotifyRead } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

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
    loading: false,
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
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            fetchNotify()
        }, 1000)
    }
}

async function fetchNotify() {
    state.loading = true
    try {
        const response = await getUsersNotifyList(state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.messages.push(...content)
        state.totalPages = totalPages

        if (content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].timestamps
        }
    } catch (e) {
        store.setErrorMsg("无法获取消息列表！")
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function ackMessage(messageId) {
    try {
        const response = await markNotifyRead(messageId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result == false) { throw new Error("无法设置消息状态！") }
        state.messages.filter(message => message.id == messageId)[0].read = true
        const lastUnreadCount = store.UNREAD_MSG_COUNT
        store.setUnreadMsgCount(lastUnreadCount - 1)
        return true
    } catch (e) {
        store.setErrorMsg("无法设置消息状态！")
        console.error(e)
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
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        state.messages.forEach(it => it.read = true)
        store.setUnreadMsgCount(0)
        store.setSuccessMsg(`已将${result}条消息设为已读`)
    } catch (e) {
        store.setErrorMsg("无法设置消息状态！")
        console.error(e)
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
    window.addEventListener('scroll', fetchNewList)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewList)
})
</script>