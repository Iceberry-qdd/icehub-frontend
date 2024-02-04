<template>
    <div v-if="state.user">
        <GlobalProgressIndicator
            class="fixed"
            v-if="state.showProgressIndicator"
            @close="closeProgressIndicator"
            :routing="state.startRoute">
        </GlobalProgressIndicator>
        <GlobalNotifyBanner
            class="fixed"
            :class="{ 'top-0': isShowGlobalNotifyBannerMsg }"
            v-if="isShowGlobalNotifyBannerMsg"
            @closeGlobalNotifyBanner="closeGlobalNotifyBannerMsg"
            id="global-notify-banner"
            :message="store.GLOBAL_NOTIFY_BANNER_MSG">
        </GlobalNotifyBanner>
        <div id="container" :class="{ 'margin-top-10': isShowGlobalNotifyBannerMsg }">
            <GlobalBanner v-if="store.GLOBAL_MSG.length > 0"></GlobalBanner>
            <GlobalTipDialog></GlobalTipDialog>
            <ImageCropper v-if="store.SHOW_IMAGE_CROPPER"></ImageCropper>
            <ImageSlide2 v-if="store.SLIDE_DATA.urls.length > 0"></ImageSlide2>
            <div id="sidebar-l" :style="{ 'flex-basis': state.basis[0] + '%' }" v-if="state.basis[0] > 0">
                <Brand></Brand>
                <Sidebar id="menu"></Sidebar>
            </div>
            <div id="main" :style="{ 'flex-basis': state.basis[1] + '%' }" v-if="state.basis[1] > 0">
                <router-view v-slot="{ Component }" >
                    <keep-alive :max="8" :include="['Index', 'Explore', 'Bookmark', 'Notify', 'Search', 'Profile']">
                        <component :is="Component" :key="route.fullPath" />
                    </keep-alive>
                </router-view>
            </div>
            <div id="sidebar-r" :style="sidebarRStyle" v-if="state.basis[2] > 0">
                <Recommend class="p-4 mr-20"></Recommend>
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
}

#sidebar-r {
    border-left: 1px solid #EEEEEE;
    overflow: hidden scroll;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 0;
}

#main{
    min-width: 0;
    z-index: 1;
}

.mr-20 {
    margin-right: 5rem/* 80px */;
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
import { computed, onMounted, onUnmounted, reactive, watch, defineAsyncComponent } from 'vue'
import Sidebar from '@/components/bootstrap/Sidebar.vue'
import Recommend from '@/components/tailwind/Recommend.vue'
import Brand from '@/components/tailwind/Brand.vue'
import { getCurUserInfo } from '@/api'
import { store } from '@/store'
import { ws } from '@/websocket.js'
import { useRoute, useRouter } from 'vue-router'
import 'bootstrap'
import 'material-icons/iconfont/round.css'
import { NavigationFailureType, isNavigationFailure } from 'vue-router'
import GlobalProgressIndicator from '@/components/tailwind/GlobalProgressIndicator.vue'
const GlobalTipDialog = defineAsyncComponent(() => import('@/components/tailwind/GlobalTipDialog.vue'))
const GlobalNotifyBanner = defineAsyncComponent(() => import('@/components/tailwind/GlobalNotifyBanner.vue'))
const GlobalBanner = defineAsyncComponent(() => import('@/components/tailwind/GlobalBanner.vue'))
const ImageSlide2 = defineAsyncComponent(() => import('@/components/tailwind/ImageSlide2.vue'))
const ImageCropper = defineAsyncComponent(() => import('@/components/tailwind/ImageCropper.vue'))

const route = useRoute()
const router = useRouter()
const state = reactive({
    user: null,
    globalNotifyBannerMsg: store.GLOBAL_NOTIFY_BANNER_MSG,
    basis: [40, 50, 40],
    startRoute:false,
    showProgressIndicator: false,
    timeoutId: 0
})

const sidebarRStyle = reactive({
    flexBasis: `${state.basis[2]}%`,

})

async function curUser() {
    try {
        const token = localStorage.getItem('TOKEN')
        if (token == null || token.trim() == "") new Error('Not Login!')

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
        const token = localStorage.getItem('TOKEN')
        ws.connectWebsocket(token)
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
        ws.reconnectWebsocket()
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

function closeProgressIndicator(){
    state.timeoutId = setTimeout(() => {
        state.showProgressIndicator = false
    }, 1100);
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
        if(failure && !isNavigationFailure(failure, NavigationFailureType.duplicated)){
            store.setErrorMsg('无法加载页面，您可以刷新重试！')
        }
    })
})

onUnmounted(() => {
    disconnectToWs()
    clearTimeout(state.timeoutId)
})

</script>