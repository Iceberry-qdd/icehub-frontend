<template>
    <div @click="showDeleteDialogBox">删除此内容</div>
</template>

<style scoped></style>

<script setup>
const emits = defineEmits(['showDeleteDialogBox'])

function showDeleteDialogBox() {
    emits('showDeleteDialogBox')
}
</script>