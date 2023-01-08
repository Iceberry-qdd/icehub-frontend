<template>
    <div id="container">
        <GlobalBanner></GlobalBanner>
        <GlobalTipDialog></GlobalTipDialog>
        <ImageCropper v-if="store.SHOW_IMAGE_CROPPER"></ImageCropper>
        <ImageSlide2></ImageSlide2>
        <div id="sidebar-l">
            <Brand></Brand>
            <Sidebar id="menu"></Sidebar>
        </div>
        <div id="main">
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

import GlobalTipDialog from './components/tailwind/GlobalTipDialog.vue'
import Brand from './components/tailwind/Brand.vue'
import { onMounted, reactive } from 'vue'
import { getCurUserInfo } from './api'
import { store } from './store'
import ImageSlide2 from './components/tailwind/ImageSlide2.vue'
import ImageCropper from './components/tailwind/ImageCropper.vue'

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

        const user = JSON.stringify(state.user)
        localStorage.setItem('CUR_USER', user)
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