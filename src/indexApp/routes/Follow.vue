<template>
    <div id="follow">
        <Header
            class="sticky"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction">
        </Header>
        <div class="flex flex-row h-[3rem] items-center text-center">
            <div
                v-for="(menu, index) in state.menus"
                :key="menu.id"
                :index="index"
                :class="{ active: menu.isActive }"
                class="basis-full cursor-pointer flex h-full items-center justify-center w-full"
                @click="routeTo(menu.routeTo, menu.id)">
                {{ menu.name }}
            </div>
        </div>
        <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
        <router-view></router-view>
    </div>
</template>

<style scoped>
.active {
    box-sizing: content-box;
    border-bottom: 2px solid #3b82f6;
}
</style>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import { useRoute } from 'vue-router'
import router from '@/indexApp/js/route.js'
import { getUserInfoByNickname } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'

const route = useRoute()
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    user: null,
    menus: [
        { id: 1, name: '我的订阅', isActive: route.name == 'followList', routeTo: `/follow/${route.params.nickname}` },
        { id: 2, name: '订阅我的', isActive: route.name == 'fanList', routeTo: `/fan/${route.params.nickname}` },
        { id: 3, name: '共同订阅', isActive: route.name == 'coFollowingList', routeTo: `/coFollow/${route.params.nickname}` }
    ],
    headerConfig: {
        title: route.params.nickname,
        goBack: true,
        showMenu: false,
        menuIcon: null,
        menuAction: { action: 'route', param: '' },
        width: 0
    }
})

const menuText = computed(() => {
    const gender = state.user?.gender
    if (isMyself.value) return '我'
    if (gender == 'FEMALE') return '她'
    return '他'
})

const isMyself = computed(() => { return state.curUser.id == state.user.id })

function routeTo(url, id) {
    state.menus.forEach(menu => { menu.isActive = false })
    state.menus[id - 1].isActive = true
    router.push(url)
}

async function getUserInfo(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.user = result
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

onMounted(async () => {
    const username = route.params.nickname
    await getUserInfo(username)
    state.menus.forEach(menu => { menu.name = menu.name.replace('我', menuText.value) })
})
</script>