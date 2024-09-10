<template>
    <div>
        <span class="material-symbols-rounded no-hover p-0 sm:text-[1.25rem] text-[1.5rem]">{{ props.icon }}</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">{{ props.text }}</div>
    </div>
</template>

<style scoped>
.material-symbols-rounded{
    color: inherit;
}
</style>

<script setup>
const props = defineProps({
    /** 图标名称 */
    icon: {
        type: String,
        required: true
    },
    /** 菜单选项文字 */
    text: {
        type: String,
        required: true
    }
})
</script>