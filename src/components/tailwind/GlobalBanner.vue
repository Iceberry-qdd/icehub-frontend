<template>
    <div class="flex z-[110] flex-col-reverse gap-y-2 justify-center items-center w-full fixed pt-4 pointer-events-none">
        <TransitionGroup name="banners">
            <GlobalBannerItem @closeBanner="closeBanner" v-for="(message, index) in state.messages" :message="message"
                :key="message.id">
            </GlobalBannerItem>
        </TransitionGroup>
    </div>
</template>

<style scoped>
.banners-move,
.banners-enter-active {
    animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.banners-leave-active {
    animation: slide-out-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
    position: absolute;
}

@keyframes slide-in-top {
    0% {
        transform: translateY(-1000px);
        opacity: 0
    }

    100% {
        transform: translateY(0);
        opacity: 1
    }
}

@keyframes slide-out-top {
    0% {
        -webkit-transform: translateY(0);
        transform: translateY(0);
        opacity: 1;
    }

    100% {
        -webkit-transform: translateY(-1000px);
        transform: translateY(-1000px);
        opacity: 0;
    }
}
</style>

<script setup>
import GlobalBannerItem from '@/components/tailwind/GlobalBannerItem.vue'
import { reactive } from 'vue'
import { store } from '@/store.js'

const state = reactive({
    messages: store.GLOBAL_MSG
})

function closeBanner(args) {
    const preDismissBanner = state.messages.find(it => it.id == args.bannerId)
    store.dismissMsg(preDismissBanner)
}
</script>