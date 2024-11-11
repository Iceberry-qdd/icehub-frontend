<template>
    <div
        id="theme-menu"
        class="bg-surface min-h-max min-w-[12rem]">
        <div class="flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-border h-[0.35rem] rounded-full w-12" />
        </div>
        <LightAction
            :icon="props.iconMap.get('light')"
            text="浅色模式"
            :class="['light' === props.activeMode ? 'bg-primaryContainer hover:bg-primaryContainer text-primary dark:text-onPrimaryContainer' : 'hover:bg-helper active:bg-border text-onSurface-inActive']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-xl px-4 py-[0.6rem] sm:[&:nth-child(2)]:rounded-t-[6px] sm:last:rounded-b-[6px]"
            @click="toggleMode('light')">
        </LightAction>
        <DarkAction
            :icon="props.iconMap.get('dark')"
            text="深色模式"
            :class="['dark' === props.activeMode ? 'bg-primaryContainer hover:bg-primaryContainer text-primary dark:text-onPrimaryContainer' : 'hover:bg-helper active:bg-border text-onSurface-inActive']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-xl px-4 py-[0.6rem] sm:[&:nth-child(2)]:rounded-t-[6px] sm:last:rounded-b-[6px]"
            @click="toggleMode('dark')">
        </DarkAction>
        <FollowSystemAction
            :icon="props.iconMap.get('followSystem')"
            text="跟随系统"
            :class="['followSystem' === props.activeMode ? 'bg-primaryContainer hover:bg-primaryContainer text-primary dark:text-onPrimaryContainer' : 'hover:bg-helper active:bg-border text-onSurface-inActive']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-xl px-4 py-[0.6rem] sm:[&:nth-child(2)]:rounded-t-[inherit] sm:last:rounded-b-[inherit]"
            @click="toggleMode('followSystem')">
        </FollowSystemAction>
    </div>
</template>

<style scoped>
@media not all and (min-width: 640px) {
    .action{
        padding: 0.5rem 0;
        width: auto;
        flex-direction: column;
        row-gap: 0.5rem;
        width: 100%;
    }
}
</style>

<script setup>
import {onMounted, onUnmounted} from 'vue'
import DarkAction from '@/indexApp/components/menus/themeMenus/DarkAction.vue'
import LightAction from '@/indexApp/components/menus/themeMenus/LightAction.vue'
import FollowSystemAction from '@/indexApp/components/menus/themeMenus/FollowSystemAction.vue'
import { store } from '@/indexApp/js/store';

const props = defineProps({
    /** 主题-图标名称键值对 */
    iconMap: {
        type: Object,
        required: true
    },
    /** 当前激活的主题 */
    activeMode: {
        type: String,
        require: true,
        default: store.SYS_THEME_MODE
    }
})
const emits = defineEmits(['activeMode', 'dismiss'])

function toggleMode(mode){
    emits('activeMode', mode)
}

function handleDismiss(event) {
    const postMenus = document.querySelector('#theme-menu')
    const showPostMenusBtn = document.querySelector('#header-opt')
    if (!postMenus || (!postMenus.contains(event.target) && !showPostMenusBtn.contains(event.target))) {
        emits('dismiss')
    }
    event.stopPropagation()
}

onMounted(() => {
    document.addEventListener('click', handleDismiss)
})

onUnmounted(() => {
    document.removeEventListener('click', handleDismiss)
})
</script>