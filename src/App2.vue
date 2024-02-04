<template>
    <div class="container">
        <GlobalBanner></GlobalBanner>
        <Auth></Auth>
    </div>
</template>

<style>
@import url("bootstrap-icons/font/bootstrap-icons.css");

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
import { onMounted, onUnmounted, reactive, defineAsyncComponent } from 'vue'
import Auth from '@/components/tailwind/Auth.vue'
import 'material-icons/iconfont/round.css'
const GlobalBanner = defineAsyncComponent(() => import('@/components/tailwind/GlobalBanner.vue'))

const state = reactive({
    user: null,
})

onMounted(() => {
    document.getElementById('pre-loading').style.display = 'none'
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
})

onUnmounted(() => {
    window.removeEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
    })
})

</script>