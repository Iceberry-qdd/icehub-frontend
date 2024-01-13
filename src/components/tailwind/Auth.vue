<template>
    <div class="flex w-full h-full absolute bg-gray-100 justify-center items-center">
        <div v-if="state.loginPanel" id="login-panel"
            class="h-2/3 w-1/3 bg-white flex items-center justify-center rounded-xl">
            <div class="flex flex-col items-center justify-center gap-y-4">
                <a href="/index"><img src="/icon.svg" width="48" height="48"/></a>
                <div id="brand-name" class="font-bold text-2xl">{{ state.appName }}</div>
                <input :disabled="state.loading"
                    class="py-2 px-4 rounded-full w-64 bg-gray-100 text-[11pt] focus:outline-none focus:ring focus:border-blue-500"
                    v-model="state.nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="state.loading"
                    class="py-2 px-4 rounded-full w-64 bg-gray-100 text-[11pt] focus:outline-none focus:ring focus:border-blue-500"
                    v-model="state.password" type="password" placeholder="请输入密码" />
                <div>
                    <button :disabled="state.loading" @click="tryLogin"
                        :class="[state.loading ? 'bg-blue-300' : 'bg-blue-500']"
                        class="p-2 w-64 rounded-full text-[11pt] text-white shadow-lg shadow-blue-200/50" name="login">
                        <svg v-if="state.loading" class="animate-spin relative left-[calc(50%-0.875rem)]  h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-else>登录</span>
                    </button>
                </div>
                <div class="text-[10pt] w-full text-right">
                        <span class="text-gray-500">还没有账号？点此</span>
                        <span class="text-blue-500 hover:underline cursor-pointer" @click="toggleRegister">注册</span>
                </div>
                <div class="hidden ">
                    <div class="text-[10pt] text-gray-400">or</div>
                </div>
                <button type="button" class="hidden bg-black text-white font-bold text-[11pt] py-2 px-6 rounded-full">仅浏览</button>
            </div>
        </div>

        <div v-else id="register-panel"
            class="relative h-2/3 w-1/3 bg-white flex items-center justify-center rounded-xl">
            <button name="返回登录" type="button" @click="toggleLogin('')" class="material-icons-round absolute top-[1rem] left-[1rem] cursor-pointer text-[12pt]">arrow_back_ios</button>
            <div class="flex flex-col items-center justify-center gap-y-4">
                <a href="/index"><img src="/icon.svg" width="48" height="48"/></a>
                <div id="brand-name" class="font-bold text-2xl">{{ state.appName }}</div>
                <input :disabled="state.loading"
                    class="py-2 px-4 rounded-full w-64 bg-gray-100 text-[11pt] focus:outline-none focus:ring focus:border-blue-500"
                    v-model="state.nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="state.loading"
                    class="py-2 px-4 rounded-full w-64 bg-gray-100 text-[11pt] focus:outline-none focus:ring focus:border-blue-500"
                    v-model="state.password" type="password" placeholder="请输入密码" />
                <input :disabled="state.loading"
                    class="py-2 px-4 rounded-full w-64 bg-gray-100 text-[11pt] focus:outline-none focus:ring focus:border-blue-500"
                    v-model="state.rePassword" type="password" placeholder="请再次输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button :disabled="state.loading" @click="tryRegister"
                        :class="[state.loading ? 'bg-neutral-500' : 'bg-black']"
                        class="p-2 w-64 rounded-full text-[11pt] text-white shadow-lg shadow-neutral-300" name="login">
                        <svg v-if="state.loading" class="animate-spin relative left-[calc(50%-0.875rem)] h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-else>注册</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>

<script setup>
import { getPublicKey, login, register } from '@/api'
import { store } from '@/store'
import { JSEncrypt } from 'jsencrypt'
import { reactive } from 'vue'

const state = reactive({
    nickname: "",
    password: "",
    publicKey: "",
    rePassword: "",
    loading: false,
    loginPanel: true,
    avatarUrl: "",
    appName: import.meta.env.VITE_APP_TITLE
})

function toggleRegister() { state.loginPanel = false }
function toggleLogin(username) { 
    state.loginPanel = true
    state.nickname = username
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

async function tryLogin() {
    state.loading = true
    try {
        if (state.nickname.length == 0 || state.password.length == 0) {
            throw new Error("账户名和密码不能为空！")
        }

        if (!state.publicKey) { await getPK() }
        const encryptedPK = encodePwd(state.publicKey, state.password)

        const response = await login(state.nickname, encryptedPK)
        if (!response.ok) throw new Error((await response.json()).error)

        const token = await response.text()
        localStorage.setItem("TOKEN", token)
        store.setSuccessMsg("登录成功！")
        self.location = 'index'
        window.history.forward(1);
    } catch (e) {
        //state.loginFailed = true
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

</script>