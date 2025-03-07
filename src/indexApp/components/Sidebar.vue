<template>
    <ul class="flex flex-col flex-nowrap justify-start max-lg:gap-y-2 max-sm:bg-background max-sm:border-border max-sm:border-t-[1px] max-sm:bottom-0 max-sm:flex-row max-sm:py-2">
        <li
            v-for="menu in state.menus.filter(menu => menu.visible == true)"
            :key="menu.id"
            :title="menu.name"
            :class="{ 'active': menu.active, 'mobile': menu.mobileShow }"
            class="border-0 flex flex-nowrap items-center justify-between m-[0.2rem] max-lg:py-[0.3rem] max-sm:flex-1 max-sm:flex-col max-sm:m-0 max-sm:px-0 max-sm:py-0 px-[1rem] py-3 sm:flex-row sm:rounded-full"
            @click="routeTo(menu.routeName, menu.routeParams)">
            <div
                class="content-center flex flex-nowrap gap-x-[1rem] items-center justify-between max-sm:flex-col max-sm:gap-y-[0.1rem] relative sm:flex-row">
                <div
                    v-if="menu.badgeCount"
                    class="absolute bg-red-500 dark:text-onPrimaryContainer leading-3 left-1/2 lg:hidden min-w-[1.05rem] px-[0.3rem] py-[0.15rem] rounded-full select-none text-[0.7rem] text-center text-onPrimary top-0 z-[1]">
                    {{ menu.badgeCount > 999 ? '999+' : menu.badgeCount }}
                </div>
                <div
                    v-if="menu.routeName === 'profile'"
                    class="avatar max-sm:px-4 max-sm:py-1 max-sm:rounded-full">
                    <Avatar
                        :user="state.user"
                        rounded
                        class="h-[1.7rem] max-lg:h-[1.5rem] max-lg:text-[1.5rem] max-lg:w-[1.5rem] max-sm:h-[1.25rem] max-sm:text-[1.25rem] max-sm:w-[1.25rem] rounded-full text-[1.7rem] w-[1.7rem]">
                    </Avatar>
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span v-else class="dark:text-inherit material-symbols-rounded max-lg:text-[1.5rem] max-sm:px-4 max-sm:py-1 max-sm:rounded-full max-sm:text-[1.25rem] no-hover p-0 rounded-none text-[1.75rem]">{{ menu.icon }}</span>
                <span class="btn-no-select font-bold max-sm:leading-4 max-sm:text-[0.8rem] sm:max-lg:hidden text-lg webkit-box-1">{{ menu.name }}</span>
            </div>

            <span
                v-if="menu.badgeCount > 0"
                class="bg-transparent h-[1.4rem] max-lg:hidden rounded-[4rem] text-[12pt] text-center w-[2rem]">
                {{ humanizedNumber(menu.badgeCount) }}
            </span>
        </li>
    </ul>
</template>

<style scoped>
li:not(.active):hover {
    background-color: rgb(var(--color-helper));
}

li.active {
    background-color: rgb(var(--color-primary-container));
}

@media not all and (min-width: 640px) {
    li:not(.mobile) {
        display: none;
    }

    li:not(.active):hover {
        background-color: inherit;
    }

    li.active {
        background-color: inherit;
    }

    li.active :is(.material-symbols-rounded, .avatar) {
        background-color: rgb(var(--color-primary-container));
    }

    li:not(.active) :is(.material-symbols-rounded, .avatar):hover {
        background-color: rgb(var(--color-helper));
    }
}
</style>

<script setup>
import { reactive, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { queryCurUserNotifyStatistic } from '@/indexApp/js/api.js'
import { ws } from '@/indexApp/js/websocket.js'
import Avatar from '@/components/Avatar.vue'
import { humanizedNumber } from '@/indexApp/utils/formatUtils.js'

const router = useRouter()
const route = useRoute()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)

const unreadNotifyCount = computed(() => {
    return store.NOTIFY_STATISTIC.map(it => it.unreadCount).reduce((acc, val) => acc + val, 0)
})

