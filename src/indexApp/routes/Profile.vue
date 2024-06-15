<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div
        v-if="state.user"
        id="profile">
        <Header
            v-if="state.user"
            id="h"
            class="opacity-0 sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="handleAction">
        </Header>
        <div class="max-sm:hidden sm:absolute sm:left-full">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                <div
                    v-if="state.showProfileMenus && store.MOBILE_MODE"
                    class="bg-black/50 fixed h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                    @click="state.showProfileMenus = false" />
                <Transition name="fade">
                    <ProfileMenu
                        v-if="state.showProfileMenus"
                        :user="state.user"
                        class="fixed h-fit max-sm:bottom-0 max-sm:left-0 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1001] rounded-[8px] sm:-translate-x-[calc(100%+1rem)] sm:max-w-[18rem] sm:min-w-[10rem] sm:top-[1rem] z-[104]">
                    </ProfileMenu>
                </Transition>
            </Teleport>
        </div>
        <Banner
            :user="state.user"
            class="-mb-[calc(5rem/2)] -mt-[56px] aspect-video max-sm:-mt-[48px] object-cover w-full"
            @click="state.user && state.user.banner ? showSlide([state.user.banner], 0) : ''">
        </Banner>

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
            :posts="state.posts">
        </PostsTimeline>
        <Footer
            :is-loading="state.isPostLoading"
            :has-more="hasMore"
            @fetch-more="fetchNewPost">
        </Footer>
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

@supports (animation-timeline: scroll()){
    #profile>#h{
        animation: opacity-progress 3s linear forwards;
        animation-timeline: scroll();
        animation-range: entry 0 exit 100px
    }
    
    @keyframes opacity-progress {
        from {
            opacity: 0;
        }
        to {
            opacity: 100%;
        }
    }
}

@media not all and (min-width: 640px) {
    .fade-enter-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-leave-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-enter-from {
        translate: 0 100%;
    }

    .fade-leave-to {
        translate: 0 100%;
        opacity: 1;
    }
}
</style>

<!-- eslint-disable vue/no-ref-object-reactivity-loss -->
<script setup>
import Header from '@/indexApp/components/Header.vue'
import ProfileInfo from '@/indexApp/components/profile/ProfileInfo.vue'
import PostsTimeline from '@/indexApp/components/PostsTimeline.vue'
import { reactive, onMounted, computed, provide, onUnmounted } from 'vue'
import { getUserPosts, getUserInfoByNickname } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRoute } from 'vue-router'
import Banner from '@/indexApp/components/Banner.vue'
import ProfileMenu from '@/indexApp/components/profile/ProfileMenu.vue'
import Footer from '@/indexApp/components/Footer.vue'

const route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return route.params.nickname == user.nickname
})

const state = reactive({
    user: null,
    posts: [],
    pinnedIdTop: new Set(),
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

const hasMore = computed(() => {
    return state.pageIndex < state.totalPages
})

async function getPosts() {
    state.isPostLoading = true
    try {
        const response = await getUserPosts(state.user.id, state.pageIndex, state.pageSize, state.lastTimestamp)
        if (!response.ok) throw new Error((await response.json()).error)

        const { content, totalPages } = await response.json()

        for(let i = content.length - 1; i >= 0; i--){
            if(state.pinnedIdTop.has(content[i].id)){
                // 如果之前已经查询出该置顶帖子，则再次查询到时，不再显示
                content.splice(i, 1)
            }else if(content[i].top){
                state.pinnedIdTop.add(content[i].id)
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
    getPosts()
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

function handleScroll(){
    document.querySelector('#profile>#h').setAttribute('style', `opacity:${Math.min(100, this.scrollY)}%`)
}

onMounted(async () => {
    const nickname = route.params.nickname

    await getUser(nickname)
    state.lastTimestamp = state.user?.lastPostAt || Date.now()
    if (!state.user.blocked && !state.user.blocking) {
        await getPosts()
    }

    if(!CSS.supports('animation-timeline: scroll()')){
        window.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

provide('dismissProfileMenus', { dismissProfileMenus: dismissProfileMenus })
provide('postingNew', { postingNew })
provide('refreshProfileOnUi', { refreshProfileOnUi: refreshProfileOnUi })
provide('pinPostOnUi', { pinPostOnUi: pinPostOnUi })
</script>