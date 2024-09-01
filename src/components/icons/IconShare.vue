<template>
    <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 48 48"
        fill="none">
        <path
            d="M28 6H42V20"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M42 29.4737V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9C6 7.34315 7.34315 6 9 6L18 6"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M25.7998 22.1999L41.0998 6.8999"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>

<script setup>
const props = defineProps({
    /** 填充线宽 */
    strokeWidth: {
        type: Number,
        required: false,
        default: 4
    },
    /** 填充颜色 */
    strokeColor: {
        type: String,
        required: false,
        default: '#000000'
    },
    /** 大小 */
    size: {
        type: Number,
        required: false,
        default: 18
    },
    /** 填充颜色 */
    fill: {
        type: String,
        required: false,
        default: 'none'
    }
})
</script>