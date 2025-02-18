<template>
    <div>
        <div
            v-if="!state.loading"
            class="flex flex-row gap-x-4 max-sm:gap-x-3 max-sm:p-3 max-sm:pb-0 p-4 relative"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 dark:border-b-[#1e1e1e] border-b-[1px]']">
            <div
                v-if="props.tieLocation == 'mid'"
                class="absolute bg-gray-200 dark:bg-neutral-800 h-full left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'top'"
                class="absolute bg-gray-200 dark:bg-neutral-800 left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'bottom'"
                class="-z-0 absolute bg-gray-200 dark:bg-neutral-800 h-[2.5rem] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-bottom top-0 w-[0.15rem]" />

            <div class="h-fit z-10">
                <Avatar
                    :user="state.curUser"
                    class="h-[2.5rem] max-w-none rounded-[6px] text-[2.5rem] w-[2.5rem]">
                </Avatar>
            </div>
            <div
                ref="panel"
                class="w-full">
                <div
                    v-if="state.content.length > 0"
                    class="dark:text-white/50 text-[0.85rem] text-gray-400">
                    回复
                    <span class="cursor-pointer font-bold">@{{ replyTo }}</span>
                </div>
                <VueShowdown
                    v-if="state.showMarkdownPanel == true"
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.content"
                    class="break-all max-sm:w-[calc(100dvw-2.5rem-0.75rem*3)] min-h-[3rem]">
                </VueShowdown>
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    v-else
                    :id="state.textAreaId"
                    ref="reviewInput"
                    v-model="state.content"
                    :disabled="state.loading"
                    :class="{ 'text-gray-400': state.loading }"
                    class="bg-transparent break-all focus:outline-none leading-6 max-w-full min-h-fit min-w-full overflow-y-hidden resize-none text-[1rem] text-justify tracking-wide"
                    :maxlength="state.maxContentWordCount + 50"
                    rows="3"
                    placeholder="写点什么吧~"
                    @input="resize">
                </textarea>
                <Transition name="fade">
                    <ImagePickerAction
                        v-if="state.imgList.length > 0"
                        editor-menu-id="reviewEditorMenu"
                        :img-list="state.imgList"
                        :selector="imgFile"
                        :images-info="state.imageListInfo">
                    </ImagePickerAction>
                </Transition>
                <EditorMenu
                    v-if="state.content.length > 0 || store.MOBILE_MODE"
                    id="reviewEditorMenu"
                    :class="{'px-2': props.fromReviewPanel && store.MOBILE_MODE}"
                    class="bottom-0 left-0 max-sm:fixed max-sm:h-10 max-sm:pr-4 w-full z-10"
                    switch-from="review-panel"
                    :menu-set="state.menuSet"
                    :max-content-word-count="state.maxContentWordCount"
                    :content-length="state.content.length"
                    :img-list="state.imgList"
                    :show-markdown-panel="state.showMarkdownPanel"
                    @insert-emoji="insertEmoji"
                    @submit="submitReview"
                    @push-image="({images}) => {state.imgList.push(...images)}"
                    @pop-image="() => {state.imgList.pop()}"
                    @resize="resize"
                    @preview="({isShow}) => {state.showMarkdownPanel = isShow}">
                </EditorMenu>
            </div>
        </div>
        <div
            v-else
            class="bg-white dark:bg-[#1e1e1e] dark:text-white/50 flex flex-col gap-y-2 h-[8rem] items-center justify-center max-sm:fixed max-sm:h-screen max-sm:w-screen top-0 z-10"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <IconLoading
                class="h-5 text-primary w-5"
                :percent="state.uploadPercent">
            </IconLoading>
            <div class="text-[0.9rem]">
                {{ state.commitText }}
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-unused-properties -->
<script setup>
import { reactive, computed, inject, defineAsyncComponent, ref, watch } from 'vue'
import { reviewing, uploadImages } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
const EditorMenu = defineAsyncComponent(() => import('@/indexApp/components/menus/EditorMenu.vue'))
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/ImagePickerAction.vue'))

const panel = ref()
const imgFile = ref()
const reviewInput = ref()
const emits = defineEmits(['dismiss', 'isLoading', 'showMarkdownPanel', 'submit'])
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
    },
    /** 时间线条位置 */
    tieLocation: {
        type: String,
        required: false,
        default: ''
    },
    /** 是否从ReviewPanel触发 */
    fromReviewPanel: {
        type: Boolean,
        required: true
    },
    /** 当fromReviewPanel为true且store.MOBILE_MODE为true时，标识submit操作从父组件主动触发 */
    submit: {
        type: Boolean,
        required: false,
        default: false
    }
})
const { newReviewOnUi } = inject('newReviewOnUi')
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const imageListInfo = ref([
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" }
    ])
