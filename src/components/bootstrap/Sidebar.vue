<template>
    <ul class="list-group">
        <li v-for="menu in state.menus.filter(menu=>menu.visible==true)" :key="menu.id"
            @click="routeTo(menu.routeTo, menu.id, menu.routeParams.nickname || null)" :class="{ active: menu.active }"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <Avatar v-if="menu.routeTo == '/profile'" :user="state.user" :rounded="true" class="w-1.7 h-1.7 rounded-full"></Avatar>
                <span v-else class="material-icons-round no-hover">{{ menu.icon }}</span>
                <span>{{ menu.name }}</span>
            </div>

            <span class="badge rounded-pill" v-if="menu.badgeCount > 0">{{ menu.badgeCount }}</span>
        </li>

    </ul>
</template>

<style scoped>
img {
    width: 1.6rem;
    height: 1.6rem;
}

.avatar {
    border-radius: 9999rem;
}

.material-icons-round {
    font-size: 20pt;
    cursor: pointer;
    font-family: 'Material Icons Round', 'Noto Color Emoji' !important;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
}

.material-icons-round:hover {
    cursor: pointer;
    font-family: 'Material Icons Round', 'Noto Color Emoji' !important;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
}

li:hover {
    background-color: #F5F5F5;

}

.menu {
    color: #303133;
    font-size: large;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    align-content: center;
    column-gap: 1rem;
}

.active {
    background-color: #cfe2ff !important;
}

.active>.menu {
    color: black !important;
}

.active>.badge {
    background-color: #cfe2ff !important;
    color: black;
    border-radius: 4rem !important;
}

.badge {
    color: black;
    border-radius: 4rem !important;
    width: 2rem;
    height: 1.4rem;
    font-size: 12pt;
    text-align-last: center;
}

.list-group {
    width: 14%;
    position: fixed;
    left: 10%;
}

.list-group-item {
    border: 0;
    height: 3.5rem;
    border-radius: 50rem !important;
    margin: 0.2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem 0 1rem;
}

.bi {
    font-size: 14pt;
    margin-right: 1rem;
}

.font-9{
    font-size: 9pt;
}

.no-underline{
    text-decoration: none;
}

.white-text{
    color: white;
}

</style>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import router from '@/route.js'
import { store } from '@/store'
import { getUserInfoByNickname,queryCurUserUnreadNotifyCount } from '@/api.js'
import { useRoute } from 'vue-router'
import { ws } from '../../websocket.js'
import Avatar from '@/components/tailwind/Avatar.vue'

const $route = useRoute()

const state = reactive({
    menus: [
        { id: 1, name: '主页', routeTo: '/index', routeParams: {}, icon: 'home', badgeCount: 0, visible: true, active: true },
        { id: 2, name: '探索', routeTo: '/explore', routeParams: {}, icon: 'explore', badgeCount: 0, visible: true, active: false },
        { id: 3, name: '消息', routeTo: '/notify', routeParams: {}, icon: 'notifications', badgeCount: 0, visible: true, active: false },
        { id: 4, name: '书签', routeTo: '/bookmark', routeParams: {}, icon: 'bookmark', badgeCount: 0, visible: true, active: false },
        { id: 5, name: '勋章', routeTo: '/badge', routeParams: {}, icon: 'local_police', badgeCount: 0, visible: false, active: false },
        { id: 6, name: '活动', routeTo: '/activity', routeParams: {}, icon: 'celebration', badgeCount: 0, visible:false, active: false },
        { id: 7, name: '管理', routeTo: '/manage', routeParams: {}, icon: 'memory', badgeCount: 0, visible: JSON.parse(localStorage.getItem("CUR_USER")).type === 'ADMIN', active: false },
        { id: 8, name: getCurUserNickname(), routeTo: '/profile', routeParams: { nickname: getCurUserNickname() }, icon: null, badgeCount: 0, visible: true, active: false },
        { id: 9, name: '设置', routeTo: '/setting', routeParams: {}, icon: 'settings', badgeCount: 0, visible: true, active: false }
    ],
    user: JSON.parse(localStorage.getItem("CUR_USER")),
})

async function routeTo(url, mid, nickname) {
    activeMenu(mid)
    if (!nickname) {
        router.push(url)
    } else {
        await getUser(nickname)
        router.push({ name: 'profile', params: { nickname: nickname } })
    }
}

function activeMenu(menuId) {
    state.menus.forEach(menu => { menu.active = false })
    state.menus[menuId - 1].active = true
}

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).error)

        const user = await response.json()
        store.setSelectUser(user)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function getUnreadNotifyCount(){
    try{
        const response = await queryCurUserUnreadNotifyCount()
        if (!response.ok) throw new Error((await response.json()).error)

        const {unreadCount,readCount} = await response.json()
        store.setUnreadMsgCount(unreadCount)
    }catch(e){
        store.setErrorMsg(e.message)
        console.error(e) 
    }
}

watch(()=>store.UNREAD_MSG_COUNT,(newVal,oldVal)=>{
    state.menus.filter(item=>item.name == '消息')[0].badgeCount = newVal
})

function getCurUserNickname() {
    const { nickname } = JSON.parse(localStorage.getItem("CUR_USER"))
    return nickname || ''
}

function getUrlPagePath() {
    const path = window.document.location.pathname
    const pageName = path.split('/')[1]
    return pageName || 'index'
}

watch(() => ws.connectState, function (newVal, oldVal) {
    if (newVal == 'CONNECTED') {
        ws.subscribeTopic(`/queue/one/${state.user.id}/interact`, function (response) {
            const msgPack = JSON.parse(response.body) //TODO 对消息类型进行判断和处理，更新UI
            state.menus[2].badgeCount++
        })
    }
})

onMounted(() => {
    const pageName = getUrlPagePath()
    const menuItem = state.menus.filter(menu => menu.routeTo == '/' + pageName)
    const menuId = menuItem.length <= 0 ? 1 : menuItem[0].id
    activeMenu(menuId)
    getUnreadNotifyCount(state.user.id)
})

</script>