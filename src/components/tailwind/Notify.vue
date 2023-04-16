<template>
    <div>
        <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"></Header>

        <div id="container">
            <div id="notify-cards">
                <NotifyCard v-for="(msg,index) in state.message" :key="index" :message="msg"></NotifyCard>
            </div>
            <div id="footer" class="w-full h-[10vh] flex flex-row justify-center pt-4 text-sm text-gray-500">
                <IconLoading v-if="hasMore" class="h-5 w-5 text-slate-500"></IconLoading>
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

const state = reactive({
    headerConfig: {
        title: '消息',
        goBack: false,
        showMenu: false,
        menuIcon: 'create',
        menuAction: { action: 'route', param: '/profile/edit' }
    },
    message: [
        { id: 1, type: 'POST_LIKE', content: '3b3ccc6e-c0ae-40e9-a8f7-04806e8a72c3', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'UNREAD' },
        { id: 2, type: 'POST_REVIEW', content: '820fa7e9-bde4-40fe-95e9-ac380eec1c03', from: '765f8c26-752d-428f-9528-e44ff07a0856', timestamp: 1681036009006, status: 'UNREAD' },
        { id: 3, type: 'POST_REPOST', content: 'f336e522-ed21-4919-8498-8b6f555331a0', from: '765f8c26-752d-428f-9528-e44ff07a0856', timestamp: 1681036009006, status: 'UNREAD' },
        { id: 4, type: 'SYS_NOTIFY', content: '您的等级已经提升为2级，快来戳详情>>', from: null, timestamp: 1681036009006, status: 'UNREAD' },
        { id: 12, type: 'USER_FOLLOW', content: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 14, type: 'AT_SIGN', content: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 5, type: 'POST_LIKE', content: '1459f060-d8f3-4988-93d3-f6988e9e7143', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 6, type: 'POST_LIKE', content: '02816b44-1106-47dd-afa6-2932041dd911', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 7, type: 'POST_LIKE', content: 'e1dad992-1453-486f-8da8-21b2b41ecd98', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 8, type: 'POST_REVIEW', content: '820fa7e9-bde4-40fe-95e9-ac380eec1c03', from: '765f8c26-752d-428f-9528-e44ff07a0856', timestamp: 1681036009006, status: 'READ' },
        { id: 9, type: 'POST_LIKE', content: '02816b44-1106-47dd-afa6-2932041dd911', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' },
        { id: 10, type: 'SYS_NOTIFY', content: '您的等级已经提升为1级，快来戳详情>>', from: null, timestamp: 1681036009006, status: 'READ' },
        { id: 11, type: 'POST_LIKE', content: '1459f060-d8f3-4988-93d3-f6988e9e7143', from: '29ee97d9-a1c6-4b4b-b103-5a8268afbeaf', timestamp: 1681036009006, status: 'READ' }
    ],
    pageIndex: 1,
    pageSize: 10,
    totalPages: 0,
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
            fetchNewNotify()
        }, 1000)
    }
}

async function fetchNewNotify(){
    
}

onMounted(()=>{
    window.addEventListener('scroll', fetchNewList)
})

onUnmounted(()=>{
    window.removeEventListener('scroll', fetchNewList)
})
</script>