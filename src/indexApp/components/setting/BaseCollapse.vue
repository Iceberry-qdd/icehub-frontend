<template>
    <details>
        <summary class="cursor-pointer flex hover:bg-helper justify-between max-sm:px-3 outline-none px-4 py-2">
            <span class="dark:text-white/50">{{ title }}</span>
            <div class="dark:text-white/50 flex gap-x-4 items-center">
                <span class="text-[0.9rem]">{{ value }}</span>
                <IconDown
                    :size="20"
                    :stroke-width="2">
                </IconDown>
            </div>
        </summary>
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <slot></slot>
    </details>
</template>

<style scoped>
details summary::-webkit-details-marker{
    display: none;
}

details[open] svg[class~="m-icon"]{
    rotate: 0.5turn;
}

details[open]>summary{
    background-color: rgb(var(--color-helper));
}
</style>

<script setup>
import IconDown from '@/components/icons/IconDown.vue'

const props = defineProps({
    /** 选项标题 */
    title: {
        type:String,
        required: true
    },
    /** 选中的值 */
    value: {
        type: String,
        required: true
    }
})
</script>