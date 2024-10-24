<template>
    <div
        id="login-panel"
        class="">
        <div class="flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-28 py-16">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <a href="/index"><img src="/favicon.ico" class="h-[48px] lg:max-xl:h-[36px] lg:max-xl:w-[36px] w-[48px]" /></a>
            <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
            <div id="brand-name" class="font-bold lg:max-xl:text-xl text-2xl">{{ state.appName }}</div>
            <form
                id="login-form"
                autocomplete="on"
                class="contents">
                <input
                    id="nickname"
                    v-model="state.nickname"
                    :disabled="state.loading"
                    class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-[300px]"
                    type="text"
                    placeholder="请输入账号名"
                    @keyup.enter.exact="tryLogin" />
                <input
                    id="password"
                    v-model="state.password"
                    :disabled="state.loading"
                    class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-[300px]"
                    type="password"
                    placeholder="请输入密码"
                    @keyup.enter.exact="tryLogin" />
                <Turnstile
                    class="w-fit"
                    action="login"
                    :c-data="state.nickname"
                    @token="handleToken"
                    @widget-id="handleWidgetId">
                </Turnstile>
                <button
                    type="button"
                    name="login"
                    :disabled="state.loading"
                    :class="[state.loading || !state.turnstile.token ? 'dark:shadow-neutral-800/50 bg-blue-300 dark:bg-neutral-800 dark:text-blue-300/25 cursor-not-allowed pointer-events-none' : 'dark:text-blue-300 dark:shadow-neutral-700/50 bg-blue-500 dark:bg-neutral-700']"
                    class="font-bold lg:max-xl:text-[0.9rem] max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-[300px]"
                    @click="tryLogin">
                    <IconLoading
                        v-if="state.loading"
                        class="animate-spin dark:text-white/25 h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                    </IconLoading>
                    <span v-else>登录</span>
                </button>
            </form>
            <div class="max-sm:text-[0.8rem] text-[0.7rem] text-right w-full">
                <span class="dark:text-white/25 text-gray-500">还没有账号？点此</span>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span class="cursor-pointer dark:text-blue-300 hover:underline text-blue-500" @click="routeTo('register')">注册</span>
            </div>
            <div v-if="showUnImpl && false">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="text-[0.8rem] text-gray-400">or</div>
            </div>
            <button
                v-if="showUnImpl && false"
                type="button"
                class="bg-black font-bold lg:max-xl:px-4 lg:max-xl:text-[0.9rem] max-sm:py-3 px-6 py-2 rounded-full text-[1rem] text-white">
                仅浏览
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { login } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import Turnstile from '@/authApp/components/Turnstile.vue'

const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const router = useRouter()
const emits = defineEmits(['referer'])
const state = reactive({
    appName: import.meta.env.VITE_APP_TITLE,
    loading: false,
    nickname: authStore.NICKNAME,
    password: "",
    turnstile: { token: undefined, widgetId: undefined }
})

function routeTo(routeName) {
    authStore.setNickname(state.nickname)
    router.push({ name: routeName })
}

async function tryLogin() {
    state.loading = true
    try {
        if (!state.nickname || !state.password) {
            throw new Error("账户名和密码不能为空！")
        }
        if (!state.turnstile.token) {
            throw new Error('需要填充验证码！')
        }

        const authorization = { username: state.nickname, password: state.password }
        const response = await login(authorization, state.turnstile.token)
        if (!response.ok) throw new Error((await response.json()).message)

        store.setSuccessMsg("登录成功！")
        emits('referer')
    } catch (e) {
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