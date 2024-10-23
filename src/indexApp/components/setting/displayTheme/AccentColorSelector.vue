<!-- eslint-disable vue/html-self-closing -->
<template>
    <div>
        <div class="flex flex-row flex-wrap gap-4">
            <div
                v-for="(color, name) in props.accentOptions"
                :key="color"
                class="flex flex-col items-center justify-center">
                <div
                    :class="{'ring-[3px] ring-offset-2 ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.accent === name}"
                    :style="{background: `linear-gradient(45deg, ${color.light} 50%, ${color.dark} 50%)`}"
                    class="cursor-pointer h-[2.5rem] rounded-full w-[2.5rem]"
                    @click="emits('select', name)">
                </div>
                <div class="cursor-default mt-2">{{ color.zh }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emits = defineEmits(['select'])
const props = defineProps({
    /** 生效的强调色 */
    accent: {
        type: String,
        required: true
    },
    /** 强调色板 */
    accentOptions: {
        type: Object,
        required: true
    }
})
</script>