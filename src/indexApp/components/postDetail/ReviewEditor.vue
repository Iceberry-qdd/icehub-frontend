<template>
    <div>
        <div
            v-if="!state.loading"
            class="flex flex-row gap-x-[1rem] px-[1rem] py-[1rem] relative"
            :class="[props.fromReviewPanel ? '' : 'border-gray-100 border-b-[1px]']">
            <div
                v-if="props.tieLocation == 'mid'"
                class="absolute bg-gray-200 h-full left-[2.2rem] timeline-mid top-0 w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'top'"
                class="absolute bg-gray-200 left-[2.2rem] timeline-top top-[2.5rem] w-[0.15rem] z-0" />
            <div
                v-if="props.tieLocation == 'bottom'"
                class="-z-0 absolute bg-gray-200 h-[2.5rem] left-[2.2rem] timeline-bottom top-0 w-[0.15rem]" />

            <div class="h-fit z-10">
                <Avatar
                    :user="state.curUser"
                    class="h-[2.5rem] max-w-none rounded-[6px] w-[2.5rem]">
                </Avatar>
            </div>
            <div class="w-full">
                <div
                    v-if="state.content.length > 0"
                    class="mb-2 text-[11pt]">
                    回复
                    <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
                </div>
                <VueShowdown
                    v-if="state.showMarkdownPanel == true"
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.content"
                    class="min-h-[3rem]">
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
                    rows="2"
                    placeholder="发布评论"
                    @input="resize">
                </textarea>
                <Transition name="fade">
                    <ImagePickerAction
                        v-if="state.imgList.length > 0"
                        :img-list="state.imgList"
                        :images-info="state.imageListInfo">
                    </ImagePickerAction>
                </Transition>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <div v-if="state.content.length > 0" class="flex flex-row items-center justify-between mt-2">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <div v-if="!state.loading" class="flex flex-row gap-x-1 items-center">
                        <!-- TODO implement it. -->
                        <input
                            v-show="false"
                            id="imgFile"
                            type="file"
                            name="imgFile"
                            multiple="true"
                            accept=".jpg,.png,.jpeg,.bmp,.gif,.svg,.heic,.nef,.webp,.tiff,.tif"
                            @change="clickFileSelector" />
                        <div
                            v-if="showUnImpl"
                            @click="preChoosePics">
                            <span
                                title="添加图片"
                                class="material-icons-round text-[1.25rem]"
                                :class="[hasImage ? 'active' : '']">
                                add_photo_alternate
                            </span>
                        </div>
                        <div
                            :id="emojiSwitchId"
                            class="flex-col relative">
                            <div
                                title="表情面板"
                                class="material-icons-round no-hover text-[1.25rem]"
                                :class="EmojiIconActiveClass"
                                @click="state.showEmojiPanel = !state.showEmojiPanel">
                                mood
                            </div>
                            <Transition name="fade">
                                <EmojiPanel
                                    v-if="state.showEmojiPanel"
                                    id="emojiPanel"
                                    :switch-id="emojiSwitchId"
                                    class="absolute max-h-[18rem] min-h-[8rem] min-w-max ring-1 ring-slate-900/5 shadow-lg top-[2.5rem] z-[99]"
                                    @dismiss-emoji-panel="dismissEmojiPanel"
                                    @insert-emoji-code="insertEmoji">
                                </EmojiPanel>
                            </Transition>
                        </div>
                        <div
                            :class="previewIconActiveClass"
                            title="预览"
                            class="material-icons-round no-hover text-[1.25rem]"
                            @click="state.showMarkdownPanel = !state.showMarkdownPanel">
                            visibility
                        </div>
                    </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <div v-else class="flex flex-row gap-x-2 items-center" />
                    <div class="flex flex-row gap-x-4 items-center">
                        <div
                            class="select-none text-[10pt]"
                            :class="leftWordCountClass"
                            :title="leftWordCount < 0 ? `超出${-leftWordCount}字` : ''">
                            {{ leftWordCount }}
                        </div>
                        <div

                            :class="submitPostBtnClass"
                            class="px-6 py-[0.4rem] rounded-full text-sm text-white"
                            @click="submitReview">
                            <span>发布</span>
                        </div>
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

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { reactive, computed, inject, defineAsyncComponent, ref } from 'vue'
import { reviewing, uploadImages } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/indexApp/js/websocket.js'
import EmojiPanel from '@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'
import { VueShowdown } from 'vue-showdown'
import Avatar from '@/components/Avatar.vue'
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/ImagePickerAction.vue'))

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
    },
    /** 时间线条位置 */
    // eslint-disable-next-line vue/no-unused-properties
    tieLocation: {
        type: String,
        required: false,
        default: ''
    },
    /** 是否从ReviewPanel触发 */
    // eslint-disable-next-line vue/no-unused-properties
    fromReviewPanel: {
        type: Boolean,
        required: true
    }
})
const { newReview } = inject('newReview')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
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
    maxContentWordCount: 300,
    textAreaId: props.fromReviewPanel ? 'reply-input' : 'review-input',
    imgList: [],
    imageListInfo: imageListInfo,
    images: null
})

const emojiSwitchId = computed(() => {
    return props.fromReviewPanel ? 'reply-editor-emoji-panel' : 'review-editor-emoji-panel'
})
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

const replyTo = computed(() => {
    return props.parent?.user?.nickname || props.post?.user?.nickname || '神秘用户'
})

function dismissEmojiPanel() {
    state.showEmojiPanel = false
}

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
        if (!response.ok) throw new Error((await response.json()).error)
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
    const textarea = document.getElementById(state.textAreaId)
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

const leftWordCount = computed(() => {
    return state.maxContentWordCount - state.content.length
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

function insertEmoji({ unified }) {
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.content = state.content.concat(emoji)
}

function clickFileSelector() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
    const imgs = Array.of(...imgFileSelector.files)

    if (imgs.length == 0) return
    state.imgList.push(...imgs)

    if (state.imgList.length > 9) { store.setWarningMsg('最多仅支持上传9张图片！') }

    while (state.imgList.length > 9) { state.imgList.pop() }
}

function preChoosePics() {
    choosePics()
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
}

const hasImage = computed(() => {
    return state.imgList.length > 0
})

//防止重复提交上一次的内容
function reset(){
    state.content = ''
    state.imgList = []
    state.imageListInfo = imageListInfo
    state.images = null
}
</script>