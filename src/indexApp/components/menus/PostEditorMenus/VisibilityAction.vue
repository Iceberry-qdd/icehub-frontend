<template>
    <div
        id="VisibilityAction"
        class="bg-white min-h-max min-w-max ring-1 ring-slate-900/5 rounded-[6px] shadow-lg">
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
import { reactive, onMounted, onUnmounted } from 'vue'

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
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    visibilityActions: props.ui,
    curVisibility: props.visibility || 'PUBLIC'
})

function pickedVisibility(action) {
    emits('pickedVisibility', [action.code, action.name, action.icon])
}

onMounted(() => {
    const VisibilityAction = document.querySelector('#VisibilityAction')
    document.querySelector('#app').addEventListener('click', function (event) {
        if (!VisibilityAction.contains(event.target)) {
            emits('dismissVisibilityAction')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>