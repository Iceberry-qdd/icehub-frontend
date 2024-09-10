<template>
    <div
        ref="footer"
        class="dark:text-white/25 flex flex-row h-[10vh] justify-center pt-4 text-gray-500 text-sm w-full">
        <IconLoading
            v-if="props.isLoading"
            class="dark:text-white/50 h-5 text-slate-500 w-5">
        </IconLoading>
        <div
            v-else-if="props.hasMore"
            class="cursor-pointer dark:text-blue-300 h-fit hover:underline text-blue-500"
            @click="fetchMore">
            加载更多
        </div>
        <span v-else>没有更多了</span>
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
    }
})
const emits = defineEmits(['fetchMore'])

function fetchMore() {
    if (!props.hasMore){
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