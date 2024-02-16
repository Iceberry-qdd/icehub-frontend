<template>
    <div
        class="flex flex-row items-center justify-between relative"
        @click="toggleSubAction">
        <div class="flex flex-rows gap-x-3 items-center justify-start">
            <span class="material-icons-round no-hover p-0 text-[16pt]">{{ curActiveAction.icon }}</span>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="btn-no-select">更改可见范围</div>
        </div>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="material-icons-round no-hover p-0 rotate-180 text-[10pt]">arrow_back_ios</div>
        <div
            v-if="state.showSubActions == true"
            class="absolute bg-white right-[-11rem] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg w-full"
            @blur="toggleSubAction">
            <div
                v-for="action in state.actions"
                :key="action.id"
                class="first:rounded-t-[7px] flex flex-row gap-4 items-center justify-left last:rounded-b-[7px] px-3 py-[0.6rem] text-start"
                :index="action.id"
                :class="[action.code == props.post.status ? 'bg-blue-100 hover:bg-blue-100' : 'hover:bg-gray-100 active:bg-gray-200']"
                @click="updateVisibility(action.code)">
                <span
                    class="material-icons-round no-hover p-0 text-[16pt]"
                    :class="[action.code == props.post.status ? 'text-blue-500' : '']">
                    {{ action.icon }}
                </span>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="btn-no-select">{{ action.name }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { modifyPostVisibility } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { inject } from 'vue'

const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
const { dismissPostMenus } = inject('dismissPostMenus')

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    actions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock' },
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