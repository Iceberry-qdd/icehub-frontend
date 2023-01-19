<template>
    <div
        class="flex z-[110] flex-col-reverse gap-y-2 justify-center items-center w-full fixed pt-4 pointer-events-none">
        <GlobalBannerItem @closeBanner="dismissMessage" v-for="(message, index) in state.messages.slice().reverse()"
            :message="message" :id="message.id" :key="index">
        </GlobalBannerItem>
    </div>

</template>

<style scoped>

</style>

<script setup>
import GlobalBannerItem from '@/components/tailwind/GlobalBannerItem.vue'
import { reactive } from 'vue'
import { store } from '@/store.js'

const state = reactive({
    messages: store.GLOBAL_MSG
})

function dismissMessage() {
    state.messages.shift()
}
</script>