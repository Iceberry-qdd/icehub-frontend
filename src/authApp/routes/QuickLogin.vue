<template>
    <div
        id="quickLoginPanel">
        <div class="3xl:gap-x-4 3xl:m-8 flex flex-row gap-x-2 items-center m-4 max-sm:absolute max-sm:top-0">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <a href="/index"><img src="/favicon.ico" class="3xl:h-[36px] 3xl:w-[36px] h-[24px] w-[24px]" /></a>
            <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
            <div id="brand-name" class="3xl:text-[1.8rem] font-bold text-[0.9rem]">{{ state.appName }}</div>
        </div>
        <div class="3xl:gap-y-8 flex flex-col gap-y-4 items-center justify-center max-sm:h-screen max-sm:px-0 max-sm:py-0 max-sm:w-screen px-28 py-16">
            <Avatar
                class="3xl:h-[10rem] 3xl:rounded-[16px] 3xl:text-[10rem] 3xl:w-[10rem] box-content h-[5rem] object-cover rounded-[8px] text-[5rem] w-[5rem]"
                :user="{nickname: state.nickname}">
            </Avatar>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="3xl:text-[3rem] font-bold text-[1.5rem]">{{ state.nickname }}</div>
            <Turnstile
                class="w-fit"
                action="quick-login"
                :c-data="state.nickname"
                @token="handleToken"
                @widget-id="handleWidgetId">
            </Turnstile>
            <button
                type="button"
                name="login"
                :disabled="state.loading"
                :class="[state.loading || !state.turnstile.token ? 'bg-blue-300 cursor-not-allowed pointer-events-none' : 'bg-blue-500']"
                class="3xl:p-4 3xl:text-[2rem] max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-[300px]"
                @click="tryLogin(true)">
                <IconLoading
                    v-if="state.loading"
                    class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                </IconLoading>
                <span v-else>一键登录</span>
            </button>
            <button
                type="button"
                name="login"
                class="3xl:p-4 3xl:text-[2rem] bg-black max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-[300px]"
                @click="routeTo('login')">
                <span>登录其它账号</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
#quickLoginPanel {
    display: block;
}
</style>

<script setup>
import { reactive, defineAsyncComponent, onMounted } from 'vue'
import { getPublicKey, login } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { useRoute, useRouter } from 'vue-router'
import { encodePwd } from '@/authApp/util/util.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import Turnstile from '@/authApp/components/Turnstile.vue'
const Avatar = defineAsyncComponent(() => import('@/components/Avatar.vue'))

const route = useRoute()
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
    router.push({ name: routeName })
}

async function tryLogin(skipEncodePassword) {
    state.loading = true
    try {
        if (!state.nickname.length || !state.password.length) {
            throw new Error("账户名和密码不能为空！")
        }
        if (!state.publicKey) { await getPK() }

        const encryptedPK = skipEncodePassword ? state.password : encodePwd(state.publicKey, state.password)
        const authorization = `Basic ${btoa(`${encodeURIComponent(state.nickname)}:${encryptedPK}`)}`
        const response = await login(authorization, state.turnstile.token)
        if (!response.ok) throw new Error((await response.json()).message)

        const token = await response.text()
        localStorage.setItem("TOKEN", token)
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

async function getPK() {
    try {
        const response = await getPublicKey()
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.text()
        state.publicKey = result
    } catch (e) {
        store.setErrorMsg(e.message)
    }
}

function handleToken({ token }) {
    state.turnstile.token = token
}

function handleWidgetId({ widgetId }) {
    state.turnstile.widgetId = widgetId
}

onMounted(() => {
    try {
        const queryParam = route.query?.ph
        const quickLoginData = [...Array(queryParam)]
            .map(it => atob(it))
            .map(it => { return { u: decodeURIComponent(it.split(':')[0]), p: it.split(':')[1] } })[0]
        state.nickname = quickLoginData.u
        state.password = quickLoginData.p
    } catch (e) {
        console.error(e)
        routeTo('login')
    }
})
</script>