<template>
    <div
        class="h-10 w-full z-[110]"
        :class="msgTypeColor">
        <div
            class="flex flex-row h-full items-center justify-center relative w-full">
            {{ props.message.msg }}
            <IconError
                class="absolute cursor-pointer right-3 text-[10pt]"
                @click="close()">
            </IconError>
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

.bg-success {
    background-color: #67C23A;
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

:is(.bg-plain,.bg-info,.bg-success,.bg-warning,.bg-error,.bg-activity):where([theme="dark"], [theme="dark"] *){
    background-color: #1e1e1e;
}
</style>

<script setup>
import IconError from '@/components/icons/IconError.vue'
import { reactive, computed } from 'vue'

const props = defineProps({
    /** Banner包含的文字消息 */
    message: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['closeGlobalNotifyBanner'])

const state = reactive({
    msgTypeMap: new Map([
        ['SYS_NOTIFY_INFO', 'bg-info'],
        ['SYS_NOTIFY_SUCCESS', 'bg-success'],
        ['SYS_NOTIFY_WARNING', 'bg-warning'],
        ['SYS_NOTIFY_ERROR', 'bg-error'],
        ['SYS_NOTIFY_ACTIVITY', 'bg-activity'],
        ['SYS_NOTIFY_PLAIN', 'bg-plain']
    ])
})

const msgTypeColor = computed(() => {
    const messageType = props.message.type
    return state.msgTypeMap.get(messageType) || 'bg-plain'
})

function close() {
    emits("closeGlobalNotifyBanner")
}
</script>