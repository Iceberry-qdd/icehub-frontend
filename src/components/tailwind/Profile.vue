<template>
    <div v-if="state.user" class="relative" id="profile" @wheel="toggleHeaderIcon">
        <Header
            v-if="state.user"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :goBack="state.headerConfig.goBack"
            :showMenu="state.headerConfig.showMenu"
            :menuIcon="state.headerConfig.menuIcon"
            :menuAction="state.headerConfig.menuAction"
            :iconTooltip="state.headerConfig.iconTooltip"></Header>
        <ProfileInfo :user="state.user" @unblockUser="unblockUser"></ProfileInfo>
        <div v-if="state.user.blocking"
            class="w-full flex flex-col justify-center items-center gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)]">
            <span class="material-icons-round">disabled_visible</span>
            <div>你已屏蔽对方</div>
        </div>
        <div v-else-if="state.user.blocked"
            class="w-full flex flex-col justify-center items-center gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)]">
            <span class="material-icons-round">disabled_visible</span>
            <div>对方屏蔽了你</div>
        </div>
        <PostsTimeline
            v-else
            :isLoading="state.isPostLoading" 
            :posts="state.posts"
            :curPageIndex="state.pageIndex"
            :totalPages="state.totalPages">
        </PostsTimeline>
    </div>
</template>

<style scoped>
.material-icons-round:hover{
    background-color: transparent;
}

.material-icons-round{
    font-size: 24pt;
}
</style>

<script setup>
import Header from '@/components/tailwind/Header.vue'
import ProfileInfo from '@/components/tailwind/ProfileInfo.vue'
import PostsTimeline from '@/components/bootstrap/PostsTimeline.vue'
import { reactive, onMounted, onUnmounted, computed, provide } from 'vue'
import { getUserPosts, getUserInfoByNickname, deleteOneBlacklist } from '@/api'
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
        iconTooltip: '编辑个人资料'
    },
    isPostLoading: false,
    lastWheelDirection: 0,
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
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

function postingNew(post) {
    state.posts.unshift(post)
}

async function unblockUser(){
    try{
        const response = await deleteOneBlacklist('USER', state.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if(result){
            await getUser(state.user.id)
            await getPosts()
            store.setSuccessMsg('已将该用户解除屏蔽')
        }else{
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

onMounted(async () => {
    const nickname = $route.params.nickname

    await getUser(nickname)
    state.lastTimestamp = state.user?.lastPostAt || Date.now()
    if(!state.user.blocked && !state.user.blocking){
        await getPosts()
    }
    window.addEventListener('scroll', fetchNewPost)
    window.addEventListener('wheel', toggleHeaderIcon)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
    window.removeEventListener('wheel', toggleHeaderIcon)
    store.clearSelectUser()
})

provide('postingNew', { postingNew })
</script>