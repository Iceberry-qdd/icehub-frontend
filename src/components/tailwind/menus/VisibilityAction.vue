<template>
    <div @click="toggleSubAction"
        class="flex relative flex-row justify-between items-center py-2 px-4 w-full text-start hover:bg-gray-100 active:bg-gray-200">
        <div>更改可见范围</div>
        <div class="material-icons-round cursor-pointer text-10-pt rotate-180"> arrow_back_ios </div>
        <div v-if="state.showSubActions == true" @blur="toggleSubAction"
            class="absolute right-[-11rem] w-full rounded-[8px] shadow ring-1 ring-slate-900/5 bg-white">
            <div @click="updateVisibility(action.code)"
                class="flex flex-row gap-4 justify-left items-center py-2 px-4 text-start hover:bg-gray-100 active:bg-gray-200"
                v-for="action in state.actions" :key="action.id" :index="action.id">
                <IconDone v-if="action.code == state.post.status"></IconDone>
                <IconDone v-else class="text-transparent"></IconDone>
                <div>{{ action.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.text-10-pt{
    font-size: 10pt !important;
}
.material-icons-round {
    font-family: 'Material Icons Round' !important;
    background-color: transparent;
    border-radius: 24rem;
    padding: 0;
}

.material-icons-round:hover {
    font-family: 'Material Icons Round' !important;
    background-color: transparent;
    border-radius: 24rem;
    padding: 0;
}
</style>

<script setup>
import IconDone from '@/components/icons/IconDone.vue'
import { reactive } from 'vue'
import { modifyPostVisibility } from '@/api.js'
import { store } from '@/store.js'
import { inject } from 'vue'

const props = defineProps(['post'])
const { dismissPostMenus }  = inject('dismissPostMenus')

const state = reactive({
    actions: [
        { id: 1, name: '公开', code: 'PUBLIC' },
        { id: 2, name: '公共时间线内隐藏', code: 'NOT_TIMELINE' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER' },
        // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF' },
    ],
    post: props.post,
    showSubActions: false
})

function dismiss() { dismissPostMenus() }

async function updateVisibility(newStatus) {
    if (state.post.status == newStatus) return
    const originStatus = state.post.status

    try {
        state.post.status = newStatus
        const response = await modifyPostVisibility(state.post, originStatus)
        if (!response.ok) throw new Error(await response.json().error)

        const result = await response.json()
        if(!result) throw new Error(`更改帖子内容失败：${result}`)
        store.setSuccessMsg('已更改帖子可见范围！')
    } catch (e) {
        state.post.status = originStatus
        store.setErrorMsg('更改帖子可见范围失败！')
        console.error(e)
    } finally {
        dismiss()
    }
}

function toggleSubAction() {
    const lastState = state.showSubActions
    state.showSubActions = !lastState
}
</script>