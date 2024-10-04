<template>
    <div class="cursor-default flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2">
        <div>
            <p>{{ props.title }}</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ props.desc }}
            </p>
        </div>

        <div class="relative">
            <div
                class="border-[1px] cursor-pointer flex flex-row gap-x-2 items-center justify-left px-3 py-[0.35rem] rounded-[8px] text-neutral-500"
                @click="state.showPanel = true">
                <span
                    class="material-symbols-rounded no-hover p-0 text-[1rem] text-inherit">
                    {{ props.ui.find(it => it.code === props.visibility).icon }}
                </span>
                <div class="btn-no-select text-[0.85rem]">
                    {{ props.ui.find(it => it.code === props.visibility).name }}
                </div>
            </div>
            <VisibilityAction
                v-if="state.showPanel"
                :ui="props.ui"
                class="absolute max-sm:bottom-0 max-sm:fixed max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-full max-sm:z-[1001] right-0 ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:top-0 z-[99]"
                visibility="PUBLIC"
                switch-id="fan-list-lock"
                @picked-visibility="pickVisibility"
                @dismiss="state.showPanel = false">
            </VisibilityAction>
        </div>
    </div>
</template>

<script setup>
import { defineAsyncComponent, nextTick, reactive } from 'vue'
const VisibilityAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/VisibilityAction.vue'))

const emits = defineEmits(['select'])
const props = defineProps({
    /** 当前可见范围 */
    visibility: {
        type: String,
        required: true
    },
    /** 供选择的可见性列表 */
    ui: {
        type: Array,
        required: true
    },
    /** 功能标题 */
    title: {
        type: String,
        required: true
    },
    /** 功能简述 */
    desc: {
        type: String,
        required: true
    },
    /** 功能类型，区分选项用 */
    type: {
        type: String,
        required: true
    }
})

const state = reactive({
    showPanel: false
})

function pickVisibility({code}){
    emits('select', { type: props.type, value: code })
    nextTick(() => { state.showPanel = false  })
}
</script>