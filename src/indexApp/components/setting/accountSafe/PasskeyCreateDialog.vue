<template>
    <div
        id="passkey-create-dialog"
        class="bg-[#00000066] fixed-page flex flex-row h-screen items-center justify-center max-sm:items-end max-sm:z-[1001] sm:backdrop-blur-sm w-screen z-[111]"
        @click.self="close">
        <div
            class="bg-white dark:bg-[#1e1e1e] fade-in flex flex-col flex-nowrap gap-y-[1rem] h-[30rem] items-center justify-between max-h-full max-sm:h-[50dvh] max-sm:rounded-b-none modern-scrollbar-y overflow-y-auto p-4 pb-0 rounded-[8px] w-[25rem]">
            <div class="flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
                <div class="bg-gray-200 dark:bg-neutral-700 h-[0.35rem] rounded-full w-12" />
            </div>
            <PasskeyEmptyPage></PasskeyEmptyPage>
        </div>
    </div>
</template>

<style scoped>
.fade-in {
    animation: fade-in 250ms cubic-bezier(0.78, 0.14, 0.15, 0.86) 0s 1 normal forwards;
}

@keyframes fade-in {
    0% {
        scale: 0.5;
    }

    80% {
        scale: 1.1;
    }

    100% {
        scale: 1;
    }
}

@media not all and (min-width: 640px) {
    @keyframes fade-in {
        0% {
            translate: 0 100%;
        }

        100% {
            translate: 0 0;
        }
    }
}
</style>

<script setup>
import PasskeyEmptyPage from '@/indexApp/components/setting/accountSafe/PasskeyEmptyPage.vue'

const emits = defineEmits(['close'])

function close(){
    emits('close')
}
</script>