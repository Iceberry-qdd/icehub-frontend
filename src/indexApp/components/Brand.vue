<template>
    <div
        id="brand"
        class="fixed flex flex-row gap-x-4 h-16 items-center justify-center left-[11%] mt-6">
        <a>
            <img
                id="brand-img"
                src="../../assets/logo.svg"
                @click="routeTo('index')" />
        </a>
        <div
            class="cursor-pointer font-bold text-2xl"
            @click="routeTo('index')">
            Icehub
            <span class="align-middle bg-blue-500 font-light px-1 py-[0.1rem] rounded-md text-[0.6rem] text-white">{{ state.version }}</span>
        </div>
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
import { useRouter } from 'vue-router'

const router = useRouter()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    version: import.meta.env.VITE_APP_VERSION
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

function routeTo(name){
    router.push({'name': name})
}
</script>