const state = reactive({
    menus: [
        { id: 1, name: '动态', routeName: 'index', routeParams: {}, icon: 'home', badgeCount: 0, visible: true, active: false, mobileShow: true },
        { id: 2, name: '探索', routeName: 'explore', routeParams: {}, icon: 'explore', badgeCount: 0, visible: true, active: false, mobileShow: true },
        { id: 3, name: '话题', routeName: 'hashtag', routeParams: {}, icon: 'tag', badgeCount: 0, visible: showUnImpl, active: false, mobileShow: false }, // TODO implement it.
        { id: 4, name: '消息', routeName: 'notify', routeParams: {}, icon: 'notifications', badgeCount: unreadNotifyCount, visible: true, active: false, mobileShow: true },
        { id: 5, name: '书签', routeName: 'bookmark', routeParams: {}, icon: 'bookmark', badgeCount: 0, visible: true, active: false, mobileShow: false },
        { id: 6, name: '勋章', routeName: 'badge', routeParams: {}, icon: 'local_police', badgeCount: 0, visible: showUnImpl, active: false, mobileShow: false }, // TODO implement it.
        { id: 7, name: '活动', routeName: 'activity', routeParams: {}, icon: 'celebration', badgeCount: 0, visible: showUnImpl, active: false, mobileShow: false }, // TODO implement it.
        { id: 8, name: '管理', routeName: 'manage', routeParams: {}, icon: 'memory', badgeCount: 0, visible: showUnImpl && JSON.parse(localStorage.getItem("CUR_USER")).type === 'ADMIN', active: false, mobileShow: false }, // TODO implement it.
        { id: 9, name: getCurUserNickname(), routeName: 'profile', routeParams: { nickname: getCurUserNickname() }, icon: null, badgeCount: 0, visible: true, active: false, mobileShow: true },
        { id: 10, name: '设置', routeName: 'setting', routeParams: {}, icon: 'settings', badgeCount: 0, visible: true, active: false, mobileShow: false }
    ],
    user: JSON.parse(localStorage.getItem("CUR_USER")),
})
async function routeTo(routeName, routeParams) {
    router.push({ name: routeName, params: routeParams })
}

/**
 * 切换菜单样式
 * @param {number} menuId menuId，不能为空值
 */
function activeMenu(menuId) {
    state.menus.forEach(menu => { menu.active = false })
    if (!!menuId) {
        state.menus.find(it => it.id === menuId).active = true
    }
}

async function getUnreadNotifyCount() {
    try {
        const response = await queryCurUserNotifyStatistic()
        if (!response.ok) throw new Error((await response.json()).message)

        const statistic = await response.json()
        store.setNotifyStatistic(statistic)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    }
}

watch(() => unreadNotifyCount.value, (newVal, oldVal) => {
    if (newVal <= 0) {
        navigator.clearAppBadge()
    } else {
        navigator.setAppBadge(newVal)
    }
})

function getCurUserNickname() {
    const { nickname } = JSON.parse(localStorage.getItem("CUR_USER"))
    return nickname || ''
}

watch(() => ws.connectState, function (newVal, _) {
    if (newVal == 'CONNECTED') {
        ws.subscribeTopic(`/queue/user.${state.user.id}.interact`, function (response) {
            const msgPack = JSON.parse(response.body) //TODO 对消息类型进行判断和处理，更新UI
            state.menus[2].badgeCount++
        })
    }
})

watch(() => route.fullPath, (newVal, _) => {
    // XXX 特判个人主页页面，非当前登录用户主页，不选中
    if (route.name === 'profile' && route.params?.nickname !== state.user.nickname) return

    const rootRouteName = route.meta.key || route.name
    const activeMenuId = state.menus.find(it => it.routeName === rootRouteName)?.id
    activeMenu(activeMenuId)
}, { immediate: true })

onMounted(() => {
    getUnreadNotifyCount(state.user.id)

    // router guard settings
    router.afterEach((to, from, failure) => {
        if(['notify'].includes(to.name) && !!to.meta?.title){
            document.title = `Icehub-${to.meta.title}(${unreadNotifyCount.value})`
        }
    })
})
</script>