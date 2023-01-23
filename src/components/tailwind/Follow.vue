<template>
    <Header :title="state.headerConfig.title" :goBack="state.headerConfig.goBack"
        :showMenu="state.headerConfig.showMenu" :menuIcon="state.headerConfig.menuIcon"
        :menuAction="state.headerConfig.menuAction"></Header>
    <div class="flex flex-row text-center h-[3rem] items-center">
        <div v-for="(menu, index) in state.menus" :index="index" :key="menu.id" :class="{ active: menu.isActive }"
            @click="routeTo(menu.routeTo, menu.id)"
            class=" basis-full cursor-pointer h-full w-full flex items-center justify-center">{{ menu.name }}</div>
    </div>
    <router-view></router-view>
</template>

<style scoped>
.active {
    box-sizing: content-box;
    border-bottom: 2px solid #3b82f6;
}
</style>

<script setup>
import { reactive } from 'vue';
import Header from '@/components/tailwind/Header.vue'
import { useRoute } from 'vue-router';
import router from '@/route.js'

const $route = useRoute()

const state = reactive({
    menus: [
        { id: 1, name: '我的订阅', isActive: $route.name == 'followingList', routeTo: `/following/${$route.params.nickname}` },
        { id: 2, name: '订阅我的', isActive: $route.name == 'followerList', routeTo: `/follower/${$route.params.nickname}` },
        { id: 3, name: '共同订阅', isActive: $route.name == 'coFollowingList', routeTo: `/coFollow/${$route.params.nickname}` }
    ],
    headerConfig: {
        title: $route.params.nickname,
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' }
    }
})

function routeTo(url, id) {
    state.menus.forEach(menu => { menu.isActive = false })
    state.menus[id - 1].isActive = true
    router.push(url)
}
</script>