<template>
    <div class="border-b">
        <div class="bg-white pb-2 pl-2 pr-2 pt-2 relative">
            <div
                v-if="state.isLoading"
                class="-translate-x-1/2 absolute bg-white h-full left-1/2 top-0 w-full z-[102]">
                <div class="flex flex-col gap-2 h-full items-center justify-center">
                    <IconLoading class="-ml-1 h-6 mr-3 text-[#6b7280] w-6"></IconLoading>
                    <div class="text-[#6b7280] text-[11pt]">
                        帖子发布中...
                    </div>
                </div>
            </div>
            <div>
                <VueShowdown
                    v-if="state.showMarkdownPanel == true"
                    tag="markdown"
                    :extensions="['exts']"
                    :markdown="state.content"
                    class="min-h-[6rem]">
                </VueShowdown>
                <!-- eslint-disable-next-line vue/html-self-closing -->
                <textarea
                    v-else
                    id="post-input"
                    v-model="state.content"
                    class="focus:outline-none leading-6 overflow-hidden p-2 resize-none rounded text-[14pt] text-justify tracking-wide w-full"
                    :maxlength="state.maxContentWordCount + 50"
                    rows="3"
                    placeholder="发布帖子"
                    name="post"
                    @keydown="resize">
                </textarea>
            </div>
            <div class="flex flex-row justify-between px-2">
                <div class="content-center flex flex-row gap-x-1 items-center justify-start text-base">
                    <input
                        v-show="false"
                        id="imgFile"
                        type="file"
                        name="imgFile"
                        multiple="true"
                        accept="image/*"
                        @change="clickFileSelector" />
                    <div
                        id="imagePickerAction"
                        class="flex-col relative">
                        <div
                            class="flex"
                            @click="preChoosePics">
                            <span
                                title="添加图片"
                                class="material-icons-round"
                                :class="[hasImage || state.showImagePanel ? 'active' : '']">
                                add_photo_alternate
                            </span>
                        </div>
                        <Transition name="fade">
                            <ImagePickerAction
                                v-if="state.showImagePanel == true"
                                :img-list="state.imgList"
                                :images-info="state.data.imagesInfo">
                            </ImagePickerAction>
                        </Transition>
                    </div>

                    <div
                        id="VisibilityAction"
                        class="flex-col relative">
                        <div
                            class="flex"
                            @click="state.showVisibilityPanel = !state.showVisibilityPanel">
                            <span
                                title="帖子可见范围"
                                class="material-icons-round"
                                :class="[state.showVisibilityPanel ? 'bg-blue-100 active' : '', curVisibility.code != 'PUBLIC' ? 'active' : '']">
                                {{ curVisibility.icon }}
                            </span>
                        </div>
                        <Transition name="fade">
                            <VisibilityAction
                                v-if="state.showVisibilityPanel"
                                class="absolute top-[2.5rem] z-[99]"
                                :visibility="state.data.status"
                                :ui="state.visibilityActionData"
                                @dismiss-visibility-action="dismissVisibilityAction"
                                @picked-visibility="pickVisibility">
                            </VisibilityAction>
                        </Transition>
                    </div>

                    <div
                        id="dateTimePickerAction"
                        class="flex-col relative">
                        <div
                            class="flex"
                            @click="state.showSchedulePanel = !state.showSchedulePanel">
                            <span
                                title="定时发送"
                                class="material-icons-round"
                                :class="[state.showSchedulePanel ? 'bg-blue-100 active' : '', state.data.createdTime ? 'active' : '']">
                                schedule
                            </span>
                        </div>
                        <Transition name="fade">
                            <DateTimePickerAction
                                v-if="state.showSchedulePanel"
                                show-date-picker
                                show-time-picker
                                :valid-date-time-range="getDateTimeRange(new Date(), 1, 'YEAR')"
                                note-msg="您仅可以安排未来一年内的帖子"
                                :cur-picked-time="state.data.createdTime ?? 0"
                                @close-with-clear="pickedTimeAndClose"
                                @close-with-ok="pickedTimeAndClose">
                            </DateTimePickerAction>
                        </Transition>
                    </div>

                    <!-- <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3" /> -->

                    <div
                        id="emojiPanel"
                        class="flex-col relative">
                        <div
                            class="flex"
                            @click="state.showEmojiPanel = !state.showEmojiPanel">
                            <span
                                title="表情面板"
                                class="material-icons-round"
                                :class="[state.showEmojiPanel ? 'bg-blue-100 active' : '']">
                                mood
                            </span>
                        </div>
                        <Transition name="fade">
                            <EmojiPanel
                                v-if="state.showEmojiPanel"
                                class="absolute min-h-max min-w-max top-[2.5rem] z-[99]"
                                @dismiss-emoji-panel="dismissEmojiPanel"
                                @insert-emoji-code="insertEmoji">
                            </EmojiPanel>
                        </Transition>
                    </div>

                    <div
                        id="long-article"
                        @click="state.showMarkdownPanel = !state.showMarkdownPanel">
                        <span
                            v-if="showUnImpl"
                            :class="[state.showMarkdownPanel ? 'active' : '']"
                            title="长文章"
                            class="material-icons-round">
                            <!-- TODO implement it. -->
                            article
                        </span>
                    </div>

                    <div id="poll">
                        <span
                            v-if="showUnImpl"
                            title="投票"
                            class="material-icons-round">
                            <!-- TODO implement it. -->
                            equalizer
                        </span>
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
                        class="px-6 py-2 rounded-full text-sm text-white"
                        @click="submitPost">
                        <span>发布</span>
                    </div>
                </div>
            </div>
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

