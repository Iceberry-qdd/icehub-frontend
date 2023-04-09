<template>
    <div class="h-10 w-full z-[110]" :class="msgTypeColor">
        <div class="text-[10pt] relative w-full h-full text-white flex flex-row items-center justify-center">
            {{ state.msgPack.msg }}
            <IconError class="text-[10pt] absolute right-3 cursor-pointer" @click="close()"></IconError>
        </div>
    </div>
</template>

<style scoped>
.bg-plain {
    background-color: #9ca3af;
}

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
import { reactive, computed } from 'vue'

const props = defineProps(['message'])
const emit = defineEmits(['closeGlobalNotifyBanner'])

const state = reactive({
    msgPack: JSON.parse(props.message),
    msgTypeMap: new Map([['SYS_NOTIFY_INFO', 'bg-info'], ['SYS_NOTIFY_WARNING', 'bg-warning'], ['SYS_NOTIFY_ERROR', 'bg-error'], ['SYS_NOTIFY_ACTIVITY', 'bg-activity'], ['SYS_NOTIFY_PLAIN', 'bg-plain']])
})

const msgTypeColor = computed(() => {
    const messageType = state.msgPack.type
    return state.msgTypeMap.get(messageType) || 'bg-plain'
})

function close() {
    emit("closeGlobalNotifyBanner")
}
</script>