<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div v-if="state.user">
        <GlobalProgressIndicator
            v-if="state.showProgressIndicator"
            class="fixed"
            :routing="state.startRoute"
            @close="closeProgressIndicator">
        </GlobalProgressIndicator>
        <GlobalNotifyBanner
            v-if="isShowGlobalNotifyBannerMsg"
            id="global-notify-banner"
            class="fixed"
            :class="{ 'top-0': isShowGlobalNotifyBannerMsg }"
            :message="store.GLOBAL_NOTIFY_BANNER_MSG"
            @close-global-notify-banner="closeGlobalNotifyBannerMsg">
        </GlobalNotifyBanner>
        <ImageSlide2 v-if="store.SLIDE_DATA.urls.length > 0"></ImageSlide2>
        <div
            id="container"
            ref="container"
            :class="{ 'margin-top-10': isShowGlobalNotifyBannerMsg }"
            @wheel="handleScroll">
            <GlobalBanner v-if="store.GLOBAL_MSG.length > 0"></GlobalBanner>
            <div
                v-if="state.basis[0] > 0"
                id="sidebar-l"
                :style="{ 'flex-basis': state.basis[0] + '%' }">
                <Brand></Brand>
                <Sidebar id="menu"></Sidebar>
            </div>
            <div
                v-if="state.basis[1] > 0"
                id="main"
                class="relative"
                :style="{ 'flex-basis': `${state.basis[1]}%` }">
                <Transition name="fade">
                    <BackToTop
                        v-if="state.showBackToTop"
                        :style="backToTopStyle"
                        class="-translate-x-[calc(100%+1rem)] bottom-4 fixed z-[100]"
                        @click="backToTop">
                    </BackToTop>
                </Transition>
                <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
                <router-view v-slot="{ Component }">
                    <keep-alive
                        :max="8"
                        :include="['Index', 'Explore', 'Bookmark', 'Notify', 'Search', 'Profile']">
                        <component
                            :is="Component"
                            :key="route.fullPath">
                        </component>
                    </keep-alive>
                </router-view>
            </div>
            <div
                v-if="state.basis[2] > 0"
                id="sidebar-r"
                :style="{ 'flex-basis': `${state.basis[2]}%` }">
                <Recommend class="mr-20 p-4"></Recommend>
            </div>
        </div>
    </div>
</template>

<style scoped>
#menu {
    margin: 6rem 0rem 0 0;
}

#container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    min-height: 100vh;
}

.margin-top-10 {
    margin-top: 2.5rem;
}

#sidebar-l {
    border-right: 1px solid #EEEEEE;
    overflow-x: hidden;
}

#sidebar-r {
    border-left: 1px solid #EEEEEE;
    overflow: hidden scroll;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 0;
    overflow-x: hidden;
}

#main {
    min-width: 0;
    z-index: 1;
    overflow-x: hidden;
}

.mr-20 {
    margin-right: 5rem
        /* 80px */
    ;
}

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

#sidebar-r::-webkit-scrollbar {
    width: 0 !important;
    height: 100% !important;
    -webkit-appearance: none;
}

#sidebar-r::-webkit-scrollbar-thumb {
    width: 6px !important;
    -webkit-appearance: none;
}
</style>

<script setup>
import { computed, onMounted, onUnmounted, reactive, watch, defineAsyncComponent, ref } from 'vue'
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
const GlobalNotifyBanner = defineAsyncComponent(() => import('@/components/GlobalNotifyBanner.vue'))
const GlobalBanner = defineAsyncComponent(() => import('@/components/GlobalBanner.vue'))
const ImageSlide2 = defineAsyncComponent(() => import('@/indexApp/components/ImageSlide2.vue'))

const route = useRoute()
const router = useRouter()
const container = ref()
const state = reactive({
    user: null,
    globalNotifyBannerMsg: store.GLOBAL_NOTIFY_BANNER_MSG,
    basis: [40, 50, 40],
    startRoute: false,
    showProgressIndicator: false,
    timeoutId: 0,
    token: localStorage.getItem('TOKEN'),
    showBackToTop: false
})

const backToTopStyle = computed(() => {
    const totalBasis = state.basis.reduce((sum, item) => sum + item, 0)
    const leftBasis = state.basis[0] + state.basis[1]
    return {
        'left': `${(leftBasis / totalBasis) * 100}%`
    }
})

async function curUser() {
    try {
        if (state.token == null || state.token.trim() == "") new Error('Not Login!')

        const response = await getCurUserInfo()
        if (!response.ok) throw new Error('Not Login!')

        state.user = await response.json()
        if (state.user == null) throw new Error('Not Login!')

        const user = JSON.stringify(state.user)
        localStorage.setItem('CUR_USER', user)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
        localStorage.removeItem('TOKEN')
        localStorage.removeItem('CUR_USER')
        location = `${window.origin}/auth.html?url=${btoa(encodeURIComponent(window.location.pathname))}`
    }
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return store.GLOBAL_NOTIFY_BANNER_MSG
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

watch(() => route.path, function (newVal, oldVal) {
    if (newVal.startsWith('/setting')) {
        state.basis = [40, 90, 0]
    } else {
        state.basis = [40, 50, 40]
    }
})

function closeProgressIndicator() {
    state.timeoutId = setTimeout(() => {
        state.showProgressIndicator = false
    }, 1100);
}

function backToTop(){
    window.scrollTo({top: 0, behavior: 'smooth'})
}

function handleScroll(e){
    const wheelDeltaY = e.wheelDeltaY
    if(wheelDeltaY === 0) return
    state.showBackToTop = wheelDeltaY > 0 && container.value.scrollHeight > window.innerHeight && window.scrollY > 0
}

curUser()
onMounted(() => {
    document.getElementById('pre-loading').style.display = 'none'
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
})

onUnmounted(() => {
    disconnectToWs()
    clearTimeout(state.timeoutId)
})
</script>