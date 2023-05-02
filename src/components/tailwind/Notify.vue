<template>
    <div>
        <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>

        <div id="container">
            <div id="notify-cards">
                <NotifyCard v-for="(msg,index) in state.message" :key="index" :message="msg" @click="routeTo(msg)"></NotifyCard>
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
import {getUsersNotifyList} from '@/api.js'
import { store } from '@/store'
import router from '@/route'

const state = reactive({
    headerConfig: {
        title: '消息',
        goBack: false,
        showMenu: false,
        menuIcon: 'create',
        menuAction: { action: 'route', param: '/profile/edit' }
    },
    message: [],
    pageIndex: 1,
    pageSize: 10,
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
            state.pageIndex++
            fetchNotify()
        }, 1000)
    }
}

async function fetchNotify(){
    state.loading=true
    try{
        const response = await getUsersNotifyList(state.pageIndex,state.pageSize)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.message.push(...content)
        state.totalPages = totalPages
    } catch (e) {
        store.setErrorMsg("无法获取消息列表！")
        console.error(e)
    }finally{
        state.loading = false
    }
}

function routeTo(message){
    let contentId = message.content.id
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