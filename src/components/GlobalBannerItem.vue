<template>
    <div class="bg-white dark:bg-[#1e1e1e] flex flex-row gap-x-2 items-center max-w-[min(36rem,96vw)] min-w-[8rem] pointer-events-auto px-3 py-[0.6rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-sm">
        <div class="text-[1rem]">
            <IconDone
                v-if="props.message.type == 'success'"
                class="bg-green-500 box-border dark:text-neutral-700 p-[0.15rem] rounded-full text-white">
            </IconDone>
            <IconWarning
                v-else-if="props.message.type == 'warning'"
                class="bg-inherit box-border rounded-full text-[1.25rem] text-yellow-500">
            </IconWarning>
            <IconError
                v-else-if="props.message.type == 'error'"
                class="bg-red-500 box-border dark:text-neutral-700 p-[0.20rem] rounded-full text-white">
            </IconError>
            <IconInfo
                v-else
                class="bg-gray-500 box-border dark:text-neutral-700 p-[0.15rem] rounded-full text-white">
            </IconInfo>
        </div>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="alert text-[11pt]">{{ props.message.msg }}</div>
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
import { onMounted } from 'vue'
import IconDone from '@/components/icons/IconDone.vue'
import IconInfo from '@/components/icons/IconInfo.vue'
import IconWarning from '@/components/icons/IconWarning.vue'
import IconError from '@/components/icons/IconError.vue'

const props = defineProps({
    /** Banner包含的文字消息 */
    message: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['closeBanner'])

function closeBanner() {
    setTimeout(() => { emits('closeBanner', { bannerId: props.message.id }) }, 5000)
}

onMounted(() => {
    closeBanner()
})
</script>