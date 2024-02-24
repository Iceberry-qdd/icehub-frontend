<template>
    <ul class="fixed left-[10%] w-[14%]">
        <li
            v-for="menu in state.menus.filter(menu => menu.visible == true)"
            :key="menu.id"
            :class="{ 'bg-[#cfe2ff]': menu.active }"
            class="border-0 flex flex-nowrap flex-row h-[3.5rem] hover:bg-[#F5F5F5] items-center justify-between m-[0.2rem] px-[1rem] py-0 rounded-full"
            @click="routeTo(menu.routeTo, menu.id, menu.routeParams.nickname || null)">
            <div
                class="content-center flex flex-nowrap flex-row font-bold gap-x-[1rem] items-center justify-between text-[#303133] text-lg">
                <Avatar
                    v-if="menu.routeTo == '/profile'"
                    :user="state.user"
                    rounded
                    class="h-[1.7rem] rounded-full text-[1.7rem] w-[1.7rem]">
                </Avatar>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span v-else class="material-icons-round no-hover p-0 rounded-none">{{ menu.icon }}</span>
                <span class="btn-no-select">{{ menu.name }}</span>
            </div>

            <span
                v-if="menu.badgeCount > 0"
                class="bg-transparent h-[1.4rem] rounded-[4rem] text-[12pt] text-black text-center w-[2rem]">
                {{ humanizedNumber(menu.badgeCount) }}
            </span>
        </li>
    </ul>
</template>

<style scoped>
.material-icons-round {
    font-size: 20pt;
}
</style>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { getUserInfoByNickname, queryCurUserUnreadNotifyCount } from '@/indexApp/js/api.js'
import { ws } from '@/indexApp/js/websocket.js'
import Avatar from '@/components/Avatar.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'

const router = useRouter()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    menus: [
        { id: 1, name: '主页', routeTo: '/index', routeParams: {}, icon: 'home', badgeCount: 0, visible: true, active: true },
        { id: 2, name: '探索', routeTo: '/explore', routeParams: {}, icon: 'explore', badgeCount: 0, visible: true, active: false },
        { id: 3, name: '话题', routeTo: '/hashtag', routeParams: {}, icon: 'tag', badgeCount: 0, visible: showUnImpl, active: false }, // TODO implement it.
        { id: 4, name: '消息', routeTo: '/notify', routeParams: {}, icon: 'notifications', badgeCount: 0, visible: true, active: false },
        { id: 5, name: '书签', routeTo: '/bookmark', routeParams: {}, icon: 'bookmark', badgeCount: 0, visible: true, active: false },
        { id: 6, name: '勋章', routeTo: '/badge', routeParams: {}, icon: 'local_police', badgeCount: 0, visible: showUnImpl, active: false }, // TODO implement it.
        { id: 7, name: '活动', routeTo: '/activity', routeParams: {}, icon: 'celebration', badgeCount: 0, visible: showUnImpl, active: false }, // TODO implement it.
        { id: 8, name: '管理', routeTo: '/manage', routeParams: {}, icon: 'memory', badgeCount: 0, visible: showUnImpl && JSON.parse(localStorage.getItem("CUR_USER")).type === 'ADMIN', active: false }, // TODO implement it.
        { id: 9, name: getCurUserNickname(), routeTo: '/profile', routeParams: { nickname: getCurUserNickname() }, icon: null, badgeCount: 0, visible: true, active: false },
        { id: 10, name: '设置', routeTo: '/setting', routeParams: {}, icon: 'settings', badgeCount: 0, visible: showUnImpl, active: false } // TODO implement it.
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

async function getUnreadNotifyCount() {
    try {
        const response = await queryCurUserUnreadNotifyCount()
        if (!response.ok) throw new Error((await response.json()).error)

        const { unreadCount, readCount } = await response.json()
        store.setUnreadMsgCount(unreadCount)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

watch(() => store.UNREAD_MSG_COUNT, (newVal, oldVal) => {
    state.menus.filter(item => item.name == '消息')[0].badgeCount = newVal
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
        ws.subscribeTopic(`/queue/user.${state.user.id}.interact`, function (response) {
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