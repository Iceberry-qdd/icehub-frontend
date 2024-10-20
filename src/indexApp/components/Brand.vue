<template>
    <div
        id="brand"
        class="flex flex-row gap-x-4 h-16 items-end justify-center">
        <a>
            <img
                src="../../../public/favicon.ico"
                class="h-auto lg:max-w-[4rem] lg:w-[2.5rem] sm:max-lg:w-[2rem]"
                @click="routeTo('index')" />
        </a>
        <div
            class="cursor-pointer font-light sm:max-lg:hidden text-[0.6rem]"
            @click="routeTo('index')">
            <span class="font-bold mr-1 text-2xl">Icehub</span>
            <span class="align-text-bottom bg-primary mr-1 px-1 py-[0.1rem] rounded-md text-onPrimary">{{ mode }}</span>
            <span class="align-text-bottom bg-green-500 dark:bg-primary pwa-badge px-1 py-[0.1rem] rounded-md text-onPrimary">pwa</span>
        </div>
    </div>
</template>

<style scoped>
@media (display-mode: browser) {
    .pwa-badge {
        display: none;
    }
}
</style>

<script setup>
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { store } from '@/indexApp/js/store.js'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)

const mode = computed(() => {
    const {DEV, PROD, SSR} = import.meta.env
    return DEV ? 'DEV' : PROD ? 'PROD' : SSR ? 'SSR' : 'UKN'
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