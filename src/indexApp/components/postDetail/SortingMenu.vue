<template>
    <div
        id="sortingMenu"
        class="bg-white dark:bg-[#1e1e1e] flex flex-col max-sm:grid max-sm:grid-cols-4 max-sm:place-items-center ring-1 ring-slate-900/5 rounded-[8px] shadow-lg">
        <div
            v-for="(menu, key) in props.menus"
            :key="key"
            :class="[key === props.orderBy ? 'bg-blue-100 text-blue-500 dark:text-inherit dark:bg-neutral-700 hover:bg-blue-100 hover:dark:bg-neutral-700' : 'hover:bg-gray-100 hover:dark:bg-neutral-800 active:bg-gray-200 active:dark:bg-neutral-700']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-[8px] px-4 py-[0.6rem] sm:first:rounded-t-[inherit] sm:last:rounded-b-[inherit]"
            @click="emits('pick', key)">
            <span class="material-symbols-rounded no-hover p-0 sm:text-[1.25rem] text-[1.5rem] text-inherit">{{ menu.icon }}</span>
            <span class="btn-no-select">{{ menu.zh }}</span>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const emits = defineEmits(['pick', 'dismiss'])
const props = defineProps({
    /** 当前选定的排序方式 */
    orderBy: {
        type: String,
        required: true
    },
    /** 排序菜单列表，以Object形式提供 */
    menus: {
        type: Object,
        required: true
    }
})

function handleDismiss(event) {
    const sortingMenu = document.querySelector('#sortingMenu')
    const sortingMenuBtn = document.querySelector('#sortingMenuBtn')
    if (!sortingMenu.contains(event.target) && !sortingMenuBtn.contains(event.target)) {
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