<template>
    <div
        class="bg-[#00000066] fixed-page max-sm:bg-white max-sm:rounded-t-[0.75rem] sm:backdrop-blur-sm"
        @click.self="dismiss">
        <div class="bg-white flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 h-[0.35rem] rounded-full w-12" />
        </div>
        <div
            class="bg-white cursor-default flex flex-row flex-wrap items-center justify-around max-sm:grid max-sm:grid-cols-4 max-sm:pb-4 max-sm:place-items-center max-sm:pt-2 max-sm:rounded-none max-sm:w-screen py-8 rounded-[8px] select-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:absolute sm:left-1/2 sm:top-1/2 text-center w-[min(100vw,30rem)]">
            <div
                v-for="item in state.items"
                v-show="item.show"
                :key="item.id"
                class="flex flex-col gap-y-2 items-center justify-center">
                <div
                    class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]"
                    @click="handleSelect(item.select)">
                    {{ item.icon }}
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="max-sm:text-zinc-500 text-[0.8rem]">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}

@media not all and (min-width: 640px) {
    .fade-enter-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-leave-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-enter-from {
        translate: 0 100%;
    }

    .fade-leave-to {
        translate: 0 100%;
        opacity: 1;
    }
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss vue/no-ref-object-reactivity-loss -->
<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'

const emits = defineEmits(['dismiss', 'select'])
const props = defineProps({
    /** 以哪种方式触发该组件, 取值[avatar|banner] */
    from: {
        type: String,
        required: false,
        default: 'avatar'
    }
})

const fromText = computed(() => {
    switch (props.from) {
        case 'avatar': return '头像'
        case 'banner': return '背景图'
        default: return ''
    }
})
const state = reactive({
    items: [
        { id: 1, name: '从文件选择', icon: 'add_photo_alternate', show: true, select: 'file' },
        { id: 2, name: '使用表情', icon: 'mood', show: props.from === 'avatar', select: 'emoji' },
        { id: 3, name: `恢复默认${fromText.value}`, icon: 'restore', show: true, select: 'restore' }
    ]
})

function handleSelect(select){
    emits('select', {select: select})
    dismiss()
}

function dismiss(){
    emits('dismiss')
}
</script>