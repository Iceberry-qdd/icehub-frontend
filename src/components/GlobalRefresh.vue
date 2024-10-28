<template>
    <!-- TODO implement it. -->
    <div
        class="bg-primary cursor-pointer dark:text-onHelper flex flex-row gap-x-1 items-center pointer-events-auto px-2 py-1 rounded-full shadow-lg shadow-primary-disable text-onPrimary"
        @click="dismiss">
        <div class="-space-x-4 flex justify-center userAvatars">
            <Avatar
                v-for="user in state.users"
                :key="user.id"
                :user="user"
                class="-translate-x-1 border-4 border-border border-solid dark:border-onHelper h-9 rounded-[100%!important] text-[2.25rem] w-9">
            </Avatar>
        </div>
        <div class="text-sm">新动态</div>
        <div class="material-symbols-rounded no-hover p-0 text-[1.25rem] text-inherit">refresh</div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import Avatar from '@/components/Avatar.vue'

const emits = defineEmits(['closeGlobalRefresh'])
const state = reactive({
    users: [
        {
            id: 'ase2d55e',
            nickname: "张自忠路",
            avatarUrl: null
        },
        {
            id: 'adfefreg',
            nickname: "启帆星星",
            avatarUrl: null
        },
        {
            id: '15地方该ve1g56',
            nickname: "美国炸弹",
            avatarUrl: null
        },

    ]
})

function dismiss() {
    state.userAvatars = []
    emits('closeGlobalRefresh')
}
</script>