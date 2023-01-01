<template>
    <div id="h" class="flex flex-row justify-between text-[15pt] items-center px-[1rem]">
        <div class="text-[15pt] h-full flex flex-row items-center">
            <div @click="routeTo(state.routeUrl, false)" v-if="state.backArrow == true"
                class="material-icons-round cursor-pointer text-[15pt] pr-[0.5rem]">arrow_back_ios</div>
            <div>{{ state.titleText }}</div>
        </div>
        <div><span v-if="state.editIcon" @click="routeTo('/profile/edit', state.submit)"
                class="material-icons-round text-[14pt]">{{ state.editIcon }}</span></div>
    </div>
    <div id="h-hide"></div>
</template>

<style scoped>
#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    width: 38.45%;
    height: 56px;
    position: fixed;
    border-bottom: 1px solid #EEEEEE;
}

#h-hide {
    width: 1px;
    height: 56px;
}
</style>

<script setup>
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../route';
import { store } from '../../store';

const state = reactive({
    backArrow: false,
    routeUrl: '/',
    titleText: '',
    editIcon: '',
    url: window.location.href,
    submit: false
})

const route = useRoute()

watch(() => route.path, (newUrl, oldUrl) => {
    if (newUrl.match('^/(index)?$')) {
        state.backArrow = false
        state.titleText = '主页'
        state.routeUrl = '/'
        state.editIcon = ''
        state.submit = false
    } else if (newUrl.match('^/post/.*$')) {
        state.backArrow = true
        state.routeUrl = '/'
        state.titleText = '帖子详情'
        state.editIcon = ''
        const pid = newUrl.replace('/post/', '')
        //store.setSelectPostId(pid)
        state.submit = false
    } else if (newUrl.match('^/profile/?.*$')) {
        const userId = window.location.href.replace(/.*\//, '')
        const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
        state.backArrow = userId != curUser.id
        state.titleText = userId == curUser.id ? curUser.nickname : store.SELECT_USER.nickname
        state.editIcon = userId == curUser.id ? 'create' : ''
        state.submit = false
    } else if (newUrl.match('^/profile/edit/?$')) {
        state.backArrow = true
        state.routeUrl = '/profile'
        state.titleText = '编辑个人资料'
        state.editIcon = 'done'
        state.submit = true
    } else {
        state.backArrow = false
        state.titleText = ''
        state.editIcon = ''
    }
})

function routeTo(path, submit) {
    const curUser = JSON.parse(localStorage.getItem("CUR_USER"))
    if (!store.SELECT_USER || store.SELECT_USER.id != curUser.id){
        router.push('/')
    }

    if (submit) {
        store.submitProfile()
    } else {
        router.push(path)
    }
}

</script>