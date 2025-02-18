<template>
    <div id="follow">
        <Header
            class="sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon">
        </Header>
        <div class="max-sm:top-[48px] no-scrollbar overflow-x-auto sticky top-[56px] w-full z-[104]">
            <div
                class="after:bg-primary backdrop-blur-xl bg-white/80 cursor-pointer dark:after:bg-onPrimary dark:bg-[#121212dd] dark:text-white/50 flex flex-row min-w-full tab text-[0.9rem] text-zinc-500 w-fit">
                <div
                    v-for="(menu, index) in state.menus"
                    :key="menu.id"
                    :index="index"
                    :class="{ 'text-primary': $route.name === menu.id }"
                    class="flex flex-1 hover:dark:text-onPrimary hover:text-primary items-center justify-center min-w-fit py-2 w-[4.5rem]"
                    @click="routeTo(menu.id)">
                    {{ menu.name }}
                </div>
            </div>
        </div>
        <!-- eslint-disable-next-line vue/component-name-in-template-casing, vue/no-undef-components -->
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component"></component>
            </keep-alive>
        </router-view>
    </div>
</template>

<style scoped>
.tab::after {
    content: '';
    width: v-bind(tabAccentWidth);
    translate: v-bind(tabTranslateX);
    height: 2px;
    position: absolute;
    bottom: 0;
    transition: translate 100ms ease-in-out;
}
</style>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { store } from '@/indexApp/js/store.js'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/indexApp/components/Header.vue'
import { getUserInfoByNickname } from '@/indexApp/js/api.js'

const route = useRoute()
const router = useRouter()
const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    user: undefined,
    menus: [
        { id: 'followList', name: '我订阅' },
        { id: 'fanList', name: '订阅我' },
    ],
    headerConfig: {
        title: route.params.nickname,
        goBack: true,
        showMenu: false,
        menuIcon: undefined
    }
})

const genderCall = computed(() => {
    const gender = state.user?.gender
    if (isMyself.value) return '我'
    if (gender == 'FEMALE') return '她'
    return '他'
})

const isMyself = computed(() => { return state.curUser.id == state.user.id })

function routeTo(name) {
    router.replace({ name: name, params: route.params })
}

const tabAccentWidth = computed(() => `${1 / state.menus.length * 100}%`)

const tabTranslateX = computed(() => {
    const activeIndex = Math.max(state.menus.findIndex(it => it.id === route.name), 0)
    return `${activeIndex * 100}% 0`
})

async function getUserInfo(nickname) {
    try {
        const response = await getUserInfoByNickname(nickname)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.user = result
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    }
}

onMounted(async () => {
    const username = route.params.nickname
    await getUserInfo(username)
    state.menus.forEach(menu => { menu.name = menu.name.replace('我', genderCall.value) })
})
</script>