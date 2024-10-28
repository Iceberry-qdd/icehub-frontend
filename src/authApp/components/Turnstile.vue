<template>
    <!-- eslint-disable-next-line vue/html-self-closing -->
    <div id="cf-turnstile">
    </div>
</template>

<script setup>
import { store } from '@/indexApp/js/store.js'
import { onMounted, reactive, watch } from 'vue'

const emits = defineEmits(['token', 'widgetId'])
const props = defineProps({
    /**A customer value that can be used to differentiate widgets under the same
     * sitekey in analytics and which is returned upon validation. This can only
     * contain up to 32 alphanumeric characters including _ and -. */
    action: {
        type: String,
        required: true
    },
    /**A customer payload that can be used to attach customer data to the challenge
     * throughout its issuance and which is returned upon validation. This can only
     * contain up to 255 alphanumeric characters including _ and -. */
    cData: {
        type: String,
        required: false,
        default: ''
    }
})
const state = reactive({
    sitekey: import.meta.env.VITE_TURNSTILE_SITEKEY,
    size: 'normal',
    widgetId: undefined,
    retry: { mode: 'auto', interval: 8000 },
    refresh: { mode: 'auto', timeout: 'auto' },
    appearance: 'always',
    theme: store.SYS_THEME_MODE
})

function onSuccess(token) {
    emits('token', { token: token })
}

function onError(errorCode) {
    store.setErrorMsg(`加载验证码时出错，请刷新重试！(${errorCode})`)
}

function onExpired() {
    turnstile.reset(state.widgetId)

}

function onUnsupported() {
    store.setErrorMsg('您的浏览器不支持Turnstile，请求换浏览器重试！')

}

function onTimeout() {
    turnstile.reset(state.widgetId)
}

watch(() => state.widgetId, (newVal, _) => {
    emits('widgetId', { widgetId: newVal })
})

onMounted(() => {
    turnstile.ready(function () {
        if(!!state.widgetId) return
        state.widgetId = turnstile.render('#cf-turnstile', {
            sitekey: state.sitekey,
            size: state.size,
            retry: state.retry.mode,
            'retry-interval': state.retry.interval,
            'refresh-expired': state.refresh.mode,
            'refresh-timeout': state.refresh.timeout,
            appearance: state.appearance,
            callback: onSuccess,
            'error-callback': onError,
            'expired-callback': onExpired,
            'unsupported-callback': onUnsupported,
            'timeout-callback': onTimeout,
            theme: state.theme,
            action: props.action,
            cData: props.cData
        })
    })
})
</script>