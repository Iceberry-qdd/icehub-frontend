<template>
    <div class="absolute bg-gray-100 flex h-full items-center justify-center w-full">
        <div
            v-if="state.loginPanel"
            id="login-panel"
            class="bg-white flex items-center justify-center max-h-[100vh] max-sm:h-[100vh] max-sm:w-[100vw] max-w-[100vw] rounded-xl">
            <div class="3xl:gap-y-8 flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-32 py-16">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/favicon.ico" class="3xl:h-[96px] 3xl:w-[96px] h-[48px] lg:max-xl:h-[36px] lg:max-xl:w-[36px] w-[48px]" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="3xl:text-5xl font-bold lg:max-xl:text-xl text-2xl">{{ state.appName }}</div>
                <input 
                    v-model="state.nickname"
                    :disabled="state.loading"
                    class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                    type="text"
                    placeholder="请输入账号名"
                    @keyup.enter.exact="tryLogin(false)" />
                <input
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
                        <svg
                            v-if="state.loading"
                            class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span v-else>登录</span>
                    </button>
                </div>
                <div class="3xl:text-[1.4rem] max-sm:text-[0.8rem] text-[0.7rem] text-right w-full">
                    <span class="text-gray-500">还没有账号？点此</span>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span class="cursor-pointer hover:underline text-blue-500" @click="toggleRegister">注册</span>
                </div>
                <div class="">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="3xl:text-[1.6rem] text-[0.8rem] text-gray-400">or</div>
                </div>
                <button
                    type="button"
                    class="3xl:px-12 3xl:py-4 3xl:text-[2rem] bg-black font-bold lg:max-xl:px-4 lg:max-xl:text-[0.9rem] max-sm:py-3 px-6 py-2 rounded-full text-[1rem] text-white">
                    仅浏览
                </button>
            </div>
        </div>

        <div
            v-else-if="state.registerPanel"
            id="register-panel"
            class="bg-white flex items-center justify-center max-h-[100vh] max-sm:h-[100vh] max-sm:w-[100vw] max-w-[100vw] relative rounded-xl">
            <button
                name="返回登录"
                type="button"
                class="3xl:left-8 3xl:text-[2.2rem] 3xl:top-[2rem] absolute cursor-pointer left-4 material-icons-round max-sm:text-[1.25rem] text-[1.1rem] top-[2rem]"
                @click="toggleLogin(state.nickname)">
                arrow_back_ios
            </button>
            <div class="3xl:gap-y-8 flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-32 py-16">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/favicon.ico" class="3xl:h-[96px] 3xl:w-[96px] h-[48px] lg:max-xl:h-[36px] lg:max-xl:w-[36px] w-[48px]" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="3xl:text-5xl font-bold lg:max-xl:text-xl text-2xl">{{ state.appName }}</div>
                <input
                    v-model="state.nickname"
                    :disabled="state.loading"
                    class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                    type="text"
                    placeholder="请输入账号名" />
                <input
                    v-model="state.password"
                    :disabled="state.loading"
                    class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                    type="password"
                    placeholder="请输入密码" />
                <input
                    v-model="state.rePassword"
                    :disabled="state.loading"
                    class="3xl:px-8 3xl:py-4 3xl:text-[2rem] 3xl:w-[32rem] bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 px-4 py-2 rounded-full text-[1rem] w-64"
                    type="password"
                    placeholder="请再次输入密码" />
                <div class="3xl:gap-x-16 flex flex-row gap-x-8">
                    <button
                        type="button"
                        name="login"
                        :class="[state.loading ? 'bg-neutral-500' : 'bg-black']"
                        :disabled="state.loading"
                        class="3xl:p-4 3xl:text-[2rem] 3xl:w-[32rem] lg:max-xl:text-[0.9rem] lg:max-xl:w-52 max-sm:py-3 p-2 rounded-full shadow-lg shadow-neutral-300 text-[1rem] text-white w-64"
                        @click="tryRegister">
                        <svg
                            v-if="state.loading"
                            class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span v-else>注册</span>
                    </button>
                </div>
            </div>
        </div>

        <div
            v-else-if="state.quickLoginPanel"
            id="quickLoginPanel"
            class="bg-white max-h-[100vh] max-sm:h-[100vh] max-sm:w-[100vw] max-w-[100vw] rounded-xl">
            <div class="3xl:gap-x-4 3xl:m-8 flex flex-row gap-x-2 items-center m-4 max-sm:absolute max-sm:top-0">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/favicon.ico" class="3xl:h-[36px] 3xl:w-[36px] h-[24px] w-[24px]" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="3xl:text-[1.8rem] font-bold text-[0.9rem]">{{ state.appName }}</div>
            </div>
            <div class="3xl:gap-y-8 flex flex-col gap-y-4 items-center justify-center max-sm:h-screen max-sm:px-0 max-sm:py-0 max-sm:w-screen px-32 py-16">
                <Avatar
                    class="3xl:h-[10rem] 3xl:rounded-[16px] 3xl:text-[10rem] 3xl:w-[10rem] box-content h-[5rem] object-cover rounded-[8px] text-[5rem] w-[5rem]"
                    :user="{nickname: state.nickname}">
                </Avatar>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="3xl:text-[3rem] font-bold text-[1.5rem]">{{ state.nickname }}</div>
                <button
                    type="button"
                    name="login"
                    :disabled="state.loading"
                    :class="[state.loading ? 'bg-blue-300' : 'bg-blue-500']"
                    class="3xl:p-4 3xl:text-[2rem] 3xl:w-[32rem] max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-64"
                    @click="tryLogin(true)">
                    <svg
                        v-if="state.loading"
                        class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span v-else>一键登录</span>
                </button>
                <button
                    type="button"
                    name="login"
                    class="3xl:p-4 3xl:text-[2rem] 3xl:w-[32rem] bg-black max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-64"
                    @click="toggleLogin('', true)">
                    <span>登录其它账号</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getPublicKey, login, register } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { JSEncrypt } from 'jsencrypt'
