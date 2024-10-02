<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div v-if="state.user">
        <Teleport to="body">
            <CustomAppTitleBar
                v-if="store.PWA_MODE"
                class="fixed top-0 z-[1000]">
            </CustomAppTitleBar>
        </Teleport>
        <GlobalProgressIndicator
            v-if="state.showProgressIndicator"
            class="fixed z-[106]"
            :routing="state.startRoute"
            @close="closeProgressIndicator">
        </GlobalProgressIndicator>
        <GlobalNotifyBanner
            v-if="showGlobalNotifyBannerMsg"
            id="global-notify-banner"
            class="fixed"
            :class="{ 'top-0': showGlobalNotifyBannerMsg }"
            :message="store.GLOBAL_NOTIFY_BANNER_MSG"
            @close-global-notify-banner="closeGlobalNotifyBannerMsg">
        </GlobalNotifyBanner>
        <GlobalContextMenu
            v-if="state.showContextMenu"
            class="fixed z-[1000]"
            :click-x="state.click.x"
            :click-y="state.click.y">
        </GlobalContextMenu>
        <ImageSlide2
            v-if="store.SLIDE_DATA.urls.length > 0"
            class="fixed h-screen w-screen z-[1000]">
        </ImageSlide2>
        <div
            id="container"
            ref="container"
            class="flex-nowrap flex-row justify-center min-h-screen sm:flex"
            :class="{ 'mt-10': showGlobalNotifyBannerMsg }"
            @touchmove="handleScroll"
            @touchstart="touchStart"
            @wheel="handleScroll">
            <div
                id="sidebar-l"
                :class="{'main-route': isShowSidebarL, 'lg:flex-[0.7]': !isSetting, 'lg:flex-[0.7]': isSetting}"
                class="border-[#EEEEEE] dark:border-[#1e1e1e] flex flex-nowrap flex-row justify-start lg:flex-[0.75] lg:flex-col lg:gap-y-4 lg:items-end no-scrollbar sm:border-[1px] sm:h-screen sm:max-lg:justify-center sm:max-lg:w-[5rem] sm:overflow-y-scroll sm:sticky sm:top-0">
                <Brand class="lg:-translate-x-0 lg:max-w-[14rem] lg:min-w-[10rem] lg:mr-16 lg:mt-6 max-lg:border-b-[#EEEEEE] max-lg:border-b-[1px] max-lg:dark:border-b-[#1e1e1e] max-lg:fixed max-lg:w-[4rem] max-sm:hidden z-[99]"></Brand>
                <Sidebar
                    id="menu"
                    class="h-fit lg:-translate-x-0 lg:mr-12 lg:w-[14rem] max-sm:fixed max-sm:w-screen max-sm:z-[999] sm:max-lg:mt-16">
                </Sidebar>
            </div>
            <div
                id="main"
                :class="{'lg:flex-1 max-w-[64rem]': !isSetting, 'lg:flex-[1.8266]': isSetting}"
                class="max-sm:pb-[calc(0.5rem*2+0.1rem*2+1.75rem+0.8rem)] min-w-0 relative sm:max-lg:flex sm:max-lg:justify-center sm:max-lg:w-[calc(100vw-5rem)] sm:z-[1]">
                <div class="absolute flex items-start justify-center top-2 w-full z-[1999]">
                    <GlobalBanner
                        v-if="store.GLOBAL_MSG.length > 0"
                        class="fixed h-fit w-fit">
                    </GlobalBanner>
                </div>
                <div class="absolute flex items-center justify-end px-4 w-full z-[100]">
                    <Transition name="fade">
                        <BackToTop
                            v-if="state.showBackToTop"
                            id="back-to-top"
                            class="bottom-4 fixed max-sm:bottom-20 w-fit"
                            @click="backToTop">
                        </BackToTop>
                    </Transition>
                </div>
                <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
                <router-view
                    v-slot="{ Component }"
                    class="relative sm:max-lg:border-[#EEEEEE] sm:max-lg:border-x-[1px] sm:max-lg:dark:border-[#1e1e1e] sm:max-lg:max-w-[36rem] w-full">
                    <keep-alive
                        :max="8"
                        :include="['Index', 'Explore', 'Bookmark', 'Notify', 'Search', 'Profile']">
                        <component
                            :is="Component"
                            :key="routerViewKey">
                        </component>
                    </keep-alive>
                </router-view>
            </div>
            <div
                v-show="!isSetting"
                id="sidebar-r"
                class="border-[#EEEEEE] border-l-[1px] dark:border-[#1e1e1e] flex-[0.95] h-screen max-lg:hidden no-scrollbar overflow-y-scroll sticky top-0 z-0">
                <Recommend class="max-w-[25rem] p-4"></Recommend>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: bottom 0.15s ease-in-out;
}

