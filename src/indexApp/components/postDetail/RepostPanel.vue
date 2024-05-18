<template>
    <div
        class="bg-[#00000066] flex flex-row h-full items-center justify-center w-full z-[111]"
        @click.self="dismiss">
        <div class="bg-white flex flex-col flex-nowrap justify-between max-h-[80%] min-h-[30%] overflow-y-auto p-4 rounded-[8px] w-[40%]">
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-2 items-center">
                    <Avatar
                        :user="state.curUser"
                        class="h-[2.5rem] rounded-[8px] w-[2.5rem]">
                    </Avatar>
                    <div class="flex flex-row gap-4 h-full items-center justify-center">
                        <span class="cursor-default font-bold text-[13pt]">{{ state.curUser.nickname }}</span>
                    </div>
                    <div
                        v-if="state.data.content"
                        class="flex flex-nowrap flex-row gap-x-1 items-center justify-start">
                        <div
                            id="repost-penal-visibility-action"
                            class="flex relative"
                            @click="state.showVisibilityPanel = !state.showVisibilityPanel">
                            <span
                                title="帖子可见范围"
                                class="material-icons-round no-hover"
                                :class="VisibilityIconActiveClass">
                                {{ curVisibility.icon }}
                            </span>
                            <Transition name="fade">
                                <VisibilityAction
                                    v-if="state.showVisibilityPanel"
                                    switch-id="repost-penal-visibility-action"
                                    class="absolute min-h-max min-w-max text-black top-[2.5rem] z-[99]"
                                    :visibility="state.data.status"
                                    :ui="state.visibilityActions"
                                    @dismiss-visibility-action="dismissVisibilityAction"
                                    @picked-visibility="pickVisibility">
                                </VisibilityAction>
                            </Transition>
                        </div>
                        <div
                            id="repost-panel-emoji-panel"
                            class="flex-col relative">
                            <div
                                class="flex"
                                @click="state.showEmojiPanel = !state.showEmojiPanel">
                                <span
                                    title="表情面板"
                                    class="material-icons-round no-hover"
                                    :class="EmojiIconActiveClass">
                                    mood
                                </span>
                            </div>
                            <Transition name="fade">
                                <EmojiPanel
                                    v-if="state.showEmojiPanel"
                                    switch-id="repost-panel-emoji-panel"
                                    class="absolute max-h-[18rem] min-h-[8rem] min-w-max ring-1 ring-slate-900/5 shadow-lg top-[2.5rem] z-[99]"
                                    @dismiss-emoji-panel="dismissEmojiPanel"
                                    @insert-emoji-code="insertEmoji">
                                </EmojiPanel>
                            </Transition>
                        </div>
                        <div
                            title="预览"
                            :class="previewIconActiveClass"
                            class="material-icons-round no-hover"
                            @click="state.showMarkdownPanel = !state.showMarkdownPanel">
                            visibility
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
            <div class="grow ml-[3rem] pt-1">
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <VueShowdown
                    v-if="state.showMarkdownPanel == true"
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.data.content"
                    class="min-h-[3rem]">
                </VueShowdown>
                <!-- TODO 不会自动改变高度 -->
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    v-else
                    ref="reviewInput"
                    v-model="state.data.content"
                    :disabled="state.loading"
                    :class="{ 'text-gray-400': state.loading, 'cursor-not-allowed': state.loading }"
                    class="bg-transparent break-all focus:outline-none leading-6 overflow-y-hidden resize-none text-[1rem] text-justify tracking-wide w-full"
                    :maxlength="state.maxContentWordCount + 50"
                    rows="2"
                    placeholder="写点什么吧~"
                    name="review"
                    @input="resize">
                </textarea>
                <RepostCard
                    v-if="state.parentPost"
                    class="cursor-default pointer-events-none"
                    :post="state.parentPost">
                </RepostCard>
            </div>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round {
    font-size: 14pt;
}

.material-icons-round:hover {
    /* background-color: transparent; */
    font-size: 14pt;
}
</style>

<script setup>
import { reactive, onMounted, onUnmounted, computed, inject, defineAsyncComponent, ref } from 'vue'
import RepostCard from '@/indexApp/components/postDetail/RepostCard.vue'
import { posting } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { useRoute } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import VisibilityAction from '@/indexApp/components/menus/postEditorMenus/VisibilityAction.vue'
import { VueShowdown } from 'vue-showdown'
const EmojiPanel = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'))

const route = useRoute()
const reviewInput = ref()
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
        content: '',
        isTop: false,
        attachmentsUrl: [],
        type: 'REPOST',
        parentId: null,
        rootId: null,
        status: 'PUBLIC'
    },
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showVisibilityPanel: false,
    showMarkdownPanel: false,
    visibilityActions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public', picked: false },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock', picked: false },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'people_outline', picked: false },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people', picked: false },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock', picked: false },
    ],
    maxContentWordCount: 1000,
    showEmojiPanel: false
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
    reviewInput.value.style.height = 'auto'
    reviewInput.value.style.height = `${reviewInput.value.scrollHeight}px`
}

const leftWordCount = computed(() => {
    return state.maxContentWordCount - (state.data.content?.length ?? 0)
})

const leftWordCountClass = computed(() => ({
    'text-blue-500': leftWordCount.value >= 0,
    'text-red-500': leftWordCount.value < 0,
    'hidden': leftWordCount.value === state.maxContentWordCount
}))

const previewIconActiveClass = computed(() => ({
    'text-blue-500': state.showMarkdownPanel,
    'bg-blue-200': state.showMarkdownPanel,
    'hover:bg-gray-200': !state.showMarkdownPanel
}))

const EmojiIconActiveClass = computed(() => ({
    'text-blue-500': state.showEmojiPanel,
    'bg-blue-200': state.showEmojiPanel,
    'hover:bg-gray-200': !state.showEmojiPanel
}))

const VisibilityIconActiveClass = computed(() => ({
    'text-blue-500': state.showVisibilityPanel || state.data.status !== 'PUBLIC',
    'bg-blue-200': state.showVisibilityPanel || state.data.status !== 'PUBLIC',
    'hover:bg-gray-200': !state.showVisibilityPanel && state.data.status === 'PUBLIC',
}))

function dismissVisibilityAction() {
    state.showVisibilityPanel = false
}

function dismissEmojiPanel() {
    state.showEmojiPanel = false
}

function insertEmoji({ unified }) {
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.data.content = state.data.content.concat(emoji)
}

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
        if (!state.data.content) throw new Error('输入内容为空！')
        state.data.parentId = state.parentPost.id
        state.data.rootId = state.parentPost.root?.id ?? state.parentPost.id
        state.data.userId ??= state.curUser.id
        const response = await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()

        //防止重复提交上一次的内容
        state.data.content = ''
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

const curVisibility = computed(() => {
    const filteredActions = state.visibilityActions.filter(it => it.code == state.data.status)
    return filteredActions.length > 0 ? filteredActions[0] : state.visibilityActions[0]
})

function pickVisibility(action) {
    state.data.status = action.code
    for (let i = 0; i < state.visibilityActions.length; i++) {
        const action = state.visibilityActions[i]
        action.picked = action.code === state.data.status
    }
    state.showVisibilityPanel = false
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style")
})
</script>