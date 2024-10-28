<template>
    <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="btn-no-select m-icon">
        <path
            d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z"
            :fill="props.fill"
            :stroke="props.strokeColor"
            :stroke-width="props.strokeWidth"
            stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>

<script setup>
const props = defineProps({
    /** 边线宽度 */
    strokeWidth: {
        type: Number,
        required: false,
        default: 4
    },
    /** 边线颜色 */
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