<template>
    <div>
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">search</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">高级搜索</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
const { dismissProfileMenus } = inject('dismissProfileMenus')
</script>