import { reactive, onMounted, defineAsyncComponent } from 'vue'
const Avatar = defineAsyncComponent(() => import('@/components/Avatar.vue'))

const emits = defineEmits(['referer'])
const state = reactive({
    nickname: "",
    password: "",
    publicKey: "",
    rePassword: "",
    loading: false,
    loginPanel: true,
    registerPanel: false,
    quickLoginPanel: false,
    avatarUrl: "",
    appName: import.meta.env.VITE_APP_TITLE
})

function toggleRegister() {
    state.loginPanel = false
    state.quickLoginPanel = false
    state.registerPanel = true
}

function toggleLogin(username = "", refresh = false) {
    if (refresh) {
        location = `${window.location.origin}/auth.html`
        return
    }

    state.loginPanel = true
    state.quickLoginPanel = false
    state.registerPanel = false
    state.nickname = username
}

function toggleQuickLogin({ u, p }) {
    state.loginPanel = false
    state.quickLoginPanel = true
    state.registerPanel = false
    state.nickname = u
    state.password = p
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

function encodePwd(publicKey, pwd) {
    const encrypt = new JSEncrypt()
    encrypt.setPrivateKey(publicKey)
    const encryptedPK = encrypt.encrypt(pwd)
    return encryptedPK
}

async function tryRegister() {
    state.loading = true
    try {
        if (state.nickname.length == 0 || state.password.length == 0 || state.rePassword.length == 0) {
            throw new Error("账户名和密码不能为空！")
        }

        if (state.nickname.includes('=') || state.password.includes('=')) {
            throw new Error('用户名或密码不能含有等于号！')
        }

        if (state.password != state.rePassword) {
            throw new Error("两次输入密码不一致！")
        }

        if (state.publicKey == "" || state.publicKey == null) {
            await getPK()
        }
        const encryptedPK = encodePwd(state.publicKey, state.password)
        const response = await register(state.nickname, encryptedPK)
        if (!response.ok) throw new Error((await response.json()).error)
        store.setSuccessMsg("注册成功！");
        state.password = ''
        state.rePassword = ''
        toggleLogin(state.nickname)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

onMounted(() => {
    const queryParams = window.document.location.search
        .substring(1)
        .split('&')
        .find(it => it.substring(0, it.indexOf('=')) === 'ph')
    if (!queryParams) {
        toggleLogin()
        return
    }

    try {
        const quickLoginData = [...Array(queryParams)]
            .map(it => it.substring(it.indexOf('=') + 1, it.length))
            .map(it => atob(it))
            .map(it => { return { u: decodeURIComponent(it.split(':')[0]), p: it.split(':')[1] } })[0]
        toggleQuickLogin(quickLoginData)
    } catch (e) {
        console.error(e)
        toggleLogin()
    }
})
</script>