<!-- eslint-disable-next-line vue/no-root-v-if -->
<template>
    <div>
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
                        class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]"
                        @click="state.showProfileMenus = false" />
                    <Transition name="fade">
                        <ProfileMenu
                            v-if="state.showProfileMenus"
                            :user="state.user"
                            class="fixed h-fit max-sm:bottom-0 max-sm:left-0 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1001] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:-translate-x-[calc(100%+1rem)] sm:max-w-[18rem] sm:min-w-[10rem] sm:top-[1rem] z-[1002]">
                        </ProfileMenu>
                    </Transition>
                </Teleport>
            </div>
            <Banner
                :user="state.user"
                class="-mb-[calc(5rem/2)] -mt-[56px] aspect-video max-sm:-mt-[48px] object-cover w-full"
                @click="state.user && state.user.banner ? showSlide([state.user.banner], 0) : ''">
            </Banner>
    
            <ProfileInfo
                class="mb-2"
                :user="state.user">
            </ProfileInfo>
            <div
                v-if="state.user.blocking"
                class="dark:text-white/25 flex flex-col gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)] items-center justify-center text-neutral-400 w-full">
                <span class="cursor-default material-symbols-rounded no-hover text-inherit">disabled_visible</span>
                <div>你已屏蔽对方</div>
            </div>
            <div
                v-else-if="state.user.blocked"
                class="dark:text-white/25 flex flex-col gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)] items-center justify-center text-neutral-400 w-full">
                <span class="cursor-default material-symbols-rounded no-hover text-inherit">disabled_visible</span>
                <div>对方屏蔽了你</div>
            </div>
            <div
                v-else-if="isPrivateAccountAndNotFollowed"
                class="dark:text-white/25 flex flex-col gap-2 h-[calc(100vh-56px-22rem-2.5rem-2px)] items-center justify-center text-neutral-400 w-full">
                <span class="cursor-default material-symbols-rounded no-hover text-inherit">lock</span>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="text-[0.9rem]">这是私密账号，请求订阅通过后才可查看</div>
            </div>
            <div v-else>
                <div
                    class="after:bg-primary backdrop-blur-xl bg-white/80 cursor-pointer dark:after:bg-onPrimary dark:bg-[#121212dd] dark:border-[#1e1e1e] dark:text-white/50 flex flex-row max-sm:top-[48px] sticky tab text-[0.9rem] text-zinc-500 top-[56px] z-[104]">
                    <div
                        v-for="tab in state.tabs"
                        :key="tab.id"
                        :class="{'text-primary dark:text-onPrimary': [tab.id].includes($route.name === 'profile' ? 'postTimelinePage' : $route.name)}"
                        class="flex flex-1 hover:dark:text-onPrimary hover:text-primary items-center justify-center py-2"
                        @click="$router.replace({name: tab.id})">
                        {{ `${tab.name} ${tab.count || ''}` }}
                        <span
                            v-if="tab.visibility !== 'PUBLIC'"
                            class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                            lock
                        </span>
                    </div>
                </div>
                <!-- eslint-disable-next-line vue/no-undef-components, vue/component-name-in-template-casing -->
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component
                            :is="Component"
                            :user="state.user"
                            :tab="state.tabs.find(it => it.id === $route.name) || state.tabs.find(it => it.id === 'postTimelinePage')"
                            @update-tab-count="({id, count}) => state.tabs.find(it => it.id === id).count = count">
                        </component>
                    </keep-alive>
                </router-view>
            </div>
        </div>
        <Footer
            v-else
            is-loading
            has-more>
        </Footer>   
    </div>
</template>

<style scoped>
.tab::after{
    content: '';
    width: v-bind(tabAccentWidth);
    translate: v-bind(tabTranslateX);
    height: 2px;
    position: absolute;
    bottom: 0;
    transition: translate 100ms ease-in-out;
}

.material-symbols-rounded:hover {
    background-color: transparent;
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
</style>

<!-- eslint-disable vue/no-ref-object-reactivity-loss -->
<script setup>
import { reactive, onMounted, computed, provide, onUnmounted, watch, defineAsyncComponent } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { useRoute } from 'vue-router'
import { getUserInfoByNickname } from '@/indexApp/js/api.js'
import Header from '@/indexApp/components/Header.vue'
import ProfileInfo from '@/indexApp/components/profile/ProfileInfo.vue'
import Banner from '@/indexApp/components/Banner.vue'
import Footer from '@/indexApp/components/Footer.vue'
const ProfileMenu = defineAsyncComponent(() => import('@/indexApp/components/profile/ProfileMenu.vue'))

const route = useRoute()
const user = JSON.parse(localStorage.getItem("CUR_USER"))
const isCurUser = computed(() => {
    return route.params.nickname == user.nickname
})

const state = reactive({
    user: undefined,
    headerConfig: {
        title: route.params.nickname,
        goBack: !isCurUser.value,
        showMenu: true,
        menuIcon: 'more_horiz',
        iconTooltip: '更多选项'
    },
    lastWheelDirection: 0,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showProfileMenus: false,
    recoverFromOnDeactivated: false,
    tabs: [
        { id: 'postTimelinePage', name: '帖子', visibility: 'PUBLIC', count: 0},
        { id: 'reviewTimelinePage', name: '评论', visibility: 'PUBLIC', count: 0},
        { id: 'mediaTimelinePage', name: '媒体', visibility: 'PUBLIC', count: 0},
        { id: 'likeTimelinePage', name: '喜欢', visibility: 'PUBLIC', count: 0}
    ]
})

const tabAccentWidth = computed(() => `${1 / state.tabs.length * 100}%`)

const tabTranslateX = computed(() => {
    const activeIndex = Math.max(state.tabs.findIndex(it => it.id === route.name), 0)
    return `${activeIndex * 100}% 0`
})

const isPrivateAccountAndNotFollowed = computed(() => {
    return state.user.confirmFollow && state.user.yourFollowStatus !== 'FOLLOW' && state.curUser.id !== state.user.id
})

async function getUser(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).message)

        const user = await response.json()
        state.user = user
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

async function refreshProfileOnUi(){
    try{
        await getUser(state.user.id)
        state.lastTimestamp = state.user?.lastPostAt || Date.now()
    }catch (e) {
        store.setErrorMsg(e.message)
    }
}

function handleAction() {
    state.showProfileMenus = true
}

function showSlide(images, idx) {
    store.showSlide(images, idx)
}

function dismissProfileMenus() {
    state.showProfileMenus = false
}

function handleScroll(){
    document.querySelector('#profile>#h').setAttribute('style', `opacity:${Math.min(100, this.scrollY)}%`)
}

function removeFanOnUi(){
    state.user.yourFanStatus = 'NOT_FAN'
}

function newCurUser({ user }){
    state.user = user
    localStorage.setItem('CUR_USER', JSON.stringify(user))
}

watch(() => route.name, (_, oldVal) => {
    if(oldVal === 'profileEdit' && route.meta.key === 'profile'){
        getUser(route.params.nickname)
    }
})

onMounted(async () => {
    await getUser(route.params.nickname)
    state.lastTimestamp = state.user?.lastPostAt || Date.now()

    if(!CSS.supports('animation-timeline: scroll()')){
        window.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

provide('dismissProfileMenus', { dismissProfileMenus: dismissProfileMenus })
provide('refreshProfileOnUi', { refreshProfileOnUi: refreshProfileOnUi })
provide('removeFanOnUi', { removeFanOnUi: removeFanOnUi })
provide('newCurUser', { newCurUser })
</script>