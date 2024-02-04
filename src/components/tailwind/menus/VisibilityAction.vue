<template>
    <div @click="toggleSubAction"
        class="flex relative flex-row justify-between items-center">
        <div class="flex flex-rows justify-start items-center gap-x-3">
            <span class="material-icons-round no-hover">{{ curActiveAction.icon }}</span>
            <div class="btn-no-select">更改可见范围</div>
        </div>
        <div class="material-icons-round cursor-pointer text-10-pt rotate-180"> arrow_back_ios </div>
        <div v-if="state.showSubActions == true" @blur="toggleSubAction"
            class="absolute right-[-11rem] w-full rounded-[8px] shadow ring-1 ring-slate-900/5 bg-white">
            <div @click="updateVisibility(action.code)"
                class="flex flex-row gap-4 justify-left items-center py-[0.6rem] px-3 text-start last:rounded-b-[7px] first:rounded-t-[7px]"
                v-for="action in state.actions" :key="action.id" :index="action.id"
                :class="[action.code == props.post.status ? 'bg-blue-100 hover:bg-blue-100':'hover:bg-gray-100 active:bg-gray-200']">
                <span class="material-icons-round no-hover" :class="[action.code == props.post.status? 'text-blue-500' : '']">
                    {{ action.icon }}
                </span>
                <div class="btn-no-select">{{ action.name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.text-10-pt{
    font-size: 10pt !important;
}
.material-icons-round {
    padding: 0;
    font-size: 16pt;
}

.material-icons-round:hover {
    font-family: 'Material Icons Round' !important;
    background-color: transparent;
    border-radius: 24rem;
    padding: 0;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { modifyPostVisibility } from '@/api.js'
import { store } from '@/store.js'
import { inject } from 'vue'

const props = defineProps(['post'])
const { dismissPostMenus } = inject('dismissPostMenus')

const state = reactive({
    actions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
        { id: 2, name: '公共时间线内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'people_outline' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
        // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
    ],
    post: props.post,
    showSubActions: false
})

function dismiss() { dismissPostMenus() }

const curActiveAction = computed(() => {
    const activeActions = state.actions.filter(it => it.code == props.post.status)
    return activeActions.length > 0 ? activeActions[0] : state.actions[0]
})

async function updateVisibility(newStatus) {
    if (state.post.status == newStatus) return
    const originStatus = state.post.status

    try {
        state.post.status = newStatus
        const response = await modifyPostVisibility(state.post, originStatus)
        if (!response.ok) throw new Error(await response.json().error)

        const result = await response.json()
        if (!result) throw new Error(`更改帖子内容失败：${result}`)
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