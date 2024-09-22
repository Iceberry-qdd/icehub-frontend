<template>
    <div class="cursor-pointer flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>退出登录</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <span class="material-symbols-rounded no-hover p-0 text-[1.15rem]">logout</span>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconDown from '@/components/icons/IconDown.vue'

const info = computed(() => {
    return '从该设备上退出您的账号。'
})
</script>