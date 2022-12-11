<template>
    <div class="flex flex-row w-full h-full absolute">
        <div id="poster" class="basis-2/5 h-full">
            <div>
                <img id="brand-bg" class="cursor-default object-cover h-full w-full grayscale hover:grayscale-0"
                    src="http://192.168.0.102:9000/b072e283-924e-4a3f-b362-2b4577041e09/david-suarez-6jYopEMk-NA-unsplash.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=9QUA5SAZ2EHSB42NU5ON%2F20221127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221127T041304Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiI5UVVBNVNBWjJFSFNCNDJOVTVPTiIsImV4cCI6MTY2OTUyNTk2NiwicGFyZW50IjoibWluaW9hZG1pbiJ9.5JzLij6hSkKke0XUHClN_E-jnEnePdQB3fCc294paGoKIDxXXG7h_zkPKT84tngblPfpxTQym87l7sK_D6-25Q&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=2ae8b40da88ffe8db7e208a097ac56051742320fcdd0f9e436e8c31653f646b3" />
            </div>
        </div>
        <div v-if="loginPannel" id="login-panel" class="basis-3/5 h-full bg-gray-100 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div id="brand-name" class="font-bold text-2xl">Panboo</div>
                <input :disabled="loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="password" type="password" placeholder="请输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button :disabled="loading" @click="login"
                        class="p-2 w-32 bg-blue-500 rounded-md text-md text-white" name="login">
                        <svg v-if="loading" class="animate-spin relative left-[2.725rem] h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <span v-else>登录</span>
                    </button>
                    <button :disabled="loading" :class="{ 'cursor-not-allowed': loading }" @click="toggleRegister"
                        class="p-2 w-32 bg-white rounded-md text-md text-black" name="login">注册</button>
                </div>
            </div>
        </div>

        <div v-else id="register-panel" class="basis-3/5 h-full bg-gray-100 flex items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-y-4">
                <div id="brand-name" class="font-bold text-2xl">Panboo</div>
                <!-- <div id="avatar-selector" class="font-bold text-2xl">
                    <div class="w-20 h-20 bg-blue-300 rounded-full "></div>
                </div> -->
                <input :disabled="loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="nickname" type="text" placeholder="请输入账号名" />
                <input :disabled="loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="password" type="password" placeholder="请输入密码" />
                <input :disabled="loading"
                    class="p-2 rounded-md w-72 bg-white text-md focus:outline-none focus:ring focus:border-blue-500"
                    v-model="rePassword" type="password" placeholder="请再次输入密码" />
                <div class="flex flex-row gap-x-8">
                    <button :disabled="loading" @click="register"
                        class="p-2 w-32 bg-gray-100 rounded-md text-md text-black" name="login">
                        <svg v-if="loading" class="animate-spin relative left-[2.725rem] h-5 w-5 text-white"
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

<script>
import { getPublicKey, login, register } from '../../api';
import { store } from '../../store'
import { JSEncrypt } from 'jsencrypt';

export default {
    data() {
        return {
            store,
            nickname: "",
            password: "",
            publicKey: "",
            rePassword: "",
            loading: false,
            loginFailed: false,
            loginPannel: true,
            avatarUrl: ""
        }
    },
    methods: {
        toggleRegister() {
            this.loginPannel = false
        },
        async getPK() {
            try {
                const response = await getPublicKey()
                if (!response.ok) throw new Error(await response.text())

                const result = await response.text()
                this.publicKey = result
            } catch (e) {
                this.store.setMsg(e.message)
                console.error(e)
            }
        },

        async login() {
            this.loading = true
            try {
                if (this.nickname.length == 0 || this.password.length == 0) {
                    throw new Error("账户名和密码不能为空！")
                }

                if (this.publicKey == "" || this.publicKey == null) {
                    await this.getPK()
                }
                const encryptedPK = this.encodePwd(this.publicKey, this.password)

                const response = await login(this.nickname, encryptedPK)
                if (!response.ok) throw new Error(await response.text())

                const token = await response.text()
                // response.headers.keys.array.forEach(e => {
                //     console.log(e)
                // });
                //console.log(token)
                localStorage.setItem("TOKEN", token)
                this.store.setMsg("登录成功！")
                self.location = 'index'
                window.history.forward(1);
            } catch (e) {
                this.loginFailed = true
                this.store.setMsg(e.message)
                console.error(e)
            } finally {
                this.loading = false
            }
        },

        encodePwd(publicKey, pwd) {
            const encrypt = new JSEncrypt()
            encrypt.setPrivateKey(publicKey)
            const encryptedPK = encrypt.encrypt(pwd)
            return encryptedPK
        },

        async register() {
            this.loading = true
            try {
                if (this.nickname.length == 0 || this.password.length == 0 || this.rePassword.length == 0) {
                    throw new Error("账户名和密码不能为空！")
                }

                if (this.password != this.rePassword) {
                    throw new Error("两次输入密码不一致！")
                }

                if (this.publicKey == "" || this.publicKey == null) {
                    await this.getPK()
                }
                const encryptedPK = this.encodePwd(this.publicKey, this.password)
                const response = await register(this.nickname, encryptedPK)
                if (!response.ok) throw new Error(await response.text())
                this.store.setMsg("注册成功！");
                this.password = ''
                this.rePassword = ''
                this.loginPannel = true
            } catch (e) {
                this.loginFailed = true
                this.store.setMsg(e.message)
                console.error(e)
            } finally {
                this.loading = false
            }
        }
    },
    computed: {

    }
}
</script>