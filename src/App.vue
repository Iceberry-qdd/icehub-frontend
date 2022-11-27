<script setup>
import Header from './components/bootstrap/Header.vue'
import GlobalBanner from './components/bootstrap/GlobalBanner.vue'
import UserProfileOffCanvas from './components/bootstrap/UserProfileOffCanvas.vue'
import Sidebar from './components/bootstrap/Sidebar.vue'
import RecommendUserCard from './components/bootstrap/RecommendUserCard.vue'
import GlobalRefresh from './components/tailwind/GlobalRefresh.vue'
import GlobalTipDialog from './components/tailwind/GlobalTipDialog.vue'
import ImageSlide from './components/bootstrap/ImageSlide.vue'
import { onMounted, reactive, onErrorCaptured } from 'vue'
import { getCurUserInfo } from './api'
import { store } from './store'

const state = reactive({
    user: null,
})

async function curUser() {
    try {
        const token = localStorage.getItem('TOKEN')
        if (token == null || token.trim() == "") new Error('Not Login!')

        const response = await getCurUserInfo()
        if (!response.ok) throw new Error('Not Login!')

        state.user = await response.json()
        if (state.user == null) throw new Error('Not Login!')

        localStorage.setItem('CUR_USER', JSON.stringify(state.user))
    } catch (e) {
        store.setMsg(e)
        console.error(e)
        self.location = 'auth.html'
        window.history.forward(1);
    }
}

onMounted(() => {
    curUser()
})

</script>

<template>
    <div class="container">
        <GlobalBanner></GlobalBanner>
        <Header id="header"></Header>
        <UserProfileOffCanvas></UserProfileOffCanvas>
        <GlobalRefresh></GlobalRefresh>
        <GlobalTipDialog></GlobalTipDialog>
        <ImageSlide></ImageSlide>
        <main>
            <router-view></router-view>
            <!-- <PostsTimeLine></PostsTimeLine> -->
            <Sidebar id="sidebar"></Sidebar>
            <RecommendUserCard></RecommendUserCard>
        </main>
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
