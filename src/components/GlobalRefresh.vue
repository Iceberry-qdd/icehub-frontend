<template>
    <div class="content-center flex h-auto items-center justify-center pointer-events-none w-full">
        <!-- TODO implement it. -->
        <div
            class="bg-blue-500 cursor-pointer flex flex-row gap-x-1 items-center pointer-events-auto px-2 py-1 rounded-full shadow-blue-500/25 shadow-lg"
            @click="dismiss">
            <div class="-space-x-4 flex justify-center userAvatars">
                <Avatar
                    v-for="user in state.users"
                    :key="user.id"
                    :user="user"
                    class="-translate-x-1 border-4 border-solid border-white h-9 rounded-full text-[2.25rem] w-9">
                </Avatar>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="text-sm text-white">新动态</div>
            <i class="bi bi-arrow-clockwise text-white text-xl" />
        </div>
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