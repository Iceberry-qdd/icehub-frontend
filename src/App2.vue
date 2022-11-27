<script setup>
import GlobalBanner from './components/bootstrap/GlobalBanner.vue';
import Auth from './components/tailwind/Auth.vue'
import { onMounted, reactive, onErrorCaptured } from 'vue'
import { store } from './store'
import { getCurUserInfo } from './api'


const state = reactive({
    user: null,
})

async function curUser() {
    try {
        const token = localStorage.getItem('TOKEN')

        const response = await getCurUserInfo()
        if (!response.ok) throw new Error('Not Login!')
        
        if (token != null && token.trim() != "") {
            self.location = 'index'
            window.history.forward(1);
        }

    } catch (e) {
        store.setMsg(e)
        console.error(e)
    }
}

onMounted(() => {
    curUser()
})
</script>

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
