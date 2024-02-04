<template>
    <div id="visibilityForPostEditorAction" class="bg-white rounded-[6px] shadow-md ring-1 ring-gray-200 min-w-max min-h-max">
        <div @click.stop="pickedVisibility(action)"
            :class="[action.code == state.curVisibility ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100 active:bg-gray-200']"
            class="flex flex-row justify-left items-center gap-x-3 py-[0.6rem] px-4 cursor-pointer last:rounded-b-[6px] first:rounded-t-[6px]"
            v-for="action in state.visibilityActions" :key="action.id" :index="action.id">
            <span class="material-icons-round no-hover" :class="[action.code == state.curVisibility ? 'text-blue-500' : '']">
                {{ action.icon }}
            </span>
            <div class="btn-no-select">{{ action.name }}</div>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round {
    padding: 0;
    font-size: 16pt;
}
</style>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'

const emits = defineEmits(['pickedVisibility', 'dismissVisibilityForPostEditorAction'])
const props = defineProps(['visibility', 'ui'])

const state = reactive({
    visibilityActions: props.ui,
    curVisibility: props.visibility || 'PUBLIC'
})

function pickedVisibility(action) {
    emits('pickedVisibility', [action.code, action.name, action.icon])
}

onMounted(() => {
    const visibilityForPostEditorAction = document.querySelector('#visibilityForPostEditorAction')
    document.querySelector('#app').addEventListener('click', function (event) {
        if (!visibilityForPostEditorAction.contains(event.target)) {
            emits('dismissVisibilityForPostEditorAction')
        }
    })
})

onUnmounted(() => {
    document.querySelector('#app').removeEventListener('click', () => { })
})
</script>