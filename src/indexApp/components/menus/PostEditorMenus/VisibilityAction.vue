<template>
    <div
        id="VisibilityAction"
        class="bg-white min-h-max min-w-[12rem] ring-1 ring-slate-900/5 rounded-[6px] shadow-lg">
        <div
            v-for="action in state.visibilityActions"
            :key="action.id"
            :class="[action.code == state.curVisibility ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100 active:bg-gray-200']"
            class="cursor-pointer first:rounded-t-[6px] flex flex-row gap-x-3 items-center justify-left last:rounded-b-[6px] px-4 py-[0.6rem]"
            :index="action.id"
            @click.stop="pickedVisibility(action)">
            <span
                class="material-icons-round no-hover p-0 text-[16pt]"
                :class="[action.code == state.curVisibility ? 'text-blue-500' : '']">
                {{ action.icon }}
            </span>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="btn-no-select">{{ action.name }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'

const emits = defineEmits(['pickedVisibility', 'dismissVisibilityAction'])
const props = defineProps({
    /** 默认选择的可见性字符串 */
    visibility: {
        type: String,
        required: true
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

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    visibilityActions: props.ui,
    curVisibility: props.visibility || 'PUBLIC'
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