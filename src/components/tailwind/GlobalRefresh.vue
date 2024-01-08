<template>
    <div class="pointer-events-none w-full h-auto flex  justify-center items-center content-center">
        <div @click="dismiss"
            class="pointer-events-auto cursor-pointer shadow-lg shadow-blue-500/25   bg-blue-500 gap-x-1 py-1 px-2 rounded-full flex flex-row items-center">
            <div class="userAvatars flex justify-center -space-x-4">
                <Avatar
                    v-for="user in state.users"
                    :key="user.id"
                    :user="user"
                    class="border-4 border-solid border-white rounded-full -translate-x-1 w-9 h-9 text-[11pt]">
                </Avatar>
            </div>
            <div class="text-white text-sm">新动态</div>
            <i class="bi bi-arrow-clockwise text-white text-xl"></i>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/components/tailwind/Avatar.vue'

const emits = defineEmits(['closeGlobalRefresh'])

const state = reactive({
    userAvatars: [
        "https://api.multiavatar.com/asdf.svg",
        "https://api.multiavatar.com/buhdf.svg",
        "https://api.multiavatar.com/cdrgh.svg"
    ]
})

function dismiss() {
    state.userAvatars = []
    emits('closeGlobalRefresh')
}

const isShow = computed(() => { return state.userAvatars.length > 0 })

</script>