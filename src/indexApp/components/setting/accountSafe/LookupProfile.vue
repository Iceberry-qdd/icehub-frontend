<template>
    <div
        class="cursor-pointer flex flex-row hover:bg-helper items-center justify-between max-sm:px-3 px-4 py-2"
        @click="$router.push({name: 'profile', params: {nickname: state.curUser.nickname}})">
        <div>
            <p>查看个人资料</p>
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
import { computed, reactive } from 'vue'
import IconDown from '@/components/icons/IconDown.vue'

const state = reactive({
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

const info = computed(() => {
    return '查看您的个人资料信息。'
})
</script>