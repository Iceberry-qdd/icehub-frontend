<template>
    <details>
        <summary class="cursor-pointer flex hover:bg-[#f4f4f5] justify-between outline-none px-4 py-2">
            <span>{{ title }}</span>
            <div class="flex gap-x-4 items-center text-neutral-500">
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

/* details[open]>summary+*{
    animation: slideDown 0.25s linear both;
} */

/* details:not([open])>summary+*{
    animation: slideUp 0.25s linear both;
} */

details[open] svg[class~="m-icon"]{
    rotate: 0.5turn;
}

details[open]>summary{
    background-color: #f4f4f5;
}

/* @keyframes slideDown{
    0% {
        height: 0;
    }

    100% {
        height: ;
    }
}

@keyframes slideUp{
    0% {
        height: fit-content;
    }

    100% {
        height: 0;
    }
} */
</style>

<script setup>
import {reactive} from 'vue'
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

const state = reactive({

})
</script>