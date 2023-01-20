<template>
    <Transition>
        <div v-if="state.show == true"
            class="pointer-events-auto bg-white flex flex-row items-center gap-x-2 rounded-[8px] shadow-sm ring-1 ring-slate-900/5 px-3 py-[0.6rem] min-w-[8rem] max-w-[36rem]">
            <div>
                <IconDone v-if="state.message.type == 'success'"
                    class="text-white bg-green-500 p-[0.15rem] text-[13pt] rounded-full box-border"></IconDone>
                <IconWarning v-else-if="state.message.type == 'warning'"
                    class="text-yellow-400 bg-white text-[16pt] rounded-full box-border"></IconWarning>
                <IconError v-else-if="state.message.type == 'error'"
                    class="text-white bg-red-500 p-[0.20rem] text-[13pt] rounded-full box-border"></IconError>
                <IconInfo v-else class="text-white bg-gray-400 p-[0.15rem] text-[13pt] rounded-full box-border">
                </IconInfo>
            </div>
            <div class="alert text-[11pt]">{{ state.message.msg }}</div>
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

.banner-container {
    position: fixed;
    z-index: 200;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    justify-content: center;
    align-items: center;
    pointer-events: none;
}

.alert {
    margin: 0;
    pointer-events: all;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
}
</style>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import IconDone from '@/components/icons/IconDone.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconWarning from '@/components/icons/IconWarning.vue'
import IconError from '@/components/icons/IconError.vue'

const props = defineProps(['message', 'id'])

const state = reactive({
    message: props.message,
    id: props.id,
    show: false
})

const emits = defineEmits(['closeBanner'])

function closeBanner() {
    setTimeout(() => { state.show = false }, 5000 + state.id * 100) // NOTE 时间加上偏移，防止动画执行太快导致数据无法及时清空
}

function clearData() {
    emits('closeBanner')
}

onMounted(() => {
    state.show = true
    closeBanner()
})

onUnmounted(() => {
    clearData()
})
</script>