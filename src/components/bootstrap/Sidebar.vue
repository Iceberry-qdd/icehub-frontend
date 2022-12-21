<template>
    <ul class="list-group">
        <li v-for="menu in state.menus" :key="menu.id" @click="routeTo(menu.routeTo, menu.id)"
            :class="{ active: menu.active }"
            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
            <div class="menu">
                <img v-if="(menu.id == 8)" :src="menu.icon" />
                <span v-else class="material-icons-round">{{ menu.icon }}</span>{{ menu.name }}
            </div>

            <span class="badge bg-primary rounded-pill" v-if="menu.badgeCount > 0">{{ menu.badgeCount }}</span>
        </li>

    </ul>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Icons+Round");

img {
    max-width: 1.6rem;
    height: auto;
}

.material-icons-round {
    font-size: 20pt;
    cursor: pointer;
    font-family: 'Material Icons Round','Noto Color Emoji' !important;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
}

.material-icons-round:hover{
    cursor: pointer;
    font-family: 'Material Icons Round','Noto Color Emoji' !important;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
}

li:hover {
    background-color: #F5F5F5;

}

.menu {
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
    background-color: #3b82f6 !important;
    color: white;
    border-radius: 4rem !important;
    width: 2rem;
    height: 1.4rem;
    font-size: 12pt;
    text-align-last: center;
}

.list-group {
    width: 14%;
    position: fixed;
    left: 15%;
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
</style>

<script setup>
import { reactive } from 'vue';
import router from '../../route.js'

const state = reactive({
    menus: [
        { id: 1, name: '主页', routeTo: '/index', icon: 'home', badgeCount: 12, visible: true, active: true },
        { id: 2, name: '探索', routeTo: '/explore', icon: 'explore', badgeCount: 1, visible: true, active: false },
        { id: 3, name: '书签', routeTo: '/bookmark', icon: 'bookmark', badgeCount: 0, visible: false, active: false },
        { id: 4, name: '钱包', routeTo: '/wallet', icon: 'wallet', badgeCount: 0, visible: true, active: false },
        { id: 5, name: '勋章', routeTo: '/badge', icon: 'local_police', badgeCount: 0, visible: true, active: false },
        { id: 6, name: '活动', routeTo: '/activity', icon: 'celebration', badgeCount: 0, visible: true, active: false },
        { id: 7, name: '管理', routeTo: '/manage', icon: 'memory', badgeCount: 0, visible: true, active: false },
        { id: 8, name: getCurUserNickname(), routeTo: '/profile', icon: getCurUserAvatar(), badgeCount: 0, visible: true, active: false },
        { id: 9, name: '设置', routeTo: '/setting', icon: 'settings', badgeCount: 0, visible: true, active: false }
    ]
})

function routeTo(url, id) {
    state.menus.forEach(menu => { menu.active = false })
    state.menus[id - 1].active = true
    router.push(url)
}

function getCurUserNickname() {
    try {
        return (JSON.parse(localStorage.getItem("CUR_USER"))).nickname
    } catch (error) {
        return '个人资料'
    }

}

function getCurUserAvatar() {
    try {
        const avatar = (JSON.parse(localStorage.getItem("CUR_USER"))).avatarUrl
        const nickname = (JSON.parse(localStorage.getItem("CUR_USER"))).nickname

        if (!avatar || avatar == '') {
            return `https://api.multiavatar.com/${nickname}.svg`
        } else {
            return avatar
        }
    } catch (e) {
        return ''
    }
}

</script>