.fade-leave-active {
    transition: bottom 0.15s ease-in-out;
}

.fade-enter-from {
    bottom: -1rem;
}

.fade-enter-to {
    bottom: 1rem;
}

.fade-leave-to {
    bottom: -1rem;
}

@media not all and (min-width: 640px) {
    #sidebar-l:not(.main-route){
        display: none;
    }
    
    #sidebar-l:not(.main-route) + #main{
        padding-bottom: 0;
    }

    #sidebar-l:not(.main-route) + #main #back-to-top{
        bottom: 1rem;
    }

    .fade-enter-to {
        bottom: 5rem;
    }
}
</style>

<script setup>
import { computed, onMounted, onUnmounted, reactive, watch, defineAsyncComponent, ref, nextTick, provide } from 'vue'
import Sidebar from '@/indexApp/components/Sidebar.vue'
import Recommend from '@/indexApp/components/Recommend.vue'
import Brand from '@/indexApp/components/Brand.vue'
import { getCurUserInfo } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { ws } from '@/indexApp/js/websocket.js'
import { useRoute, useRouter } from 'vue-router'
import { NavigationFailureType, isNavigationFailure } from 'vue-router'
import GlobalProgressIndicator from '@/components/GlobalProgressIndicator.vue'
import BackToTop from '@/indexApp/components/BackToTop.vue'
import { isType } from '@/indexApp/utils/formatUtils.js'
const GlobalNotifyBanner = defineAsyncComponent(() => import('@/components/GlobalNotifyBanner.vue'))
const GlobalBanner = defineAsyncComponent(() => import('@/components/GlobalBanner.vue'))
const GlobalNetworkOffPage = defineAsyncComponent(() => import('@/components//GlobalNetworkOffPage.vue')) /*Don't delete this due to package included*/
const ImageSlide2 = defineAsyncComponent(() => import('@/indexApp/components/ImageSlide2.vue'))
const GlobalContextMenu = defineAsyncComponent(() => import('@/components/GlobalContextMenu.vue'))
const CustomAppTitleBar = defineAsyncComponent(() => import('@/components/CustomAppTitleBar.vue'))

const route = useRoute()
const router = useRouter()
const container = ref()
const state = reactive({
    user: undefined,
    globalNotifyBannerMsg: store.GLOBAL_NOTIFY_BANNER_MSG,
    startRoute: false,
    showProgressIndicator: false,
    timeoutId: 0,
    showBackToTop: false,
    touchStartClientY: 0,
    mobileMediaQueryList: undefined,
    themeMediaQueryList: undefined,
    showContextMenu: false,
    click: {x: 20, y: 20}
})

async function curUser() {
    try {
        const response = await getCurUserInfo()
        if (response.status === 401) throw new Error('Not Login!')
        if(!response.ok) throw new Error(await response.json())

        state.user = await response.json()
        const user = JSON.stringify(state.user)
        localStorage.setItem('CUR_USER', user)
    } catch (e) {
        store.setErrorMsg(e.message)
        if(e.message === 'Not Login!'){
            localStorage.removeItem('CUR_USER')
            location = `${window.origin}/auth.html?url=${btoa(encodeURIComponent(window.location.pathname))}`
        }
    }
}

const showGlobalNotifyBannerMsg = computed(() => {
    return !!store.GLOBAL_NOTIFY_BANNER_MSG
})

function closeGlobalNotifyBannerMsg() {
    state.globalNotifyBannerMsg = ''
    store.clearGlobalNotifyBannerMsg()
}

function disconnectToWs() {
    if (state.user == null) return
    ws.disconnectWebsocket()
}

watch(() => state.user, (newVal, oldVal) => {
    if (newVal != null && newVal != oldVal) {
        ws.initWebsocket()
        ws.connectWebsocket(state.token)
    }
})

