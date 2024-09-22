<template>
    <div class="cursor-default flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>开启两步验证</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <ToggleButton
            id="2fa-checkbox"
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
    /** 是否启用此功能 */
    checked: {
        type: Boolean,
        required: true
    }
})
const state = reactive({
    loading: false
})

const info = computed(() => {
    return '启用后，当您进行登录、修改密码等敏感操作时，需要输入两步验证密码。'
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