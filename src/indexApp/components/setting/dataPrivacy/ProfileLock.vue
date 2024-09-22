<template>
    <div class="cursor-default flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>设为私密账号</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <ToggleButton
            id="profile-lock-checkbox"
            :enabled="props.enabled"
            :checked="props.locked"
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
    /** 是否开启锁定 */
    locked: {
        type: Boolean,
        required: true
    }
})
const state = reactive({
    loading: false
})

const info = computed(() => {
    return '启用后，您主页中的帖子、粉丝列表等仅关注者可见。'
})

function toggle(){
    if(state.loading) return

    state.loading = true
    setTimeout(() => {
        emits('toggle')
        nextTick(() => {
            store.setInfoMsg(`切换成功：切换至${props.locked}`)
            state.loading = false
        })
    }, 3000)
}
</script>