const state = reactive({
    content: '',
    loading: false,
    uploadPercent: -1,
    commitText: undefined,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showEmojiPanel: false,
    showMarkdownPanel: false,
    maxContentWordCount: 1000,
    textAreaId: props.fromReviewPanel ? 'reply-input' : 'review-input',
    imgList: [],
    imageListInfo: imageListInfo,
    images: null,
    menuSet: new Set(['ImagePicker','EmojiPanel', 'MarkdownPreview'])
})

const replyTo = computed(() => {
    return props.parent?.user?.nickname || props.post?.user?.nickname || '神秘用户'
})

if(props.fromReviewPanel){
    watch(() => state.loading, (newVal, oldVal) => {
        emits('isLoading', {isLoading: newVal})
    })
    watch(() => state.showMarkdownPanel, (newVal, oldVal) => {
        emits('showMarkdownPanel', {isShow: newVal})
    })
}

if(props.fromReviewPanel && store.MOBILE_MODE){
    watch(() => props.submit, (newVal, oldVal) => {
        if(newVal === true){
            submitReview()
        }
    })
}

async function submitReview() {
    if (state.loading == true) {
        store.setWarningMsg('正在提交中，请勿重复提交！')
        emits('submit', {submitting: false})
        return
    }

    state.loading = true
    try {
        if (props.post?.plan) throw new Error('该帖子尚未发布，无法进行评论操作')
        if (state.content.trim() == '') throw new Error('评论内容不能为空！')
        if (!props.post && !props.parent) throw new Error('该评论没有依赖的父级内容，非法评论！')

        const data = {
            'content': state.content,
            'postId': props.post?.id || props.parent.postId,
            'parentId': props.parent?.id,
            'userId': state.curUser.id
        }

        if (state.imgList.length > 0) {
            state.commitText = '图片上传中...'
            const response = await uploadImages(state.imgList, (e) => {
                if (e.lengthComputable) {
                    state.uploadPercent = e.loaded / e.total * 100
                }
            })
            if (!response.ok) throw new Error((await response.json()).message)
            state.images = await response.json()

            state.uploadPercent = -1
            state.commitText = '帖子发布中...'
            for (let i = 0; i < state.images.length; i++) {
                state.images[i].hidden = state.imageListInfo[i].hidden
                state.images[i].altText = state.imageListInfo[i].altText
            }
            data.images = state.images
        }

        const response = await reviewing(data)
        if (!response.ok) throw new Error((await response.json()).message)
        const result = await response.json()
        newReviewOnUi({ review: result })
        emits('dismiss')
        reset()

        // const reviewId = result.id
        // const receiverId = !data.parentId ? props.post.user.id : props.parent.user.id
        // ws.sendToOneQueue(new MsgPack(reviewId, state.curUser.id, 'REVIEW', receiverId), 'interact')
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
        state.uploadPercent = -1
        state.commitText = undefined
        emits('submit', {submitting: false})
    }
}

function insertEmoji({emoji}){
    const start = reviewInput.value.selectionStart
    state.content = state.content.slice(0, start).concat(emoji).concat(state.content.slice(start))
}

function resize() {
    if(!CSS.supports('field-sizing: content')){
        postInput.value.style.height = 'auto'
        postInput.value.style.height = `${postInput.value.scrollHeight}px`
    }
}

//防止重复提交上一次的内容
function reset(){
    state.content = ''
    state.imgList = []
    state.imageListInfo = imageListInfo
    state.images = null
}
</script>