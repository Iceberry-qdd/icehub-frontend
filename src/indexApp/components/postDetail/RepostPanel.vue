<template>
    <div
        class="bg-[#00000066] fixed-page h-screen max-sm:bg-white max-sm:z-[1001] sm:backdrop-blur-sm w-screen z-[111]"
        @click.self="dismiss">
        <div
            v-if="state.loading"
            class="-translate-x-1/2 absolute bg-white h-full left-1/2 max-sm:fixed top-0 w-full z-[102]">
            <div class="flex flex-col gap-2 h-full items-center justify-center">
                <IconLoading class="-ml-1 h-6 mr-3 text-[#6b7280] w-6"></IconLoading>
                <div class="text-[#6b7280] text-[11pt]">
                    帖子发布中...
                </div>
            </div>
        </div>
        <Header
            v-show="!state.loading"
            class="sm:hidden sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="reposting">
            <div class="flex font-bold gap-x-2 items-center justify-start w-full">
                <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                <div class="close-btn material-symbols-rounded" @click="dismiss">close</div>
                <div>{{ state.showMarkdownPanel ? '预览' : '转发帖子' }}</div>
            </div>
        </Header>
        <div class="bg-white flex flex-col flex-nowrap justify-between left-1/2 max-sm:h-[calc(100vh-2.5rem-48px)] max-sm:p-3 max-sm:rounded-none max-sm:w-screen overflow-y-auto p-4 rounded-[8px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:absolute sm:max-h-[80%] sm:min-h-[30%] top-1/2 w-[36rem]">
            <div class="flex flex-row items-center justify-between">
                <div class="flex flex-row gap-x-2 items-center">
                    <Avatar
                        v-if="!store.MOBILE_MODE"
                        :user="state.curUser"
                        class="h-[2.5rem] rounded-[8px] w-[2.5rem]">
                    </Avatar>
                    <div
                        v-if="!store.MOBILE_MODE"
                        class="flex flex-row gap-2 h-full items-center justify-center">
                        <span class="cursor-default font-bold text-[13pt]">{{ state.curUser.nickname }}</span>
                        <IconVerify
                            v-if="state.curUser.verified"
                            class="h-[0.9rem] text-blue-500 w-[0.9rem]">
                        </IconVerify>
                        <div
                            v-if="state.curUser.confirmFollow"
                            class="material-symbols-rounded no-hover p-0 text-[1rem]">
                            lock
                        </div>
                    </div>
                </div>
                <EditorMenu
                    v-if="state.data.content.length > 0 || store.MOBILE_MODE"
                    id="repostEditorMenu"
                    class="bottom-0 left-0 max-sm:fixed max-sm:h-10 max-sm:pr-4 px-2 w-full z-10"
                    switch-from="repost-panel"
                    :menu-set="state.menuSet"
                    :visibility="state.data.status"
                    :max-content-word-count="state.maxContentWordCount"
                    :content-length="state.data.content.length"
                    :show-markdown-panel="state.showMarkdownPanel"
                    @insert-emoji="insertEmoji"
                    @change-visibility="({visibility}) => {state.data.status = visibility}"
                    @submit="reposting"
                    @resize="resize"
                    @preview="({isShow}) => {state.showMarkdownPanel = isShow}">
                </EditorMenu>
            </div>
            <div class="grow max-sm:ml-0 max-sm:pt-0 ml-[3rem] pt-1">
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
                    rows="3"
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
.material-symbols-rounded {
    font-size: 14pt;
}

.material-symbols-rounded:hover {
    /* background-color: transparent; */
    font-size: 14pt;
}

.fade-enter-active {
    transition: opacity 0.1s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.1s ease-in-out;
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
import { reactive, computed, inject, ref } from 'vue'
import Header from '@/indexApp/components/Header.vue'
import RepostCard from '@/indexApp/components/postDetail/RepostCard.vue'
import { posting } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import EditorMenu from '@/indexApp/components/menus/EditorMenu.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { useRoute } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { VueShowdown } from 'vue-showdown'
import IconVerify from '@/components/icons/IconVerify.vue'

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
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交'
    },
    menuSet: new Set(['VisibilityAction', 'EmojiPanel', 'MarkdownPreview']),
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
    if(!CSS.supports('field-sizing: content')){
        postInput.value.style.height = 'auto'
        postInput.value.style.height = `${postInput.value.scrollHeight}px`
    }
}

const leftWordCount = computed(() => {
    return state.maxContentWordCount - (state.data.content?.length ?? 0)
})

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
        if (!response.ok) throw new Error((await response.json()).message)

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
    } finally {
        state.loading = false
    }
}

function insertEmoji({emoji}){
    const start = reviewInput.value.selectionStart
    state.data.content = state.data.content.slice(0, start).concat(emoji).concat(state.data.content.slice(start))
}
</script>