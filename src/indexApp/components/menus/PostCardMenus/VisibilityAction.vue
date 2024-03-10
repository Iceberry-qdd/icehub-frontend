<template>
    <div
        class="flex flex-row items-center justify-between"
        @click="showSubAction">
        <div
            v-show="!state.showSubAction"
            class="flex flex-rows gap-x-3 items-center justify-start">
            <span class="material-icons-round no-hover p-0 text-[16pt]">{{ curActiveAction.icon }}</span>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="btn-no-select">更改可见范围</div>
        </div>

        <Transition name="fade">
            <VisibilityChoiceAction
                v-if="state.showSubAction"
                class="absolute left-0 top-0 z-[99]"
                :visibility="state.post.status"
                :ui="state.actions"
                @picked-visibility="updateVisibility">
            </VisibilityChoiceAction>
        </Transition>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { modifyPostVisibility } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { inject } from 'vue'
import VisibilityChoiceAction from '@/indexApp/components/menus/PostEditorMenus/VisibilityAction.vue'

const { dismissPostMenus } = inject('dismissPostMenus')
const emits = defineEmits(['showSubAction'])
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})

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
    showSubAction: false
})

function dismiss() { dismissPostMenus() }

const curActiveAction = computed(() => {
    const activeActions = state.actions.filter(it => it.code == props.post.status)
    return activeActions.length > 0 ? activeActions[0] : state.actions[0]
})

async function updateVisibility({ code }) {
    try {
        if (state.post.status == code) return
        const originStatus = state.post.status

        state.post.status = code
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

function showSubAction() {
    state.showSubAction = true
    emits('showSubAction')
}
</script>