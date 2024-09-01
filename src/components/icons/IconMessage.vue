<template>
    <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M44.0001 24C44.0001 35.0457 35.0458 44 24.0001 44C18.0266 44 4.00006 44 4.00006 44C4.00006 44 4.00006 29.0722 4.00006 24C4.00006 12.9543 12.9544 4 24.0001 4C35.0458 4 44.0001 12.9543 44.0001 24Z"
            :fill="props.fill"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M14 18L32 18"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M14 26H32"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
        <path
            d="M14 34H24"
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