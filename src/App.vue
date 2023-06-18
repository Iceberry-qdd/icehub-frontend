<template>
    <div v-if="state.user">
        <GlobalNotifyBanner class="fixed" :class="{ 'top-0': isShowGlobalNotifyBannerMsg }" v-if="isShowGlobalNotifyBannerMsg"
            @closeGlobalNotifyBanner="closeGlobalNotifyBannerMsg" id="global-notify-banner"
            :message="state.globalNotifyBannerMsg"></GlobalNotifyBanner>
        <div id="container" :class="{ 'margin-top-10': isShowGlobalNotifyBannerMsg }">
            <GlobalBanner v-if="store.GLOBAL_MSG.length > 0" @closeGlobalBanner="store.GLOBAL_MSG = []"></GlobalBanner>
            <GlobalTipDialog></GlobalTipDialog>
            <ImageCropper v-if="store.SHOW_IMAGE_CROPPER"></ImageCropper>
            <ImageSlide2 v-if="store.SLIDE_DATA.urls.length > 0"></ImageSlide2>
            <RepostPanel v-if="store.REPOST_POST"></RepostPanel>
            <ReviewPanel v-if="store.REVIEW_PANEL_DATA"></ReviewPanel>
            <div id="sidebar-l">
                <Brand></Brand>
                <Sidebar id="menu"></Sidebar>
            </div>
            <div id="main">
                <router-view v-slot="{ Component }">
                    <keep-alive :max="16" :include="['Index', 'Explore', 'Bookmark','Notify']">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
            <div id="sidebar-r">
                <RecommendUserCard></RecommendUserCard>
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
    flex-basis: 40%;
    border-right: 1px solid #EEEEEE;
}

#main {
    flex-basis: 50%;
}

#sidebar-r {
    flex-basis: 40%;
    border-left: 1px solid #EEEEEE;
}
</style>

<script setup>
import GlobalBanner from '@/components/tailwind/GlobalBanner.vue'
import Sidebar from '@/components/bootstrap/Sidebar.vue'
import RecommendUserCard from '@/components/bootstrap/RecommendUserCard.vue'
import GlobalTipDialog from '@/components/tailwind/GlobalTipDialog.vue'
import Brand from '@/components/tailwind/Brand.vue'
import { computed, onMounted, onUnmounted, reactive, watch } from 'vue'
import { getCurUserInfo } from '@/api'
import { store } from '@/store'
import ImageSlide2 from '@/components/tailwind/ImageSlide2.vue'
import ImageCropper from '@/components/tailwind/ImageCropper.vue'
import RepostPanel from '@/components/tailwind/RepostPanel.vue'
import { ws } from './websocket.js'
import GlobalNotifyBanner from '@/components/tailwind/GlobalNotifyBanner.vue'
import ReviewPanel from './components/tailwind/ReviewPanel.vue'

const state = reactive({
    user: null,
    globalNotifyBannerMsg: store.GLOBAL_NOTIFY_BANNER_MSG
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
        setTimeout(() => {
            top.location = `http://${window.document.location.host}/auth.html`
        }, 3000)
    }
}

const isShowGlobalNotifyBannerMsg = computed(() => {
    return state.globalNotifyBannerMsg.length > 0
})

function closeGlobalNotifyBannerMsg() {
    state.globalNotifyBannerMsg = ''
    store.GLOBAL_NOTIFY_BANNER_MSG = ''
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
    if (newVal == 'CONNECTED') {
        ws.subscribeTopic(`/topic/public.notify`, function (response) {
            // const msgPack = JSON.parse(response.body)
            const result = response.body
            store.setGlobalNotifyBannerMsg(result)
            state.globalNotifyBannerMsg = result
        })
    } else if (newVal == 'CONNECTED_FAILED') {
        ws.reconnectWebsocket()
    }
})

onMounted(() => {
    curUser()
    document.addEventListener("DOMContentLoaded",renderMath)
})

onUnmounted(() => {
    disconnectToWs()
})

</script>