<template>
    <div
        class="pointer-events-auto bg-white flex flex-row items-center gap-x-2 rounded-[8px] shadow-sm ring-1 ring-slate-900/5 px-3 py-[0.6rem] min-w-[8rem] max-w-[36rem]">
        <div>
            <IconDone v-if="state.message.type == 'success'"
                class="text-white bg-green-500 p-[0.15rem] text-[13pt] rounded-full box-border"></IconDone>
            <IconWarning v-else-if="state.message.type == 'warning'"
                class="text-yellow-500 bg-white text-[16pt] rounded-full box-border"></IconWarning>
            <IconError v-else-if="state.message.type == 'error'"
                class="text-white bg-red-500 p-[0.20rem] text-[13pt] rounded-full box-border"></IconError>
            <IconInfo v-else class="text-white bg-gray-500 p-[0.15rem] text-[13pt] rounded-full box-border">
            </IconInfo>
        </div>
        <div class="alert text-[11pt]">{{ state.message.msg }}</div>
    </div>
</template>

<style scoped>
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
import { reactive, onMounted } from 'vue';
import IconDone from '@/components/icons/IconDone.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconWarning from '@/components/icons/IconWarning.vue'
import IconError from '@/components/icons/IconError.vue'

const props = defineProps(['message'])
const emits = defineEmits(['closeBanner'])

const state = reactive({
    message: props.message
})

function closeBanner() {
    setTimeout(() => { emits('closeBanner', { bannerId: state.message.id }) }, 5000)
}

onMounted(() => {
    closeBanner()
})
</script>