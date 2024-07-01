<template>
    <div
        id="login-panel"
        class="">
        <div class="3xl:gap-y-8 flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-32 py-16">
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <a href="/index"><img src="/favicon.ico" class="3xl:h-[96px] 3xl:w-[96px] h-[48px] lg:max-xl:h-[36px] lg:max-xl:w-[36px] w-[48px]" /></a>
            <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
            <div id="brand-name" class="3xl:text-5xl font-bold lg:max-xl:text-xl text-2xl">{{ state.appName }}</div>
            <input
                id="nickname"
                v-model="state.nickname"
                :disabled="state.loading"
                class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                type="text"
                placeholder="请输入账号名"
                @keyup.enter.exact="tryLogin(false)" />
            <input
                id="password" 
                v-model="state.password"
                :disabled="state.loading"
                class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                type="password"
                placeholder="请输入密码"
                @keyup.enter.exact="tryLogin(false)" />
            <div>
                <button
                    type="button"
                    name="login"
                    :disabled="state.loading"
                    :class="[state.loading ? 'bg-blue-300' : 'bg-blue-500']"
                    class="3xl:p-4 3xl:text-[2rem] 3xl:w-[32rem] lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-64"
                    @click="tryLogin(false)">
                    <IconLoading
                        v-if="state.loading"
                        class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                    </IconLoading>
                    <span v-else>登录</span>
                </button>
            </div>
            <div class="3xl:text-[1.4rem] max-sm:text-[0.8rem] text-[0.7rem] text-right w-full">
                <span class="text-gray-500">还没有账号？点此</span>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <span class="cursor-pointer hover:underline text-blue-500" @click="routeTo('register')">注册</span>
            </div>
            <div v-if="showUnImpl">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="3xl:text-[1.6rem] text-[0.8rem] text-gray-400">or</div>
            </div>
            <button
                v-if="showUnImpl"
                type="button"
                class="3xl:px-12 3xl:py-4 3xl:text-[2rem] bg-black font-bold lg:max-xl:px-4 lg:max-xl:text-[0.9rem] max-sm:py-3 px-6 py-2 rounded-full text-[1rem] text-white">
                仅浏览
            </button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { getPublicKey, login } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { useRouter } from 'vue-router'
import { encodePwd } from '@/authApp/util/util.js'
import IconLoading from '@/components/icons/IconLoading.vue'
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)

const router = useRouter()
const emits = defineEmits(['referer'])
const state = reactive({
    appName: import.meta.env.VITE_APP_TITLE,
    loading: false,
    nickname: authStore.NICKNAME,
    password: ""
})

function routeTo(routeName){
    authStore.setNickname(state.nickname)
    router.push({name: routeName})
}

async function tryLogin(skipEncodePassword) {
    state.loading = true
    try {
        if (state.nickname.length == 0 || state.password.length == 0) {
            throw new Error("账户名和密码不能为空！")
        }
        if (!state.publicKey) { await getPK() }

        const encryptedPK = skipEncodePassword ? state.password : encodePwd(state.publicKey, state.password)
        const authorization = `Basic ${btoa(`${encodeURIComponent(state.nickname)}:${encryptedPK}`)}`
        const response = await login(authorization)
        if (!response.ok) throw new Error((await response.json()).error)

        const token = await response.text()
        localStorage.setItem("TOKEN", token)
        store.setSuccessMsg("登录成功！")
        emits('referer')
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function getPK() {
    try {
        const response = await getPublicKey()
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.text()
        state.publicKey = result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}
</script>