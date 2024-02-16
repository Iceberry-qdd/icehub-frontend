<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div
        v-if="state.user"
        id="profile"
        class="relative"
        @wheel="toggleHeaderIcon">
        <Header
            v-if="state.user"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :menu-action="state.headerConfig.menuAction"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>

        <Banner
            :user="state.user"
            class="h-[20rem] object-cover w-full"
            @click="state.user && state.user.bannerUrl ? showSlide([state.user.bannerUrl], 0) : ''">
        </Banner>
        <div class="-translate-y-[2.5rem]">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <ProfileInfo :user="state.user" @unblock-user="unblockUser"></ProfileInfo>
            <div
                v-if="state.user.blocking"
                class="flex flex-col gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)] items-center justify-center w-full">
                <span class="material-icons-round">disabled_visible</span>
                <div>你已屏蔽对方</div>
            </div>
            <div
                v-else-if="state.user.blocked"
                class="flex flex-col gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)] items-center justify-center w-full">
                <span class="material-icons-round">disabled_visible</span>
                <div>对方屏蔽了你</div>
            </div>
            <PostsTimeline
                v-else
                :is-loading="state.isPostLoading"
                :posts="state.posts"
                :cur-page-index="state.pageIndex"
                :total-pages="state.totalPages">
            </PostsTimeline>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round:hover {
    background-color: transparent;
}

.material-icons-round {
    font-size: 24pt;
}
</style>

<!-- eslint-disable vue/no-ref-object-reactivity-loss -->
<script setup>
import Header from '@/indexApp/components/Header.vue'
import ProfileInfo from '@/indexApp/components/profile/ProfileInfo.vue'
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import { reactive, onMounted, onUnmounted, computed, provide } from 'vue'
import { getUserPosts, getUserInfoByNickname, deleteOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRoute, useRouter } from 'vue-router'
import Banner from '@/indexApp/components/Banner.vue'

const router = useRouter()
const route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return route.params.nickname == user.nickname
})
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    user: null,
    posts: [],
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    headerConfig: {
        title: route.params.nickname,
        goBack: !isCurUser.value,
        showMenu: isCurUser.value,
        menuIcon: isCurUser.value ? 'create' : '',
        iconTooltip: '编辑个人资料'
    },
    isPostLoading: true,
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
        if (content.length > 1) {
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

function toggleHeaderIcon(event) {
    // TODO implement it.
    if (!showUnImpl) return
    if (event.pageY > 718 && event.deltaY > 0 && state.lastWheelDirection <= 0) {
        state.lastWheelDirection = event.deltaY
        state.headerConfig.menuIcon = 'date_range'
        state.headerConfig.iconTooltip = '搜索帖子'
    } else if (event.pageY < 718 && event.deltaY < 0 && state.lastWheelDirection > 0) {
        state.lastWheelDirection = event.deltaY
        state.headerConfig.menuIcon = isCurUser.value ? 'create' : ''
        state.headerConfig.iconTooltip = '编辑个人资料'
    }
}

function postingNew(post) {
    state.posts.unshift(post)
}

async function unblockUser() {
    try {
        const response = await deleteOneBlacklist('USER', state.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result) {
            await getUser(state.user.id)
            await getPosts()
            store.setSuccessMsg('已将该用户解除屏蔽')
        } else {
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function handleAction() {
    router.push('/profile/edit')
}

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

onMounted(async () => {
    const nickname = route.params.nickname

    await getUser(nickname)
    state.lastTimestamp = state.user?.lastPostAt || Date.now()
    if (!state.user.blocked && !state.user.blocking) {
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