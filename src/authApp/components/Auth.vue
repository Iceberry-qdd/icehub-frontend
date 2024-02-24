<template>
    <div class="absolute bg-gray-100 flex h-full items-center justify-center w-full">
        <div
            v-if="state.loginPanel"
            id="login-panel"
            class="bg-white flex h-2/3 items-center justify-center rounded-xl w-1/3">
            <div class="flex flex-col gap-y-4 items-center justify-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/icon.svg" width="48" height="48" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="font-bold text-2xl">{{ state.appName }}</div>
                <input 
                    v-model="state.nickname"
                    :disabled="state.loading"
                    class="bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring px-4 py-2 rounded-full text-[11pt] w-64"
                    type="text"
                    placeholder="请输入账号名"
                    @keyup.enter.exact="tryLogin(false)" />
                <input
                    v-model="state.password"
                    :disabled="state.loading"
                    class="bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring px-4 py-2 rounded-full text-[11pt] w-64"
                    type="password"
                    placeholder="请输入密码" 
                    @keyup.enter.exact="tryLogin(false)" />
                <div>
                    <button
                        type="button"
                        name="login"
                        :disabled="state.loading"
                        :class="[state.loading ? 'bg-blue-300' : 'bg-blue-500']"
                        class="p-2 rounded-full shadow-blue-200/50 shadow-lg text-[11pt] text-white w-64"
                        @click="tryLogin(false)">
                        <svg
                            v-if="state.loading"
                            class="animate-spin h-5 left-[calc(50%-0.875rem)] relative text-white w-5"
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
                <div class="text-[10pt] text-right w-full">
                    <span class="text-gray-500">还没有账号？点此</span>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <span class="cursor-pointer hover:underline text-blue-500" @click="toggleRegister">注册</span>
                </div>
                <div class="hidden">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="text-[10pt] text-gray-400">or</div>
                </div>
                <button
                    type="button"
                    class="bg-black font-bold hidden px-6 py-2 rounded-full text-[11pt] text-white">
                    仅浏览
                </button>
            </div>
        </div>

        <div
            v-else-if="state.registerPanel"
            id="register-panel"
            class="bg-white flex h-2/3 items-center justify-center relative rounded-xl w-1/3">
            <button
                name="返回登录"
                type="button"
                class="absolute cursor-pointer left-[1rem] material-icons-round text-[12pt] top-[1rem]"
                @click="toggleLogin(state.nickname)">
                arrow_back_ios
            </button>
            <div class="flex flex-col gap-y-4 items-center justify-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/icon.svg" width="48" height="48" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="font-bold text-2xl">{{ state.appName }}</div>
                <input
                    v-model="state.nickname"
                    :disabled="state.loading"
                    class="bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring px-4 py-2 rounded-full text-[11pt] w-64"
                    type="text"
                    placeholder="请输入账号名" />
                <input
                    v-model="state.password"
                    :disabled="state.loading"
                    class="bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring px-4 py-2 rounded-full text-[11pt] w-64"
                    type="password"
                    placeholder="请输入密码" />
                <input
                    v-model="state.rePassword"
                    :disabled="state.loading"
                    class="bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring px-4 py-2 rounded-full text-[11pt] w-64"
                    type="password"
                    placeholder="请再次输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button
                        type="button"
                        name="login"
                        :class="[state.loading ? 'bg-neutral-500' : 'bg-black']"
                        :disabled="state.loading"
                        class="p-2 rounded-full shadow-lg shadow-neutral-300 text-[11pt] text-white w-64"
                        @click="tryRegister">
                        <svg
                            v-if="state.loading"
                            class="animate-spin h-5 left-[calc(50%-0.875rem)] relative text-white w-5"
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
            class="bg-white flex flex-col gap-y-4 h-2/3 items-center justify-center rounded-xl w-1/3">
            <div class="flex flex-col items-center justify-center mb-10">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <a href="/index"><img src="/icon.svg" width="48" height="48" /></a>
                <!-- eslint-disable-next-line vue/max-attributes-per-line vue/singleline-html-element-content-newline -->
                <div id="brand-name" class="font-bold text-2xl">{{ state.appName }}</div>
            </div>
            <Avatar
                class="box-content h-[5rem] object-cover rounded-[8px] text-[5rem] w-[5rem]"
                :user="{nickname: state.nickname}">
            </Avatar>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-bold text-[1rem]">{{ state.nickname }}</div>
            <button
                type="button"
                name="login"
                :disabled="state.loading"
                :class="[state.loading ? 'bg-blue-300' : 'bg-blue-500']"
                class="p-2 rounded-full shadow-blue-200/50 shadow-lg text-[11pt] text-white w-64"
                @click="tryLogin(true)">
                <svg
                    v-if="state.loading"
                    class="animate-spin h-5 left-[calc(50%-0.875rem)] relative text-white w-5"
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
                class="bg-black p-2 rounded-full shadow-blue-200/50 shadow-lg text-[11pt] text-white w-64"
                @click="toggleLogin('', true)">
                <span>登录其它账号</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { getPublicKey, login, register } from '@/authApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { JSEncrypt } from 'jsencrypt'
import { reactive, onMounted, defineAsyncComponent } from 'vue'
const Avatar = defineAsyncComponent(() => import('@/components/Avatar.vue'))

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
        top.location = `http://${window.document.location.host}/auth.html`
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
        self.location = 'index'
        window.history.forward(1);
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
    const token = localStorage.getItem('TOKEN')
    if(token){
        self.location = 'index'
        return
    }
    const queryParams = window.document.location.search
    if (!queryParams) {
        toggleLogin()
        return
    }

    try {
        const quickLoginData = queryParams.substring(1, queryParams.length)
            .split('&')
            .filter(it => it.substring(0, it.indexOf('=')) === 'ph')
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