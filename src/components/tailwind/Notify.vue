<template>
    <div id="notify">
        <Header
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>

        <div id="container">
            <div id="notify-cards">
                <div v-for="(msg,index) in state.messages" :key="index" class="relative">
                    <div class="absolute w-full h-full bg-transparent z-[96] cursor-pointer" @click.self="AckMsgAndRouteTo(msg)"></div>
                    <NotifyCard :message="msg"></NotifyCard>
                </div>
            </div>
            <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
                <IconLoading v-if="hasMore || state.loading == true" class="h-5 w-5 text-slate-500"></IconLoading>
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

.unread{
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

.icon-user-followed{
    background-color: #ddd6fe;
}

.icon-at-sign{
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
import Header from '@/components/tailwind/Header.vue'
import { computed, onMounted, onUnmounted, reactive } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import NotifyCard from '@/components/tailwind/NotifyCard.vue'
import {getUsersNotifyList,markNotifyRead} from '@/api.js'
import { store } from '@/store'
import router from '@/route'

const state = reactive({
    headerConfig: {
        title: '消息',
        goBack: false,
        showMenu: false,
        menuIcon: 'cleaning_services',
        menuAction: { action: 'route', param: '/profile/edit' },
        width: 0
    },
    messages: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp:new Date().getTime(),
    totalPages: 0,
    loading:false
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

async function fetchNotify(){
    state.loading=true
    try{
        const response = await getUsersNotifyList(state.pageIndex,state.pageSize,state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.messages.push(...content)
        state.totalPages = totalPages

        if(content.length>1) {
            state.lastTimestamp = content.slice(-1)[0].timestamps
        }
    } catch (e) {
        store.setErrorMsg("无法获取消息列表！")
        console.error(e)
    }finally{
        state.loading = false
    }
}

async function ackMessage(messageId){
    try{
        const response = await markNotifyRead(messageId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if(result==false){throw new Error("无法设置消息状态！")}
        state.messages.filter(message=>message.id == messageId)[0].read = true
        const lastUnreadCount = store.UNREAD_MSG_COUNT
        store.setUnreadMsgCount(lastUnreadCount - 1)
        return true
    }catch(e){
        store.setErrorMsg("无法设置消息状态！")
        console.error(e)
        return false
    }
}

async function AckMsgAndRouteTo(message){
    let contentId = message.content.id
    let isAck = false
    if(!message.read){ isAck = await ackMessage(message.id) }
    if(!isAck && !message.read) return

    switch (message.type) {
        case 'POST_LIKE':
            contentId = message.content.id
            router.push({ name: 'postDetail', params: { id: contentId }})
            break
        case 'REVIEW':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId }})
            break
        case 'REVIEW_LIKE':
            contentId = message.content.postId
            router.push({ name: 'postDetail', params: { id: contentId }})
            break
        case 'REPOST':
            contentId = message.content.id
            router.push({ name: 'postDetail', params: { id: contentId }})
            break
        case 'USER_FOLLOW':
            contentId = message.content.nickname
            router.push({ name: 'profile', params: { nickname: contentId } })
            return
        default:
            break
    }
}

onMounted(()=>{
    fetchNotify()
    window.addEventListener('scroll', fetchNewList)
})

onUnmounted(()=>{
    window.removeEventListener('scroll', fetchNewList)
})
</script>