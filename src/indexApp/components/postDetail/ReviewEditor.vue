<template>
    <div>
        <div
            v-if="!state.loading"
            class="flex flex-row gap-x-[1rem] px-[1.5rem] py-[1rem] relative"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <div
                v-if="props.tieLocation == 'mid'"
                class="absolute bg-gray-200 h-full left-[2.7rem] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'top'"
                class="absolute bg-gray-200 left-[2.7rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'bottom'"
                class="-z-0 absolute bg-gray-200 h-[2.5rem] left-[2.7rem] timeline-bottom top-0 w-[0.15rem]" />
            <div class="h-fit z-10">
                <img
                    v-if="state.curUser.avatarUrl"
                    :src="avatar"
                    class="cursor-default h-[2.5rem] max-w-none rounded-[6px] w-[2.5rem]" />
                <div
                    v-else
                    class="bg-blue-500 cursor-default flex h-[2.5rem] items-center justify-center rounded-[6px] w-[2.5rem]">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="font-bold text-[14pt] text-white">{{ state.curUser.nickname.charAt(0) }}</div>
                </div>
            </div>
            <div class="w-full">
                <div
                    v-if="state.content.length > 0"
                    class="mb-2 text-[11pt]">
                    回复
                    <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
                </div>
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    id="review-input"
                    v-model="state.content"
                    :disabled="state.loading"
                    :class="{ 'text-gray-400': state.loading }"
                    class="bg-transparent focus:outline-none leading-6 max-w-full min-h-fit min-w-full overflow-y-hidden pr-2 resize-none text-justify text-lg tracking-wide"
                    maxlength="300"
                    placeholder="发布评论"
                    name="review"
                    @keydown="resize">
                </textarea>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <div v-if="state.content.length > 0" class="flex flex-row items-center justify-between">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <div v-if="!state.loading" class="flex flex-row gap-x-2 items-center">
                        <!-- TODO implement it. -->
                        <AddPicture
                            v-if="showUnImpl"
                            theme="outline"
                            size="20"
                            fill="#333"
                            :stroke-width="3">
                        </AddPicture>
                        <!-- TODO implement it. -->
                        <LocalTwo
                            v-if="showUnImpl"
                            theme="outline"
                            size="20"
                            class="icon"
                            fill="#333"
                            :stroke-width="4">
                        </LocalTwo>
                        <div class="flex-col relative">
                            <div
                                class="flex"
                                @click="state.showEmojiPanel = !state.showEmojiPanel">
                                <GrinningFaceWithOpenMouth
                                    title="表情面板"
                                    theme="outline"
                                    size="18"
                                    fill="#333"
                                    :stroke-width="3">
                                </GrinningFaceWithOpenMouth>
                            </div>
                            <Transition name="fade">
                                <EmojiPanel
                                    v-if="state.showEmojiPanel"
                                    id="emojiPanel"
                                    class="absolute min-h-max min-w-max top-[2.5rem] z-[99]"
                                    @insert-emoji-code="insertEmoji">
                                </EmojiPanel>
                            </Transition>
                        </div>
                    </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <div v-else class="flex flex-row gap-x-2 items-center" />
                    <div
                        :class="[state.loading ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-[#0d6efd]']"
                        class="px-6 py-[0.4rem] rounded-full text-sm text-white"
                        @click="submitReview">
                        <span>发布</span>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
            class="bg-white flex flex-col gap-y-2 h-[8rem] items-center justify-center"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <IconLoading class="'h-5 text-white' w-5"></IconLoading>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="text-[11pt]">评论发布中...</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, inject } from 'vue'
import { reviewing } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { AddPicture, LocalTwo, GrinningFaceWithOpenMouth } from '@icon-park/vue-next'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import EmojiPanel from '@/indexApp/components/menus/PostEditorMenus/EmojiPanel.vue'

const emits = defineEmits(['dismiss'])
const props = defineProps({
    /** 传入的帖子对象，与parent二选一传递 */
    post: {
        type: Object,
        required: false,
        default: undefined
    },
    /** 父帖子对象，与post二选一*/
    parent: {
        type: Object,
        required: false,
        default: undefined
    }
})
const { newReview } = inject('newReview')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    content: '',
    loading: false,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showEmojiPanel: false
})

const replyTo = computed(() => {
    return props.parent?.user?.nickname || props.post?.user?.nickname || '神秘用户'
})

async function submitReview() {
    if (state.loading == true) {
        store.setWarningMsg('正在提交中，请勿重复提交！')
        return
    }

    state.loading = true
    try {
        if (state.post?.plan) throw new Error('该帖子尚未发布，无法进行评论操作')
        if (state.content.trim() == '') throw new Error('评论内容不能为空！')
        if (!props.post && !props.parent) throw new Error('该评论没有依赖的父级内容，非法评论！')

        const data = {
            'content': state.content,
            'postId': props.post?.id || props.parent.postId,
            'parentId': props.parent?.id,
            'userId': state.curUser.id
        }
        const response = await reviewing(data)
        if (!response.ok) throw new Error((await response.json()).error)
        const result = await response.json()
        newReview({ review: result })
        state.content = ''
        emits('dismiss')

        const reviewId = result.id
        const receiverId = !data.parentId ? props.post.user.id : props.parent.user.id
        // ws.sendToOneQueue(new MsgPack(reviewId, state.curUser.id, 'REVIEW', receiverId), 'interact')
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

function resize() {
    const input = document.getElementById('review-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

function insertEmoji({ unified }) {
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.content = state.content.concat(emoji)
}
</script>