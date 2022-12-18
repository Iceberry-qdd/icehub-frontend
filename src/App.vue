<template>
    <div id="container">
        <GlobalBanner></GlobalBanner>
        <GlobalRefresh></GlobalRefresh>
        <GlobalTipDialog></GlobalTipDialog>
        <!-- <ImageSlide></ImageSlide> -->
        <ImageSlide2></ImageSlide2>
        <div id="sidebar-l">
            <Brand></Brand>
            <Sidebar id="menu"></Sidebar>
        </div>
        <div id="main">
            <Header></Header>
            <router-view></router-view>
        </div>
        <div id="sidebar-r">
            <RecommendUserCard></RecommendUserCard>
        </div>
    </div>
</template>

<style scoped>
#menu {
    margin-top: 6rem;
}

#container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    min-height: 100vh;
}

#sidebar-l {
    flex-basis: 40%;
    border-right: 1px solid #EEEEEE;
}

#main {
    /* border-left: 1px solid #EEEEEE;
    border-right: 1px solid #EEEEEE; */
    flex-basis: 50%;
}

#sidebar-r {
    flex-basis: 40%;
    border-left: 1px solid #EEEEEE;
}
</style>

<script setup>
import GlobalBanner from './components/bootstrap/GlobalBanner.vue'
import Sidebar from './components/bootstrap/Sidebar.vue'
import RecommendUserCard from './components/bootstrap/RecommendUserCard.vue'
import GlobalRefresh from './components/tailwind/GlobalRefresh.vue'
import GlobalTipDialog from './components/tailwind/GlobalTipDialog.vue'
import Brand from './components/tailwind/Brand.vue'
import Header from './components/tailwind/Header.vue'
import { onMounted, reactive } from 'vue'
import { getCurUserInfo } from './api'
import { store } from './store'
import ImageSlide2 from './components/tailwind/ImageSlide2.vue'

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
        localStorage.removeItem('TOKEN')
        localStorage.removeItem('CUR_USER')
        self.location = 'auth.html'
        window.history.forward(1);
    }
}

onMounted(() => {
    curUser()
})

</script>