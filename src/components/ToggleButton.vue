<template>
    <label
        :class="labelClass"
        :for="props.id"
        class="bg-gray-300 h-6 inline-block relative rounded-full transition w-11">
        <input
            :id="props.id"
            :checked="props.checked"
            :disabled="props.loading || !props.enabled"
            type="checkbox"
            class="peer sr-only" />
        <span class="absolute bg-white handle inset-y-0 m-1 peer-checked:start-5 rounded-full size-4 start-0 transition-all">
            <IconLoading class="hidden text-white"></IconLoading>
        </span>
    </label>
</template>

<style scoped>
label[class~="loading"] .m-icon{
    display: block;
}

label[class~="loading"] > .handle{
    background-color: transparent;
}
</style>

<script setup>
import IconLoading from '@/components/icons/IconLoading.vue'
import { computed } from 'vue'

const props = defineProps({
    /** 区别是哪个checkbox */
    id: {
        type: String,
        required: true
    },
    /** 是否启用该选项 */
    enabled: {
        type: Boolean,
        required: true
    },
    /** 是否处于loading状态 */
    loading: {
        type: Boolean,
        required: true
    },
    /** 是否选中该选项 */
    checked: {
        type: Boolean,
        required: true
    }
})

const labelClass = computed(() => ({
    'loading ': props.loading,
    'cursor-not-allowed has-[:checked]:bg-blue-300': !props.enabled || props.loading,
    'cursor-pointer has-[:checked]:bg-blue-500': props.enabled && !props.loading
}))
</script>