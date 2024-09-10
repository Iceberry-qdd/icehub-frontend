<template>
    <div @click="showSubAction">
        <span
            v-show="!state.showSubAction"
            class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">
            {{ curActiveAction.icon }}
        </span>
        <div
            v-show="!state.showSubAction"
            class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
            更改可见范围
        </div>

        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
        <Teleport to="#app" :disabled="!store.MOBILE_MODE">
            <Transition name="fade">
                <VisibilityChoiceAction
                    v-if="state.showSubAction"
                    class="absolute left-0 max-sm:bottom-0 max-sm:fixed max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-full max-sm:z-[1001] ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:top-0 z-[99]"
                    :visibility="props.post.status"
                    :ui="state.actions"
                    @picked-visibility="updateVisibility">
                </VisibilityChoiceAction>
            </Transition>
        </Teleport>
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

@media not all and (min-width: 640px) {
    .fade-enter-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-leave-active {
        transition: translate 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    }

    .fade-enter-from {
        translate: 0 100%;
    }

    .fade-leave-to {
        translate: 0 100%;
        opacity: 1;
    }
}
</style>

<script setup>
import { reactive, computed } from 'vue'
import { modifyPostVisibility } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { inject } from 'vue'
import VisibilityChoiceAction from '@/indexApp/components/menus/postEditorMenus/VisibilityAction.vue'

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
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'person' },
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
        if (props.post.status == code) return
        const originStatus = props.post.status

        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.status = code
        const response = await modifyPostVisibility(props.post, originStatus)
        if (!response.ok) throw new Error(await response.json().error)

        const result = await response.json()
        if (!result) throw new Error(`更改帖子内容失败：${result}`)
        store.setSuccessMsg('已更改帖子可见范围！')
    } catch (e) {
        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.status = originStatus
        store.setErrorMsg(e.message)
    } finally {
        dismiss()
    }
}

function showSubAction() {
    state.showSubAction = true
    emits('showSubAction')
}
</script>