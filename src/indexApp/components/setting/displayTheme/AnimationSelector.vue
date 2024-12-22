<template>
    <div
        class="cursor-default flex flex-row hover:bg-helper items-center justify-between max-sm:px-3 px-4 py-2">
        <div>
            <p>减少动画效果</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <ToggleButton
            id="profile-lock-checkbox"
            :enabled="props.enabled"
            :checked="props.checked"
            :loading="state.loading"
            @click="toggle">
        </ToggleButton>
    </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import ToggleButton from '@/components/ToggleButton.vue'

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

function toggle(){
    if(state.loading || !props.enabled) return

    state.loading = true
    setTimeout(() => {
        emits('toggle')
        state.loading = false
    }, 500)
}

const info = computed(() => {
    return '减少动画效果，防止这些动画效果导致的庭神经紊乱、光敏性癫痫、偏头痛和暗点敏感性。'
})
</script>