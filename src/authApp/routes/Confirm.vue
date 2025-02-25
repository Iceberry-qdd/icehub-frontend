<template>
    <div
        id="confirm-panel"
        class="bg-gray-100 dark:bg-inherit flex h-[100dvh] items-center justify-center w-[100dvw]">
        <div class="bg-white dark:bg-surface flex items-center justify-center max-sm:h-full max-sm:rounded-none max-sm:w-full relative rounded-lg">
            <div class="flex flex-col gap-y-4 items-center justify-center lg:max-xl:gap-y-3 max-sm:px-0 max-sm:py-0 px-28 py-16">
                <div
                    id="title"
                    class="font-bold lg:max-xl:text-xl text-2xl">
                    <span>请验证您的身份</span>
                </div>
                <form
                    id="confirm-form"
                    autocomplete="on"
                    class="contents">
                    <div class="relative">
                        <Avatar
                            v-if="!!state.curUser"
                            :user="state.curUser"
                            :title="state.curUser.nickname"
                            class="absolute avatar flex-none inline-block leading-7 left-[0.375rem] max-sm:leading-8 max-sm:left-2 max-sm:top-2 max-sm:w-8 object-cover rounded-[9999px!important] top-[0.375rem] w-7">
                        </Avatar>
                        <input
                            v-model="state.password"
                            :disabled="isDisableInput"
                            class="bg-gray-100 dark:bg-[#121212] dark:focus:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring lg:max-xl:text-[0.9rem] max-sm:px-[calc(0.5rem*2+2rem)] max-sm:py-3 px-[calc(0.375rem*2+1.75rem)] py-2 rounded-full text-[1rem] w-[300px]"
                            type="password"
                            autocomplete="current-password"
                            placeholder="请输入密码"
                            @keyup.enter.exact="tryConfirm('PASSWORD')" />
                    </div>
                    <Turnstile
                        class="w-fit"
                        action="confirm"
                        :c-data="state.nickname"
                        @token="handleToken"
                        @widget-id="handleWidgetId">
                    </Turnstile>

                    <button
                        type="button"
                        name="confirm"
                        :disabled="isDisableInput"
                        :class="confirmSubmitButtonStyle"
                        class="font-bold lg:max-xl:text-[0.9rem] max-sm:py-3 p-2 rounded-full shadow-blue-200/50 shadow-lg text-[1rem] text-white w-[300px]"
                        @click="tryConfirm('PASSWORD')">
                        <IconLoading
                            v-if="state.loading"
                            class="dark:text-white/25 h-5 left-[calc(50%-0.625rem)] relative text-white w-5">
                        </IconLoading>
                        <span v-else>验证</span>
                    </button>

                    <div
                        v-if="isSupportWebauthn"
                        class="cursor-default flex items-center select-none text-[0.75rem] text-neutral-400 w-full">
                        <span class="bg-gray-200 dark:bg-neutral-800 flex-1 h-px" />
                        <span class="px-6 shrink-0">Or</span>
                        <span class="bg-gray-200 dark:bg-neutral-800 flex-1 h-px" />
                    </div>

                    <button
                        v-if="isSupportWebauthn"
                        type="button"
                        name="passkey"
                        :class="usePasskeyButtonStyle"
                        @click="tryConfirm('PASSKEY')">
                        使用通行密钥
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/indexApp/js/store.js'
import { authStore } from '@/authApp/js/store.js'
import { callWebAuthn, confirmAndRedirect, confirmAndRedirectWithWebauthn, getCurUserInfo } from '@/authApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import Turnstile from '@/authApp/components/Turnstile.vue'
import Avatar from '@/components/Avatar.vue'

const route = useRoute()
const state = reactive({
    loading: false,
    nickname: authStore.NICKNAME,
    password: "",
    turnstile: { token: undefined, widgetId: undefined },
    curUser: undefined,
    confirmUrl: undefined
})

const isDisableInput = computed(() => {
    return state.loading || !state.turnstile.token || !state.curUser
})

const isSupportWebauthn = computed(() => {
    return window.PublicKeyCredential && PublicKeyCredential.isConditionalMediationAvailable
})

const usePasskeyButtonStyle = computed(() => {
    return isDisableInput.value ?
    'pointer-events-none dark:text-blue-300 hover:underline text-blue-300' :
    'cursor-pointer dark:text-blue-300 hover:underline text-blue-500'
})

const confirmSubmitButtonStyle = computed(() => {
    return isDisableInput.value ?
    'dark:shadow-neutral-800/50 bg-blue-300 dark:bg-neutral-800 dark:text-blue-300/25 cursor-not-allowed pointer-events-none' :
    'dark:text-blue-300 dark:shadow-neutral-700/50 bg-blue-500 dark:bg-neutral-700'
})

/**
 * 验证用户身份
 * @param mode {string} 认证方式，可为PASSWORD | PASSKEY
 */
async function tryConfirm(mode = 'PASSWORD') {
    state.loading = true
    
    try {
        if(!(['PASSWORD', 'PASSKEY'].includes(mode))){
            throw new Error(`不支持的验证方式：${mode}`)        
        }

        if (mode === 'PASSWORD' && !state.password) {
            throw new Error("密码不能为空！")
        }

        if (!state.turnstile.token) {
            throw new Error('需要填充验证码！')
        }

        if(!state.confirmUrl){
            throw new Error('需要指明验证的操作！')
        }

        let response = undefined
        if(mode === 'PASSKEY' && isSupportWebauthn.value){
            const abortController = new AbortController()
            const credential = await callWebAuthn(abortController)
            response = await confirmAndRedirectWithWebauthn(state.confirmUrl, credential.toJSON(), state.turnstile.token)
        } else {
            response = await confirmAndRedirect(state.confirmUrl, state.curUser.nickname, state.password, state.turnstile.token)
        }

        if (!response.ok) throw new Error((await response.json()).message)
        doReferrer()
    } catch (e) {
        if(!(e instanceof DOMException && e.name === 'NotAllowedError')){
            console.error(e)
            store.setErrorMsg(e.message)
            turnstile.reset(state.turnstile.widgetId)
            state.turnstile.token = undefined
        }
    } finally {
        state.loading = false
    }
}

function doReferrer() {
    if (URL.canParse(document.referrer)) {
        const url = new URL(document.referrer)
        let newLocation = window.origin
        if (!!url.pathname){
            if(url.pathname.startsWith('/auth/webauthn/register')) {
                newLocation += '/auth/webauthn/register'
            } else {
                newLocation += url.pathname
            }
        }

        if (!!url.search) newLocation += url.search
        location = newLocation
    } else {
        location = window.origin
    }
}

function handleToken({ token }) {
    state.turnstile.token = token
}

function handleWidgetId({ widgetId }) {
    state.turnstile.widgetId = widgetId
}

async function getCurUser() {
    const response = await getCurUserInfo()
    if (!response.ok) throw new Error((await response.json()).message)
    state.curUser = await response.json()
}

onMounted(() => {
    getCurUser()
    
    // 阻止默认提交事件
    document.getElementById('confirm-form').addEventListener('submit', (e) => {
        e.preventDefault()
    })

    // 获取需验证的路径
    state.confirmUrl = route.query?.referrer
    if(!state.confirmUrl){
        doReferrer()
    }
})
</script>