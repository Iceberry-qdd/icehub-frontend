<template>
    <div class="dark:divide-neutral-700 divide-x flex flex-nowrap flex-row max-sm:h-screen modern-scrollbar-y overflow-y-auto relative">
        <div
            id="setting"
            class="h-screen lg:basis-[30%] max-lg:w-full max-lg:z-[1] sm:max-lg:bg-inherit"
            :class="{'max-lg:hidden': $route.name !== 'setting'}">
            <Header
                class="sticky"
                :title="state.headerConfig.title"
                :go-back="state.headerConfig.goBack"
                :show-menu="state.headerConfig.showMenu"
                :menu-icon="state.headerConfig.menuIcon"
                :no-border="state.headerConfig.noBorder">
            </Header>
            <div class="cursor-pointer">
                <div
                    v-for="menu in state.menus.filter(it => it.show)"
                    :key="menu.id"
                    :class="{'bg-[#f4f4f5] dark:bg-primaryContainer border-l-primary dark:border-l-onPrimary border-l-4 pl-[calc(1rem-4px)]': [$route.name, $route.meta?.parent].includes(menu.id)}"
                    class="flex flex-row hover:bg-helper items-center justify-between max-sm:p-3 p-4 text-[12pt]"
                    @click="routeTo(menu.id)">
                    <div class="flex flex-row gap-x-2 items-center">
                        <span class="material-symbols-rounded no-hover p-0">{{ menu.icon }}</span>
                        <span>{{ menu.name }}</span>
                    </div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="material-symbols-rounded no-hover p-0 text-[1rem]">arrow_forward_ios</div>
                </div>
                <Logout class="max-sm:p-3 p-4 text-onError"></Logout>
            </div>
        </div>
        <div
            :class="{'lg:basis-[50%] max-lg:absolute max-lg:bg-inherit max-lg:w-full': $route.name !== 'setting', 'max-lg:hidden': $route.name === 'setting'}"
            class="h-screen no-scrollbar overflow-y-auto">
            <!-- eslint-disable-next-line vue/no-undef-components, vue/component-name-in-template-casing -->
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component
                        :is="Component"
                        :key="$route.name"
                        @route-to="(name) => routeTo(name)">
                    </component>
                </keep-alive>
            </router-view>
        </div>
        <div
            id="placeholder"
            class="basis-[20%] h-screen max-lg:hidden"
            :class="{'hidden': $route.name === 'setting'}" />
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import { useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import Logout from '@/indexApp/components/setting/accountSafe/Logout.vue'
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)

const router = useRouter()
const state = reactive({
    headerConfig: {
        title: '设置',
        goBack: computed(() => store.MOBILE_MODE),
        showMenu: false,
        menuIcon: undefined,
        noBorder: computed(() => !store.PAD_MODE && !store.MOBILE_MODE)
    },
    menus: [
        { id: "accountSafe", name: '账号与安全', icon:"shield_person", show: true },
        { id: "notifyMsg", name: '消息通知', icon:"notifications", show: true },
        { id: "dataPrivacy", name: '数据与隐私', icon:"encrypted", show:true },
        { id: "displayTheme", name: '界面个性化设置', icon:"palette", show:true },
        { id: "helpFeedback", name: '帮助与反馈', icon:"help", show: showUnImpl },
        { id: "about", name: '关于', icon:"info", show: true }
    ]
})

function routeTo(name) {
    router.push({ name: name })
}
</script>