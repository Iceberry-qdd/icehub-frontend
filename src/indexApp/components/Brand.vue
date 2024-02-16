<template>
    <div
        id="brand"
        class="fixed flex flex-row gap-x-4 h-16 items-center justify-center left-[11%] mt-6">
        <a>
            <img
                id="brand-img"
                src="../../assets/logo.svg"
                @click="testSendPublicNotify" />
        </a>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="font-bold text-2xl">{{ state.appName }}</div>
    </div>
</template>

<style scoped>
#brand-img {
    width: 2.5rem !important;
    max-width: 4rem !important;
    height: auto;
}
</style>

<script setup>
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { store } from '@/indexApp/js/store.js'
import { reactive } from 'vue'

const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    appName: import.meta.env.VITE_APP_TITLE
})

function testSendPublicNotify() {
    if (!showUnImpl) return
    store.setGlobalNotifyBannerMsg({
        "id": null,
        "msg": "网络暂不可用，请检查您的互联网连接...",
        "to": "ALL",
        "from": "ADMIN",
        "timestamp": 1692532747114,
        "type": "SYS_NOTIFY_ERROR",
        "radiation": null,
        "read": false
    })
    // ws.sendToTopic(new MsgPack("网络暂不可用，请检查您的互联网连接！","ADMIN", 'SYS_NOTIFY_ERROR', "ALL"))
}
</script>