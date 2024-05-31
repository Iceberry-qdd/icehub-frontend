<template>
    <div class="flex flex-col-reverse gap-y-2 items-center justify-center pointer-events-none">
        <TransitionGroup name="banners">
            <GlobalBannerItem
                v-for="message in state.messages"
                :key="message.id"
                :message="message"
                @close-banner="closeBanner">
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
import GlobalBannerItem from '@/components/GlobalBannerItem.vue'
import { reactive } from 'vue'
import { store } from '@/indexApp/js/store.js'

const state = reactive({
    messages: store.GLOBAL_MSG
})

function closeBanner(args) {
    store.dismissMsg(args.bannerId)
}
</script>