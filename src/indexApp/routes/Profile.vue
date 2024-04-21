<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div
        v-if="state.user"
        id="profile"
        class="relative">
        <Header
            v-if="state.user"
            :width="state.headerConfig.width"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>

        <Transition name="fade">
            <ProfileMenu
                v-if="state.showProfileMenus"
                :user="state.user"
                class="fixed right-[calc(100%*4/13+1rem)] top-[1rem] z-[102]">
            </ProfileMenu>
        </Transition>

        <Banner
            :user="state.user"
            class="h-[20rem] object-cover w-full"
            @click="state.user && state.user.banner ? showSlide([state.user.banner], 0) : ''">
        </Banner>
        <div class="-translate-y-[2.5rem]">
            <ProfileInfo :user="state.user"></ProfileInfo>
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
.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

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
import { getUserPosts, getUserInfoByNickname } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRoute } from 'vue-router'
import Banner from '@/indexApp/components/Banner.vue'
import ProfileMenu from '@/indexApp/components/profile/ProfileMenu.vue'

const route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return route.params.nickname == user.nickname
})

const state = reactive({
    user: null,
    posts: [],
    postIdSet: new Set(),
    pageIndex: 1,
    pageSize: 10,
    lastTimestamp: Date.now(),
    totalPages: 0,
    headerConfig: {
        title: route.params.nickname,
        goBack: !isCurUser.value,
        showMenu: true,
        menuIcon: 'more_horiz',
        iconTooltip: '更多选项'
    },
    isPostLoading: true,
    lastWheelDirection: 0,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showProfileMenus: false
})

async function getPosts() {
    state.isPostLoading = true
    try {
        const response = await getUserPosts(state.user.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()

        for(let i = 0; i < content.length; i++){
            if(state.postIdSet.has(content[i].id)){
                // 如果之前已经查询出该置顶帖子，则再次查询到时，不需要再展示置顶标识
                content[i].top = false 
            }else {
                state.postIdSet.add(content[i].id)
            }
        }
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

function postingNew(post) {
    state.posts.unshift(post)
}

async function refreshProfileOnUi(){
    try{
        await getUser(state.user.id)
        await getPosts()
    }catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

function handleAction() {
    state.showProfileMenus = true
}

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

function dismissProfileMenus() {
    state.showProfileMenus = false
}

function pinPostOnUi(postId, newTop){
    const preDelIndex = state.posts.findIndex(it => it.id === postId)
    if(preDelIndex< 0 || preDelIndex >= state.posts.length) return

    if(!newTop){
        state.posts[preDelIndex].top = newTop
        return
    }

    const removedPostArr = state.posts.splice(preDelIndex, 1)
    if(removedPostArr.length != 1) return
    removedPostArr[0].top = newTop
    state.posts.unshift(removedPostArr[0])
}

onMounted(async () => {
    const nickname = route.params.nickname

    await getUser(nickname)
    state.lastTimestamp = state.user?.lastPostAt || Date.now()
    if (!state.user.blocked && !state.user.blocking) {
        await getPosts()
    }
    window.addEventListener('scroll', fetchNewPost)
})

onUnmounted(() => {
    window.removeEventListener('scroll', fetchNewPost)
    store.clearSelectUser()
})


provide('dismissProfileMenus', { dismissProfileMenus: dismissProfileMenus })
provide('postingNew', { postingNew })
provide('refreshProfileOnUi', { refreshProfileOnUi: refreshProfileOnUi })
provide('pinPostOnUi', { pinPostOnUi: pinPostOnUi })
</script>