<template>
    <div
        class="bg-white max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] min-h-max min-w-[12rem] ring-1 ring-slate-900/5 rounded-[6px] shadow-lg">
        <div class="bg-white flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 h-[0.35rem] rounded-full w-12" />
        </div>
        <div
            v-for="action in props.ui"
            :key="action.id"
            :class="[action.code == props.visibility ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100 active:bg-gray-200']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-xl px-4 py-[0.6rem] sm:[&:nth-child(2)]:rounded-t-[6px] sm:last:rounded-b-[6px]"
            :index="action.id"
            @click.stop="pickedVisibility(action)">
            <span
                class="material-symbols-rounded no-hover p-0 sm:text-[1.25rem] text-[1.5rem]"
                :class="[action.code == props.visibility ? 'text-blue-500' : '']">
                {{ action.icon }}
            </span>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="btn-no-select">{{ action.name }}</div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import {onMounted, onUnmounted } from 'vue'

const emits = defineEmits(['pickedVisibility', 'dismissVisibilityAction'])
const props = defineProps({
    /** 默认选择的可见性字符串 */
    visibility: {
        type: String,
        required: false,
        default: 'PUBLIC'
    },
    /** 供选择的可见性列表 */
    ui: {
        type: Array,
        required: true
    },
    /** 触发该组件的元素id，用于检测点击事件关闭用 */
    switchId: {
        type:String,
        required: false,
        default: undefined
    }
})

function pickedVisibility(action) {
    emits('pickedVisibility', action)
}

function clickListener(event){
    const visibilityAction = document.querySelector(`#${props.switchId}`)
    const visibilityActionBtn = document.querySelector(`#${props.switchId}-btn`)
    const isClickAction = visibilityAction && visibilityAction.contains(event.target)
    const isClickActionBtn = visibilityActionBtn && visibilityActionBtn.contains(event.target)
    if (!isClickAction && !isClickActionBtn) {
        emits('dismissVisibilityAction')
    }
}

onMounted(() => {
    if(props.switchId){

        document.addEventListener('click', clickListener)
    }
})

onUnmounted(() => {
    if(props.switchId){
        document.removeEventListener('click', clickListener)
    }
})
</script>