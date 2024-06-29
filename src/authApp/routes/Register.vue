<template>
    <div id="register-panel">
        <button
            name="返回登录"
            type="button"
            class="3xl:left-8 3xl:text-[2.2rem] 3xl:top-[2rem] absolute cursor-pointer left-4 material-icons-round max-sm:text-[1.25rem] text-[1.1rem] top-4"
            @click="routeTo('login')">
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
                    <IconLoading
                        v-if="state.loading"
                        class="3xl:h-10 3xl:left-[calc(50%-1.25rem)] 3xl:w-10 animate-spin h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                    </IconLoading>
                    <span v-else>注册</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { getPublicKey, register } from '@/authApp/js/api.js'
import { encodePwd } from '@/authApp/util/util.js'
import IconLoading from '@/components/icons/IconLoading.vue'

const router = useRouter()
const state = reactive({
    appName: import.meta.env.VITE_APP_TITLE,
    loading: false,
    nickname: authStore.NICKNAME,
    password: "",
    rePassword: ""
})

function routeTo(routeName){
    authStore.setNickname(state.nickname)
    router.push({name: routeName})
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
        routeTo('login')
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