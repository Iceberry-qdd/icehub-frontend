<template>
    <div
        class="bg-[#00000066] bottom-0 fixed flex flex-row items-center justify-center left-0 right-0 top-0 z-[111]"
        @click.self="dismiss">
        <div
            class="bg-white flex flex-col flex-nowrap justify-between max-h-[60%] overflow-y-auto p-4 rounded-[8px] w-[40%]"
            :class="[state.showVisibilityPanel ? 'min-h-[38%]' : 'min-h-[28%]']">
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-2 items-center">
                    <img
                        v-if="state.curUser.avatarUrl"
                        :src="avatar"
                        class="h-[2.5rem] rounded-[8px] w-[2.5rem]" />
                    <div
                        v-else
                        class="bg-blue-500 cursor-default flex h-[2.5rem] items-center justify-center rounded-[8px] w-[2.5rem]">
                        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                        <div class="font-bold text-[14pt] text-white">{{ state.curUser.nickname.charAt(0) }}</div>
                    </div>
                    <div class="flex flex-row gap-4 h-full items-center justify-center">
                        <span class="cursor-default font-bold text-[13pt]">{{ state.curUser.nickname }}</span>
                        <div
                            class="border-2 border-[#3b82f6] cursor-pointer flex flex-row gap-x-1 items-center min-w-[4rem] px-3 py-[0.1rem] relative rounded-full text-[#3b82f6] text-[11pt]"
                            @click="toggleVisibilityAction">
                            <span>{{ curVisibility.name }}</span>
                            <VisibilityAction
                                v-if="state.showVisibilityPanel"
                                class="absolute text-black top-[2rem] z-[99]"
                                :visibility="state.data.status"
                                :ui="state.visibilityActions"
                                @picked-visibility="pickVisibility">
                            </VisibilityAction>
                            <span class="material-icons-round no-hover"> keyboard_arrow_down </span>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row gap-x-4 items-center">
                    <div
                        class="select-none text-[10pt]"
                        :class="leftWordCountClass"
                        :title="leftWordCount < 0 ? `超出${-leftWordCount}字` : ''">
                        {{ leftWordCount }}
                    </div>
                    <div
                        :class="submitPostBtnClass"
                        class="font-bold px-5 py-1 rounded-full text-[11pt] text-white"
                        @click="reposting">
                        <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                        <IconLoading v-if="state.loading" class="'h-5 text-white' w-5"></IconLoading>
                        <span v-else>转发</span>
                    </div>
                </div>
            </div>
            <div class="grow ml-[3rem] pt-2">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    id="review-input"
                    v-model="state.data.content"
                    :disabled="state.loading"
                    :class="{ 'text-gray-400': state.loading, 'cursor-not-allowed': state.loading }"
                    class="bg-transparent break-all focus:outline-none leading-6 max-w-full min-h-fit min-w-full overflow-y-hidden resize-none text-justify text-lg tracking-wide"
                    :maxlength="state.maxContentWordCount + 50"
                    rows="2"
                    placeholder="写点什么吧~"
                    name="review"
                    @input="resize">
                </textarea>
            </div>
            <RepostCard
                v-if="state.parentPost"
                class="cursor-default ml-[3rem] pointer-events-none"
                :post="state.parentPost">
            </RepostCard>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round {
    border-radius: 0;
    font-size: 14pt;
    padding: 0;
}

.material-icons-round:hover {
    background-color: transparent;
    font-size: 14pt;
    padding: 0;
    border-radius: 0;
}
</style>

<script setup>
import { reactive, onMounted, onUnmounted, computed, inject } from 'vue'
import RepostCard from '@/indexApp/components/postDetail/RepostCard.vue'
import { posting } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { useRoute } from 'vue-router'
import VisibilityAction from '@/indexApp/components/menus/PostEditorMenus/VisibilityAction.vue'

const route = useRoute()
const props = defineProps({
    /** 传入的帖子对象 */
    post: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['dismiss'])
const { postingNew } = inject('postingNew')

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    loading: false,
    parentPost: props.post,
    data: {
        allowReview: true,
        content: null,
        top: false,
        attachmentsUrl: [],
        type: 'REPOST',
        parentId: null,
        rootId: null,
        status: 'PUBLIC'
    },
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showVisibilityPanel: false,
    visibilityActions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public', picked: false },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock', picked: false },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'people_outline', picked: false },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people', picked: false },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock', picked: false },
    ],
    maxContentWordCount: 300
})

/**
 * 当处于以下情况任何之一时，判定为需要触发PostingNew方法
 * 1. 当前路由组件name为Explore且转发帖子可见性为'PUBLIC';
 * 2. 当前组件路由参数包含nickname且值等于当前登录用户nickname属性
 * 3. 当前路由组件name为Index
 */
const doPostingNew = computed(() => {
    const exploreRoute = route.name === 'explore'
    const publicStatus = state.data.status === 'PUBLIC'
    const sameNickname = route.params?.nickname === state.curUser.nickname
    const indexRoute = route.name === 'index'
    return sameNickname || (exploreRoute && publicStatus) || indexRoute
})

function resize() {
    const textarea = document.getElementById('review-input')
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
}

const leftWordCount = computed(() => {
    return state.maxContentWordCount - (state.data.content?.length ?? 0)
})

const leftWordCountClass = computed(() => ({
    'text-blue-500': leftWordCount.value >= 0,
    'text-red-500': leftWordCount.value < 0,
    'hidden': leftWordCount.value === state.maxContentWordCount
}))

const isValidContentLength = computed(() => {
    return leftWordCount.value >= 0 && leftWordCount.value < state.maxContentWordCount
})

const submitPostBtnClass = computed(() => ({
    'bg-blue-500': isValidContentLength.value,
    'cursor-pointer': isValidContentLength.value,
    'bg-gray-300': !isValidContentLength.value,
    'cursor-not-allowed': !isValidContentLength.value,
    'pointer-events-none': !isValidContentLength.value
}))

function dismiss() {
    emits('dismiss')
}

async function reposting() {
    if (state.loading == true) {
        store.setWarningMsg('正在提交中，请勿重复提交')
        return
    }
    state.loading = true
    try {
        if (state.parentPost.plan) throw new Error('该帖子尚未发布，无法进行转发操作')
        state.data.parentId = state.parentPost.id
        state.data.rootId = state.parentPost.root?.id ?? state.parentPost.id
        state.data.userId ??= state.curUser.id
        const response = await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()

        //防止重复提交上一次的内容
        state.data.content = null
        store.setSuccessMsg('转发成功')
        // 发布通知
        const receiverId = state.parentPost?.root?.user?.id ?? state.parentPost.user.id
        // ws.sendToOneQueue(new MsgPack(result.id, state.curUser.id, 'REPOST', receiverId),'interact')
        if (doPostingNew.value) {
            postingNew(result)
        }
        dismiss()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

const avatar = computed(() => {
    const { previewUrl, originUrl, contentType } = state.curUser.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl
})

const curVisibility = computed(() => {
    const filteredActions = state.visibilityActions.filter(it => it.code == state.data.status)
    return filteredActions.length > 0 ? filteredActions[0] : state.visibilityActions[0]
})

function pickVisibility(args) {
    state.data.status = args[0]
    for (let i = 0; i < state.visibilityActions.length; i++) {
        const action = state.visibilityActions[i]
        action.picked = action.code === state.data.status
    }
    state.showVisibilityPanel = false
}

function toggleVisibilityAction() {
    const lastState = state.showVisibilityPanel
    state.showVisibilityPanel = !lastState
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style")
})
</script>