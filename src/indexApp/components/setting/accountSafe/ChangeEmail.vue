<template>
    <div class="cursor-pointer flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>换绑邮箱</p>
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

const props = defineProps({
    /** 原始邮箱 */
    oldEmail: {
        type: String,
        required: true
    }
})

const info = computed(() => {
    return `您当前已绑定${maskedEmail(props.oldEmail)}`
})

/**
 * 隐藏email地址
 * // TODO 应该后端做
 * @param {String} email 将email地址隐藏
 * @returns 隐藏后的email字符串
 */
function maskedEmail(email){
    return email.replace(/(?<=\S)\S*(?=\S@)/,'******')
}
</script>