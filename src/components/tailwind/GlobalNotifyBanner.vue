<template>
    <div class="h-10 w-full z-[110] bg-activity">
        <div class="text-[10pt] relative w-full h-full text-white flex flex-row items-center justify-center">
            {{ props.message }}
            <IconError class="text-[10pt] absolute right-2 cursor-pointer" @click="close()"></IconError>
        </div>
    </div>
</template>

<style scoped>
.bg-info {
    background-color: #3b82f6;
}

.bg-warning {
    background-color: #f59e0b;
}

.bg-error {
    background-color: #ef4444;
}

.bg-activity {
    background-color: #9333ea;
}
</style>

<script setup>
import IconError from '@/components/icons/IconError.vue'

const props = defineProps(['message'])
const emit = defineEmits(['closeGlobalNotifyBanner'])

function close(){
    emit("closeGlobalNotifyBanner")
}
</script>