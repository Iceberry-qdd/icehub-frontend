<template>
    <div>
        <div
            v-if="!state.loading"
            class="flex flex-row gap-x-4 max-sm:gap-x-3 max-sm:p-3 max-sm:pb-0 p-4 relative"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <div
                v-if="props.tieLocation == 'mid'"
                class="absolute bg-gray-200 h-full left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'top'"
                class="absolute bg-gray-200 left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'bottom'"
                class="-z-0 absolute bg-gray-200 h-[2.5rem] left-[calc(2.5rem/2+1rem)] max-sm:left-[calc(2.5rem/2+0.75rem)] timeline-bottom top-0 w-[0.15rem]" />

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
                    class="text-[11pt]">
                    回复
                    <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
                </div>
                <VueShowdown
                    v-if="state.showMarkdownPanel == true"
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.content"
                    class="break-all max-sm:w-[calc(100vw-2.5rem-0.75rem*3)] min-h-[3rem]">
                </VueShowdown>
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    v-else
                    :id="state.textAreaId"
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
                    @insert-emoji="({emoji}) => {state.content = state.content.concat(emoji)}"
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
            class="bg-white flex flex-col gap-y-2 h-[8rem] items-center justify-center max-sm:fixed max-sm:h-screen max-sm:w-screen top-0 z-10"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <IconLoading class="'h-5 text-white' w-5"></IconLoading>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="text-[11pt]">评论发布中...</div>
        </div>
    </div>
</template>

<style scoped>
.fade-enter-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-leave-active {
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from {
    opacity: 0;
}

.fade-leave-to {
    opacity: 0;
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-unused-properties -->
<script setup>
import { reactive, computed, inject, defineAsyncComponent, ref, watch } from 'vue'
import { reviewing, uploadImages } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import EditorMenu from '@/indexApp/components/menus/EditorMenu.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/ImagePickerAction.vue'))

const panel = ref()
const imgFile = ref()
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
const { newReview } = inject('newReview')
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
            const response = await uploadImages(state.imgList)
            //if (!response.ok) throw new Error(response)
            state.images = JSON.parse(response)

            for (let i = 0; i < state.images.length; i++) {
                state.images[i].hidden = state.imageListInfo[i].hidden
                state.images[i].altText = state.imageListInfo[i].altText
            }
            data.images = state.images
        }

        const response = await reviewing(data)
        if (!response.ok) throw new Error((await response.json()).message)
        const result = await response.json()
        newReview({ review: result })
        state.content = ''
        emits('dismiss')
        reset()

        const reviewId = result.id
        const receiverId = !data.parentId ? props.post.user.id : props.parent.user.id
        // ws.sendToOneQueue(new MsgPack(reviewId, state.curUser.id, 'REVIEW', receiverId), 'interact')
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
        emits('submit', {submitting: false})
    }
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