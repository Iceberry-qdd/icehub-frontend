<template>
    <div>
        <svg
            v-if="props.playing"
            xmlns="http://www.w3.org/2000/svg"
            :width="props.size"
            :height="props.size"
            viewBox="0 0 24 24">
            <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2">
                <path d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0" />
                <path d="M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0m8.9 8.11v.01m3.14-2.51v.01M20.77 14v.01m0-4.01v.01m-1.73-3.62v.01M15.9 3.89v.01M12 3v.01m-3.9.88v.01M4.96 6.39v.01M3.23 10v.01m0 3.99v.01m1.73 3.6v.01m3.14 2.49v.01M12 21v.01" />
            </g>
        </svg>
        <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            :width="props.size"
            :height="props.size"
            viewBox="0 0 24 24">
            <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2">
                <path d="M11.296 11.29a1 1 0 1 0 1.414 1.415" />
                <path d="M8.473 8.456a5 5 0 1 0 7.076 7.066m1.365-2.591a5 5 0 0 0-5.807-5.851M15.9 20.11v.01m3.14-2.51v.01M20.77 14v.01m0-4.01v.01m-1.73-3.62v.01M15.9 3.89v.01M12 3v.01m-3.9.88v.01M4.96 6.39v.01M3.23 10v.01m0 3.99v.01m1.73 3.6v.01m3.14 2.49v.01M12 21v.01M3 3l18 18" />
            </g>
        </svg>
    </div>
</template>

<script setup>
    const props = defineProps({
    /** 是否为播放状态 */
    playing: {
        type: Boolean,
        required: false,
        default: true
    },
    /** 大小 */
    size: {
        type: Number,
        required: false,
        default: 24
    },
})
</script>