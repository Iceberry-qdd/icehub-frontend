<template>
    <div v-if="state.user" class="relative" id="profile" @wheel="toggleHeaderIcon">
        <Header
            v-if="state.user && state.headerConfig.width != 0"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"
            :iconTooltip="state.headerConfig.iconTooltip"></Header>
        <ProfileInfo :user="state.user"></ProfileInfo>
        <PostsTimeline :isLoading="state.isPostLoading" :posts="state.posts" :curPageIndex="state.pageIndex" :totalPages="state.totalPages"></PostsTimeline>
    </div>
</template>

<style scoped>

</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import ProfileInfo from '@/components/tailwind/ProfileInfo.vue'
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import { reactive, onMounted, onUnmounted, computed } from 'vue'
import { getUserPosts, getUserInfoByNickname } from '@/api'
import { store } from '@/store'
import { useRoute } from 'vue-router'

const $route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return $route.params.nickname == user.nickname
})

const state = reactive({
    user: null,
    posts: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    headerConfig: {
        title: $route.params.nickname,
        goBack: !isCurUser.value,
        showMenu: isCurUser.value,
        menuIcon: isCurUser.value ? 'create' : '',
        menuAction: { action: 'route', param: '/profile/edit' },
        iconTooltip: '编辑个人资料',
        width: 0
    },
    isPostLoading: false,
    lastWheelDirection: 0
})

async function getPosts() {
    state.isPostLoading = true
    try {
        const response = await getUserPosts(state.user.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()
        state.posts.push(...content)
        state.totalPages = totalPages
        if(content.length > 1) {
            state.lastTimestamp = content.slice(-1)[0].createdTime
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.isPostLoading = false
    }
}

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).error)

        const user = await response.json()
        state.user = user
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function fetchNewPost() {
    if (state.pageIndex >= state.totalPages) return

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const clientHeight = document.documentElement.clientHeight
    const scrollHeight = document.documentElement.scrollHeight

    if (scrollTop + clientHeight >= scrollHeight) {
        setTimeout(() => {
            getPosts()
        }, 1000)
    }
}

function toggleHeaderIcon(event){
    if(event.pageY > 718 && event.deltaY > 0 && state.lastWheelDirection <= 0){
        state.lastWheelDirection = event.deltaY
        state.headerConfig.menuIcon = 'date_range'
        state.headerConfig.iconTooltip = '搜索帖子'
    }else if(event.pageY < 718 && event.deltaY < 0 && state.lastWheelDirection > 0){
        state.lastWheelDirection = event.deltaY
        state.headerConfig.menuIcon = isCurUser.value ? 'create' : ''
        state.headerConfig.iconTooltip = '编辑个人资料'
    }
}

onMounted(async () => {
    const nickname = $route.params.nickname

    await getUser(nickname)
    state.lastTimestamp = state.user.lastPostAt || Date.now()
    await getPosts()
    window.addEventListener('scroll', fetchNewPost)
    window.addEventListener('wheel', toggleHeaderIcon)

    const profile = document.getElementById('profile')
    state.headerConfig.width = window.getComputedStyle(profile).width.replace('px', '')
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
    window.removeEventListener('wheel', toggleHeaderIcon)
    store.clearSelectUser()
})
</script>