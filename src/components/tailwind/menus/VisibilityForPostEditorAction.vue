<template>
    <div class="z-[99] min-w-max min-h-max bg-white rounded-[6px] shadow-md ring-1 ring-gray-200">
        <div @click="pickedVisibility(action)"
            class="flex flex-row justify-left items-center gap-x-2 hover:bg-gray-100 active:bg-gray-200 pl-4 pr-5 py-[0.65rem] cursor-pointer"
            v-for="action in state.visibilityActions" :key="action.id" :index="action.id">
            <IconDone v-if="state.curVisibility == action.code"></IconDone>
            <IconDone v-else class="text-transparent"></IconDone>
            <div>{{ action.name }}</div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { reactive } from 'vue'
import IconDone from '@/components/icons/IconDone.vue'

const emit = defineEmits(['pickedVisibility'])
const props = defineProps(['visibility'])

const state = reactive({
    visibilityActions: [
        { id: 1, name: '公开', code: 'PUBLIC' },
        { id: 2, name: '公共时间线内隐藏', code: 'NOT_TIMELINE' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER' },
        // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF' },
    ],
    curVisibility: props.visibility || 'PUBLIC'
})

function pickedVisibility(action) {
    emit('pickedVisibility', [action.code,action.name])
}
</script>