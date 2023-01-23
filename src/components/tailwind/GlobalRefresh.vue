<template>
    <Transition>
        <div v-if="isShow"
            class="pointer-events-none w-[38.5%] h-auto flex fixed z-[99] top-16 justify-center items-center content-center">
            <div @click="dismiss"
                class="pointer-events-auto cursor-pointer shadow-lg shadow-blue-500/25   bg-blue-500 gap-x-1 py-1 px-2 rounded-full flex flex-row items-center">
                <div class="userAvatars flex justify-center -space-x-4">
                    <img class="avatar border-4 border-solid border-white rounded-full -translate-x-1 w-9 h-9"
                        :src="avatar" v-for="(avatar, index) in state.userAvatars" :key="index" />
                </div>
                <div class="text-white text-sm">新动态</div>
                <i class="bi bi-arrow-clockwise text-white text-xl"></i>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.v-enter-active {
    animation: slide-in-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.v-leave-active {
    animation: slide-out-top 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
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
import { reactive, computed } from 'vue';

const state = reactive({
    userAvatars: [
        "https://api.multiavatar.com/asdf.svg",
        "https://api.multiavatar.com/buhdf.svg",
        "https://api.multiavatar.com/cdrgh.svg"
    ]
})

function dismiss() { state.userAvatars = [] }

const isShow = computed(() => { return state.userAvatars.length > 0 })

</script>