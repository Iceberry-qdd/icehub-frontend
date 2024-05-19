<template>
    <div class="container">
        <GlobalBanner v-if="store.GLOBAL_MSG.length > 0"></GlobalBanner>
        <Auth @referer="referer"></Auth>
    </div>
</template>

<style scoped>
#header {
    position: fixed;
    width: 100%;
    z-index: 99;
}

#sidebar {
    position: fixed;
    left: 13rem;
    top: 5rem;
}

main {
    width: 40%;
    padding-top: 5rem;
    position: absolute;
    left: 28%;
    right: 28%;
}
</style>

<script setup>
import { onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import Auth from '@/authApp/components/Auth.vue'
import 'material-icons/iconfont/round.css'
import { store } from '@/indexApp/js/store.js'
const GlobalBanner = defineAsyncComponent(() => import('@/components/GlobalBanner.vue'))

function referer() {
    if (window.location.search && window.location.search.includes('url=')) {
        const referer = window.location.search.substring(1)
            .split('&')
            .find(it => it.substring(0, it.indexOf('=')) === 'url')
            .split('=')
            .at(1)
        window.location = `${window.location.origin}${decodeURIComponent(atob(referer))}`
        return
    }
}

onMounted(() => {
    document.getElementById('pre-loading').style.display = 'none'
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })

    const token = localStorage.getItem('TOKEN')
    if (token) {
        referer()
    }
})

onUnmounted(() => {
    window.removeEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
})
</script>