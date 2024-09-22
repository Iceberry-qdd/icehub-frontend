<template>
    <div class="cursor-pointer flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>导出我的个人数据</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <IconDown
            class="-rotate-90"
            :size="20"
            :stroke-width="2">
        </IconDown>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconDown from '@/components/icons/IconDown.vue'

const info = computed(() => {
    return '导出我的个人数据，数据将稍后以压缩包形式发至您的邮箱。'
})
</script>