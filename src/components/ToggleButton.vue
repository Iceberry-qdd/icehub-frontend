<template>
    <label
        :class="labelClass"
        :for="props.id"
        class="grow-0 h-6 inline-block relative rounded-full shrink-0 transition w-11">
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
    'loading': props.loading,
    'cursor-not-allowed': props.loading || !props.enabled,
    'cursor-pointer': !props.loading && props.enabled,
    'has-[:checked]:bg-primary-disable dark:has-[:checked]:bg-onPrimary-disable bg-gray-200 dark:bg-neutral-800': !props.enabled || props.loading,
    'has-[:checked]:bg-primary dark:has-[:checked]:bg-onPrimary bg-gray-300 dark:bg-neutral-700': props.enabled && !props.loading,
}))
</script>