<template>
    <div
        class="bg-[#00000066] fixed-page max-sm:bg-white max-sm:rounded-t-[0.75rem] sm:backdrop-blur-sm"
        @click.self="dismiss">
        <div class="bg-white dark:bg-[#1e1e1e] flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 dark:bg-neutral-700 h-[0.35rem] rounded-full w-12" />
        </div>
        <div
            class="bg-white cursor-default dark:bg-[#1e1e1e] flex flex-row flex-wrap items-center justify-around max-sm:grid max-sm:grid-cols-4 max-sm:pb-4 max-sm:place-items-center max-sm:pt-2 max-sm:rounded-none max-sm:w-screen py-8 rounded-[8px] select-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:absolute sm:left-1/2 sm:top-1/2 text-center w-[min(100vw,30rem)]">
            <div
                v-for="item in state.items"
                v-show="item.show"
                :key="item.id"
                class="flex flex-col gap-y-2 items-center justify-center">
                <div
                    class="bg-gray-100 material-symbols-rounded max-sm:dark:bg-neutral-700 max-sm:p-3 no-hover sm:dark:bg-neutral-700 sm:text-[1.25rem] text-[1.5rem]"
                    @click="handleSelect(item.select)">
                    {{ item.icon }}
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="dark:text-white/50 text-[0.8rem] text-neutral-400">{{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss vue/no-ref-object-reactivity-loss -->
<script setup>
import { reactive, computed } from 'vue'

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