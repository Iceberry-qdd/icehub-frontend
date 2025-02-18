<template>
    <div class="cursor-default flex flex-row hover:bg-helper items-center justify-between max-sm:px-3 px-4 py-2">
        <div>
            <p>启用系统通知</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <ToggleButton
            id="native-notify-checkbox"
            :enabled="props.enabled"
            :checked="props.checked"
            :loading="state.loading"
            @click="toggle">
        </ToggleButton>
    </div>
</template>

<script setup>
import ToggleButton from '@/components/ToggleButton.vue'
import { store } from '@/indexApp/js/store'
import { computed, reactive } from 'vue'
import icon from '@/assets/logo.svg'

const emits = defineEmits(['toggle'])
const props = defineProps({
    /** 是否启用该选项 */
    enabled: {
        type: Boolean,
        required: false,
        default: true,
    },
    /** 是否勾选次此选项 */
    checked: {
        type: Boolean,
        required: true
    }
})
const state = reactive({
    loading: false
})

const info = computed(() => {
    return '启用后，将调用系统原生通知接口为您推送消息，需要您主动授权。'
})

function toggle() {
    if (state.loading || !props.enabled) return
    state.loading = true
    askNotificationPermission()
}

function askNotificationPermission() {
    if (!("Notification" in window)) {
        store.setErrorMsg('此浏览器不支持原生通知！')
        return
    }

    Notification.requestPermission().then((permission) => {
        state.loading = false
        if (permission === 'granted') {
            emits('toggle')
            createNotify()
        } else {
            store.setErrorMsg('获取通知权限失败！')
        }
    })
}

function createNotify() {
    const text = `您已成功启用系统通知权限，新消息将使用系统通道发送。`
    new Notification("成功启用原生通知！", { body: text, icon: icon })
}
</script>