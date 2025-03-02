<template>
    <div
        ref="footer"
        class="dark:text-white/25 flex flex-row h-[10dvh] items-center justify-center select-none text-gray-500 text-sm w-full">
        <IconLoading
            v-if="props.isLoading"
            class="dark:text-white/50 h-5 text-primary w-5">
        </IconLoading>
        <div
            v-else-if="props.hasMore"
            class="cursor-pointer dark:text-onPrimary h-fit hover:underline text-primary"
            @click="fetchMore">
            加载更多
        </div>
        <span
            v-else
            class="flex items-center px-12 text-[0.85rem] text-neutral-400 w-full">
            <span class="bg-gradient-to-l dark:from-neutral-800 flex-1 from-gray-100 h-px" />
            <span class="px-6 shrink-0">{{ props.placeholder }}</span>
            <span class="bg-gradient-to-r dark:from-neutral-800 flex-1 from-gray-100 h-px" />
        </span>
    </div>
</template>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const footer = ref()
const props = defineProps({
    /** 是否处于loading状态 */
    isLoading: {
        type: Boolean,
        required: true
    },
    /** 是否还有更多内容 */
    hasMore: {
        type: Boolean,
        required: true
    },
    /** 加载到最低端时的占位文字 */
    placeholder: {
        type: String,
        required: false,
        default: '没有更多了'
    }
})
const emits = defineEmits(['fetchMore'])

function fetchMore() {
    if (!props.hasMore) {
        footerObserver.unobserve(footer.value)
        return
    }

    emits('fetchMore')
}

const options = { root: null, rootMargin: '0px', threshold: 0 }

const footerObserver = new IntersectionObserver((entries) => {
    if (entries[0].intersectionRatio > options.threshold && !props.isLoading) {
        fetchMore()
    }
}, options)

onMounted(() => {
    footerObserver.observe(footer.value)
})

onBeforeUnmount(() => {
    footerObserver.unobserve(footer.value)
})
</script>