watch(() => ws.connectState, function (newVal, oldVal) {
    if (newVal == oldVal) return
    if (newVal == 'CONNECTED') {
        ws.subscribeTopic(`/topic/public.notify`, function (message) {
            const result = message.body
            store.setGlobalNotifyBannerMsg(result)
            state.globalNotifyBannerMsg = result
        }, { ack: 'client' })
    }
    if (newVal == 'CONNECTED_FAILED') {
        store.setGlobalNotifyBannerMsg({ type: 'SYS_NOTIFY_WARNING', msg: '您的网络连接似乎存在问题，正在尝试重新连接...' })
        ws.reconnectWebsocket(state.token)
    }
    if (newVal == 'MAX_TRY_RECONNECT') {
        store.setGlobalNotifyBannerMsg({ type: 'SYS_NOTIFY_ERROR', msg: '您的网络连接存在问题，建议您刷新重试!' })
        console.error('[Websocket]Reconnect count is over limit, connect failed!')
    }
    if (newVal == 'DISCONNECTED') {
        console.warn('[Websocket]You have already actively disconnected, can not reconnect.')
        store.setGlobalNotifyBannerMsg({ type: 'SYS_NOTIFY_ERROR', msg: '您已主动断开网络连接!' })
    }
    if (newVal == 'CONNECTED' && oldVal == 'CONNECTED_FAILED') {
        console.warn('[Websocket]You have already connected, no need to reconnect.')
        store.setGlobalNotifyBannerMsg({ type: 'SYS_NOTIFY_SUCCESS', msg: '网络连接已恢复正常!' })
        setTimeout(function () { store.clearGlobalNotifyBannerMsg() }, 2000)
    }
})

/**
 * 移动模式下，判断是否显示底部菜单栏
 */
const mainRouteSet = new Set(['index', 'explore', 'notify', 'profile'])
const isShowSidebarL = computed(() => {
    // XXX 特判，待改进
    if(route.name === 'profile' && route.params?.nickname !== state.user.nickname) return false
    return mainRouteSet.has(route.name) || mainRouteSet.has(route.meta.key)
})

function closeProgressIndicator() {
    state.timeoutId = setTimeout(() => {
        state.showProgressIndicator = false
    }, 1100);
}

function backToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    state.showBackToTop = false
}

function handleScroll(e) {
    let dy = 0
    if (isType(e, TouchEvent)) {
        dy = e.changedTouches.item(0).clientY - state.touchStartClientY
    } else if (isType(e, WheelEvent)) {
        dy = e.wheelDeltaY
    }

    if (dy === 0) return
    state.showBackToTop = dy > 0 && container.value.scrollHeight > window.innerHeight && window.scrollY > 0
}

function touchStart(e) {
    state.touchStartClientY = e.touches.item(0).clientY
}

function handleMobileMediaChange(mq) {
    store.setMobileMode(mq.matches)
}

function handleThemeMediaChange(mq) {
    store.setSysThemeMode(mq.matches ? 'dark' : 'light')
    if(!('theme' in localStorage)){
        document.body.setAttribute('theme', store.SYS_THEME_MODE)
    }
}

function handleContextMenu(e){
    e.preventDefault()
    state.showContextMenu = true
    state.click.x = e.clientX
    state.click.y = e.clientY
}

function dismissContextMenu(){
    state.showContextMenu = false
}

watch(() => route.query?.url, (url, _) => {
    window.location = `${window.location.origin}${decodeURIComponent(atob(url))}`
}, {once: true})

const isSetting = computed(() => {
    return route.meta.key === 'setting'
})

const routerViewKey = computed(() => {
    const suffix = `/${Object.values(route.params).join('/')}`
    if(!!route.meta.key) return `${route.meta.key}${suffix}`
    else return route.name
})

onMounted(() => {
    const url = window.document.location.search
        .substring(1)
        .split('&')
        .find(it => it.substring(0, it.indexOf('=')) === 'url')
    if(!!url) return
    
    nextTick(() => { curUser() })

    // router guard settings
    router.beforeEach((to, from) => {
        state.showProgressIndicator = true
        state.startRoute = true
    })
    router.afterEach((to, from, failure) => {
        state.startRoute = false
        if (failure && !isNavigationFailure(failure, NavigationFailureType.duplicated)) {
            store.setErrorMsg('无法加载页面，您可以刷新重试！')
        }
    })

    // Media query mobile mode settings
    state.mobileMediaQueryList = window.matchMedia('not all and (min-width: 640px)')
    handleMobileMediaChange(state.mobileMediaQueryList)
    state.mobileMediaQueryList.addEventListener('change', handleMobileMediaChange)

    // PWA standalone mode settings
    store.setPwaMode(!window.matchMedia('(display-mode: browser)').matches)
    if (store.PWA_MODE) {
        document.body.addEventListener('contextmenu', handleContextMenu)
    }

    // Media query theme mode settings
    state.themeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)')
    handleThemeMediaChange(state.themeMediaQueryList)
    state.themeMediaQueryList.addEventListener('change', handleThemeMediaChange)
})

onUnmounted(() => {
    disconnectToWs()
    clearTimeout(state.timeoutId)
    state.mobileMediaQueryList.removeEventListener('change', handleMobileMediaChange)
    state.themeMediaQueryList.removeEventListener('change', handleThemeMediaChange)
    document.body.removeEventListener('contextmenu', handleContextMenu)
})

provide('dismissContextMenu', {dismissContextMenu})
</script>