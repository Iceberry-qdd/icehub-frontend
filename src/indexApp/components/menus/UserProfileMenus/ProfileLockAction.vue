<template>
    <div>
        <span class="material-icons-round max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">lock_person</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">锁定主页</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
const { dismissProfileMenus } = inject('dismissProfileMenus')
</script>