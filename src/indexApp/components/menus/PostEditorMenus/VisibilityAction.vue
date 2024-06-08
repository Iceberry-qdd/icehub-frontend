<template>
    <div
        id="VisibilityAction"
        class="bg-white max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] min-h-max min-w-[12rem] ring-1 ring-slate-900/5 rounded-[6px] shadow-lg">
        <div class="bg-white flex h-6 items-center justify-center rounded-t-[0.75rem] sm:hidden">
            <div class="bg-gray-200 h-[0.35rem] rounded-full w-12" />
        </div>
        <div
            v-for="action in props.ui"
            :key="action.id"
            :class="[action.code == props.visibility ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100 active:bg-gray-200']"
            class="cursor-pointer flex flex-row gap-x-3 item items-center justify-left max-sm:gap-x-4 max-sm:mx-4 max-sm:p-4 max-sm:rounded-xl px-4 py-[0.6rem] sm:first-of-type:rounded-t-[6px] sm:last-of-type:rounded-b-[6px]"
            :index="action.id"
            @click.stop="pickedVisibility(action)">
            <span
                class="material-icons-round no-hover p-0 text-[1.5rem]"
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

onMounted(() => {
    if(props.switchId){
        const visibilityAction = document.querySelector(`#${props.switchId}`)
        document.querySelector('#app').addEventListener('click', function (event) {
            if (!visibilityAction.contains(event.target)) {
                emits('dismissVisibilityAction')
            }
        })
    }
})

onUnmounted(() => {
    if(props.switchId){
        document.querySelector('#app').removeEventListener('click', () => { })
    }
})
</script>