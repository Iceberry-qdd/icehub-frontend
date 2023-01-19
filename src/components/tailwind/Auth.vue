<template>
    <div class="flex flex-row w-full h-full absolute">
        <div id="poster" class="basis-2/5 h-full">
            <div>
                <img id="brand-bg" class="cursor-default object-cover h-screen w-full grayscale hover:grayscale-0"
                    src="http://192.168.0.101:9000/b072e283-924e-4a3f-b362-2b4577041e09/095a3775479e5c6255b37346eb4f1658.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=SIHDHMTXP75LANWE1N9A%2F20230108%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230108T101804Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiJTSUhESE1UWFA3NUxBTldFMU45QSIsImV4cCI6MTY3MzE3NjY2NiwicGFyZW50IjoibWluaW9hZG1pbiJ9.lpAm-X3iKddwlyu2G-GvpFjt3K_NoDqCi1H10OmjA9-zRhf5ovSiRGiEJpGiXLj6SBXrNaUkGXcL6JbQDuyRWg&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=c471d5fdd64dcefc20f3a3293440c7f455fc1ec995633a7c2b6d425e42aea880" />
            </div>
        </div>
        <div v-if="loginPannel" id="login-panel" class="basis-3/5 h-full bg-gray-100 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div id="brand-name" class="font-bold text-2xl">Icehub</div>
                <input :disabled="state.loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="state.loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="password" type="password" placeholder="请输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button :disabled="state.loading" @click="login"
                        class="p-2 w-32 bg-blue-500 rounded-md text-md text-white" name="login">
                        <svg v-if="state.loading" class="animate-spin relative left-[2.725rem] h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-else>登录</span>
                    </button>
                    <button :disabled="state.loading" :class="{ 'cursor-not-allowed': state.loading }"
                        @click="toggleRegister" class="p-2 w-32 bg-white rounded-md text-md text-black"
                        name="login">注册</button>
                </div>
            </div>
        </div>

        <div v-else id="register-panel" class="basis-3/5 h-full bg-gray-100 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div id="brand-name" class="font-bold text-2xl">Panboo</div>
                <!-- <div id="avatar-selector" class="font-bold text-2xl">
                    <div class="w-20 h-20 bg-blue-300 rounded-full "></div>
                </div> -->
                <input :disabled="state.loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="state.loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="password" type="password" placeholder="请输入密码" />
                <input :disabled="state.loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="rePassword" type="password" placeholder="请再次输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button :disabled="state.loading" @click="register"
                        class="p-2 w-32 bg-gray-100 rounded-md text-md text-black" name="login">
                        <svg v-if="state.loading" class="animate-spin relative left-[2.725rem] h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-else><i class="bi bi-arrow-right-circle text-lg"></i></span>
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>

</style>

<script setup>
import { getPublicKey } from '@/api';
import { store } from '@/store'
import { JSEncrypt } from 'jsencrypt';
import { reactive } from 'vue';

const state = reactive({
    nickname: "",
    password: "",
    publicKey: "",
    rePassword: "",
    loading: false,
    loginFailed: false,
    loginPannel: true,
    avatarUrl: ""
})

function toggleRegister() { state.loginPannel = false }

async function getPK() {
    try {
        const response = await getPublicKey()
        if (!response.ok) throw new Error(await response.text())

        const result = await response.text()
        state.publicKey = result
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
}

async function login() {
    state.loading = true
    try {
        if (state.nickname.length == 0 || state.password.length == 0) {
            throw new Error("账户名和密码不能为空！")
        }

        if (state.publicKey == "" || state.publicKey == null) {
            await getPK()
        }
        const encryptedPK = encodePwd(state.publicKey, state.password)

        const response = await login(state.nickname, encryptedPK)
        if (!response.ok) throw new Error(await response.text())

        const token = await response.text()
        localStorage.setItem("TOKEN", token)
        store.setMsg("登录成功！")
        self.location = 'index'
        window.history.forward(1);
    } catch (e) {
        state.loginFailed = true
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

async function register() {
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
        if (!response.ok) throw new Error(await response.text())
        state.store.setSuccessMsg("注册成功！");
        state.password = ''
        state.rePassword = ''
        state.loginPannel = true
    } catch (e) {
        state.loginFailed = true
        state.store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

</script>