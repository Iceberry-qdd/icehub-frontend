<template>
    <div class="cursor-pointer flex flex-row hover:bg-helper items-center justify-between max-sm:px-3 px-4 py-2">
        <div>
            <p>注销账号</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <IconDown
            class="-rotate-90 text-[initial]"
            :size="20"
            :stroke-width="2">
        </IconDown>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import IconDown from '@/components/icons/IconDown.vue'

const info = computed(() => {
    return '🚨 永久删除我的账号数据，包括文件、个人资料、帖子、评论等。'
})
</script>