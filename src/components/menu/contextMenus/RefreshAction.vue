<template>
    <div
        class="flex flex-row gap-x-2 h-10 hover:bg-gray-100 hover:dark:bg-neutral-800 items-center justify-start px-4"
        @click="refreshPage">
        <span class="dark:text-inherit material-symbols-rounded no-hover p-0 text-[1.1rem]">refresh</span>
        <div class="text-[0.8rem]">刷新页面</div>
    </div>
</template>

<script setup>
import {inject} from 'vue'

const { dismissContextMenu } = inject('dismissContextMenu')

function refreshPage() {
    dismissContextMenu()
    window.location.reload(true)
}
</script>