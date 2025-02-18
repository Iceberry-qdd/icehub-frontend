<template>
    <div
        id="register-panel"
        class="bg-gray-100 dark:bg-inherit flex h-[100dvh] items-center justify-center w-[100dvw]">
        <div class="bg-white dark:bg-surface flex items-center justify-center max-sm:h-full max-sm:rounded-none max-sm:w-full relative rounded-lg">
            <button
                name="返回登录"
                type="button"
                class="absolute cursor-pointer left-4 material-symbols-rounded max-sm:text-[1.25rem] text-[1.1rem] top-4"
                @click="routeTo('login')">
                arrow_back_ios_new
            </button>
            <div class="flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-28 py-16">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/favicon.ico" class="h-[48px] lg:max-xl:h-[36px] lg:max-xl:w-[36px] w-[48px]" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="font-bold lg:max-xl:text-xl text-2xl">{{ state.appName }}</div>
                <form
                    id="register-form"
                    autocomplete="on"
                    class="contents">
                    <input
                        v-model="state.nickname"
                        :disabled="state.loading || !state.turnstile.token"
                        class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-[300px]"
                        type="text"
                        placeholder="请输入账号名"
                        autocomplete="username" />
                    <input
                        v-model="state.password"
                        :disabled="state.loading || !state.turnstile.token"
                        class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-[300px]"
                        type="password"
                        placeholder="请输入密码"
                        autocomplete="new-password" />
                    <input
                        v-model="state.rePassword"
                        :disabled="state.loading || !state.turnstile.token"
                        class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-[300px]"
                        type="password"
                        placeholder="请再次输入密码"
                        autocomplete="new-password" />
                    <Turnstile
                        class="w-fit"
                        action="register"
                        :c-data="state.nickname"
                        @token="handleToken"
                        @widget-id="handleWidgetId">
                    </Turnstile>
    
                    <button
                        type="button"
                        name="login"
                        :class="[state.loading || !state.turnstile.token ? 'dark:shadow-neutral-800/50 bg-neutral-500 dark:bg-neutral-800 dark:text-blue-300/25 cursor-not-allowed pointer-events-none' : 'dark:text-blue-300 dark:shadow-neutral-700/50 bg-black dark:bg-neutral-700']"
                        :disabled="state.loading"
                        class="font-bold lg:max-xl:text-[0.9rem] max-sm:py-3 p-2 rounded-full shadow-lg shadow-neutral-300 text-[1rem] text-white w-[300px]"
                        @click="tryRegister">
                        <IconLoading
                            v-if="state.loading"
                            class="dark:text-white/25 h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                        </IconLoading>
                        <span v-else>注册</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { register } from '@/authApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import Turnstile from '@/authApp/components/Turnstile.vue'

const router = useRouter()
const state = reactive({
    appName: import.meta.env.VITE_APP_TITLE,
    loading: false,
    nickname: authStore.NICKNAME,
    password: "",
    rePassword: "",
    turnstile: { token: undefined, widgetId: undefined }
})

function routeTo(routeName) {
    authStore.setNickname(state.nickname)
    router.push({ name: routeName })
}

async function tryRegister() {
    state.loading = true
    try {
        if (!state.nickname || !state.password || !state.rePassword) {
            throw new Error("账户名和密码不能为空！")
        }
        if (!state.turnstile.token) {
            throw new Error('需要填充验证码！')
        }

        if (state.password != state.rePassword) {
            throw new Error("两次输入密码不一致！")
        }

        const response = await register(state.nickname, state.password, undefined, state.turnstile.token)
        if (!response.ok) throw new Error((await response.json()).message)
        store.setSuccessMsg("注册成功！")
        state.password = ''
        state.rePassword = ''
        routeTo('login')
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
        turnstile.reset(state.turnstile.widgetId)
        state.turnstile.token = undefined
    } finally {
        state.loading = false
    }
}

function handleToken({ token }) {
    state.turnstile.token = token
}

function handleWidgetId({ widgetId }) {
    state.turnstile.widgetId = widgetId
}
</script>