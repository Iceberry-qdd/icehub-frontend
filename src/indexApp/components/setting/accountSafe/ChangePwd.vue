<template>
    <div class="cursor-pointer flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>修改密码</p>
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
    return '如果您的密码丢失或被盗用，建议您尽快修改密码。'
})
</script>