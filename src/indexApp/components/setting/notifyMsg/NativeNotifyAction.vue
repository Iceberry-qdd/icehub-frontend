<template>
    <div class="cursor-default flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
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
import { computed, nextTick, reactive } from 'vue'

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

function toggle(){
    if(state.loading) return

    state.loading = true
    setTimeout(() => {
        emits('toggle')
        nextTick(() => {
            store.setInfoMsg(`切换成功：切换至${props.checked}`)
            state.loading = false
        })
    }, 3000)
}
</script>