<template>
    <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 48 48"
        :fill="props.fill"
        xmlns="http://www.w3.org/2000/svg"
        class="btn-no-select m-icon">
        <path
            d="M36 18L24 30L12 18"
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
        default: 'currentColor'
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