.material-icons-round {
    font-size: 16pt;
    cursor: pointer;
    padding: 0.4rem;
}

.material-icons-round.active {
    color: rgb(59 130 246);
    /* background-color: #dbeafe; */
}

.material-icons-round:not(.active) {
    color: #303133;
}

.material-icons-round:hover {
    background-color: #dbeafe !important;
    color: rgb(59 130 246);
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>

<script setup>
import { computed, reactive, watch, inject, defineAsyncComponent } from 'vue'
import { uploadImages, posting, postingPlan } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { VueShowdown } from 'vue-showdown'
import { renderMath } from '@/indexApp/js/katexConfig.js'
import { getDateTimeRange } from '@/indexApp/utils/formatUtils.js'
const EmojiPanel = defineAsyncComponent(() => import('@/indexApp/components/menus/PostEditorMenus/EmojiPanel.vue'))
const VisibilityAction = defineAsyncComponent(() => import('@/indexApp/components/menus/PostEditorMenus/VisibilityAction.vue'))
const DateTimePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/PostEditorMenus/DateTimePickerAction.vue'))
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/PostEditorMenus/ImagePickerAction.vue'))

const { postingNew } = inject('postingNew')
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const state = reactive({
    maxContentWordCount: 300,
    content: "",
    imgList: [],
    isLoading: false,
    result: "",
    showImagePanel: false,
    data: {
        allowReview: true,
        content: "",
        top: false,
        attachmentsUrl: [],
        type: "NORMAL",
        status: 'PUBLIC',
        createdTime: null,
        imagesInfo: [
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" },
            { hidden: "false", altText: "", contentType: "" }
        ],
        userId: JSON.parse(localStorage.getItem("CUR_USER")).id
    },
    showVisibilityPanel: false,
    showEmojiPanel: false,
    showMarkdownPanel: false,
    showSchedulePanel: false,
    visibilityActionData: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'people_outline' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
    ]
})

const hasImage = computed(() => {
    return state.imgList.length > 0
})

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

function resize() {
    const input = document.getElementById('post-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

async function submitPost() {
    try {
        if (state.content.length == 0) throw new Error("文字内容不能为空！")
        if (state.data.createdTime && Date.now() >= state.data.createdTime) throw new Error('您安排的预发布时间早于现在！')
        if (leftWordCount.value < 0) throw new Error('您发布的帖子内容超出长度限制！')

        state.isLoading = true
        state.data.type = state.showMarkdownPanel == true ? 'MARKDOWN' : 'NORMAL'
        state.data.content = state.content
        for (let i = 0; i < 9; i++) {
            if (state.imgList.length <= i) break
            const mediaType = state.imgList[i].type
            state.data.imagesInfo[i].contentType = mediaType
        }

        if (state.imgList.length > 0) {
            const response = await uploadImages(state.imgList, state.data.imagesInfo)
            //if (!response.ok) throw new Error(response)
            state.data.attachmentsUrl = JSON.parse(response)
        }

        const response = state.data.createdTime ? await postingPlan(state.data) : await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)
        state.result = await response.json()

        //防止重复提交上一次的内容
        state.content = ''
        state.imgList = []
        state.showImagePanel = false
        state.data.allowReview = true
        state.data.content = ''
        state.data.top = false
        state.data.attachmentsUrl = []
        state.data.createdTime = null
        state.top = false
        state.data.status = 'PUBLIC'

        postingNew(state.result)
    } catch (err) {
        store.setErrorMsg(err.message)
        console.error(err)
    } finally {
        state.isLoading = false
    }
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
    if (state.imgList.length > 0 || state.showImagePanel == true) {
        const lastState = state.showImagePanel
        state.showImagePanel = !lastState
        return
    }
    choosePics()
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
}

function insertEmoji({ unified }) {
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    state.content = state.content.concat(emoji)
}

function pickVisibility(args) {
    state.data.status = args[0]
    state.showVisibilityPanel = false
}

const curVisibility = computed(() => {
    const filteredVisibility = state.visibilityActionData.filter(it => it.code == state.data.status)
    return filteredVisibility.length > 0 ? filteredVisibility[0] : state.visibilityActionData[0]
})

function pickedTimeAndClose(args) {
    if (args && args.timestamps) {
        if (Date.now() >= args.timestamps) {
            store.setWarningMsg('您安排的预发布时间不能早于现在！')
            return
        }

        state.data.createdTime = args.timestamps
    } else {
        state.data.createdTime = null
    }
    state.showSchedulePanel = false
}

function dismissVisibilityAction() {
    state.showVisibilityPanel = false
}

function dismissEmojiPanel() {
    state.showEmojiPanel = false
}

watch(() => state.showMarkdownPanel, (newVal) => {
    if (newVal == true) {
        renderMath()
    }
})
</script>