<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start">
        <span class="material-icons-round no-hover p-0 text-[1.2rem]">verified</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">申请认证</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
const { dismissProfileMenus } = inject('dismissProfileMenus')
</script>