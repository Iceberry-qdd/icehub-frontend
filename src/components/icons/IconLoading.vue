<template>
    <svg
        class="btn-no-select m-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        :viewBox="`0 0 ${props.size} ${props.size}`">
        <circle
            class="background opacity-25"
            cx="50%"
            cy="50%"
            stroke="currentColor" />
        <circle
            class="foreground"
            :class="{'infinite': props.percent < 0}"
            cx="50%"
            cy="50%" />
    </svg>
</template>

<style scoped>
svg {
    --width: v-bind(size);
    --height: v-bind(size);
    --stroke-width: v-bind(strokeWidth);
    --pi: v-bind(pi);
    --percent: v-bind(percent);
    --color: v-bind(color);
    --radix: calc(var(--width) / 2 - var(--stroke-width) / 2);
}

svg>circle {
    r: calc(var(--radix));
    stroke-width: calc(var(--stroke-width));
}

svg>circle[class~="foreground"] {
    /* 弧长公式：l = 2 * pi * r * α ÷ 360 = 2 * pi * r * percent ÷ 100 */
    stroke-dasharray: calc(2 * var(--pi) * var(--radix) * var(--percent) / 100) 1000;
    transform: rotate(-90deg);
    transform-origin: center center;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    stroke: var(--color);
    transition: stroke-dasharray .2s ease-in-out;
}

svg>circle[class~="infinite"] {
    animation: stroke-dash-expand 3s ease-in-out 0s infinite,
        stroke-dash-rotate 1s linear 0s infinite;
}

@keyframes stroke-dash-expand {
    0% {
        stroke-dasharray: 0 1000;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 64 1000;
        stroke-dashoffset: -10;
    }

    100% {
        stroke-dasharray: 0 1000;
        stroke-dashoffset: -62;
    }
}

@keyframes stroke-dash-rotate {
    to {
        rotate: 360deg;
    }
}
</style>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
    /* 百分比，若传入的不是数字或数字不在[0, +∞)范围，则表示处于无限加载模式 */
    percent: {
        type: Number,
        required: false,
        default: -1
    },
    /* 边框宽度，默认为4，单位为px */
    strokeWidth: {
        type: Number,
        required: false,
        default: 4
    },
    /* 加载条颜色 */
    color: {
        type: String,
        required: false,
        default: 'currentColor'
    },
    /* 进度条大小 */
    size: {
        type: Number,
        required: false,
        default: 24
    }
})
const pi = ref(Math.PI)

const strokeWidth = computed(() => {
    return `${props.strokeWidth}px`
})

const size = computed(() => {
    return `${props.size}px`
})
</script>