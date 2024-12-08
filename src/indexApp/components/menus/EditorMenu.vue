<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="bg-inherit flex flex-row justify-between">
        <div class="content-center flex flex-row gap-x-1 items-center justify-start text-base">
            <input
                v-show="false"
                id="imgFile"
                ref="imgFile"
                type="file"
                name="imgFile"
                multiple="true"
                accept=".jpg,.png,.jpeg,.bmp,.gif,.svg,.heic,.nef,.webp,.tiff,.tif"
                @change="handleImgFileChange" />
            <div
                v-if="props.menuSet.has('ImagePicker')"
                id="image-picker-action"
                class="flex-col relative">
                <div
                    class="flex"
                    @click="canAddImage ? preChoosePics() : undefined">
                    <span
                        title="添加图片"
                        class="material-symbols-rounded"
                        :class="{'active': hasImage && canAddImage, 'inactive no-hover': hasVideo || !canAddImage}">
                        add_photo_alternate
                    </span>
                </div>
            </div>

            <input
                v-show="false"
                id="videoFile"
                ref="videoFile"
                type="file"
                name="videoFile"
                multiple="false"
                accept="video/*"
                @change="handleVideoFileChange" />
            <div
                v-if="props.menuSet.has('VideoPicker')"
                id="video-picker-action"
                class="flex-col relative">
                <div
                    class="flex"
                    @click="canAddVideo ? preChooseVideos() : undefined">
                    <span
                        :title="`${state.verifiedUser ? '添加视频' : '仅认证用户可添加视频'}`"
                        class="material-symbols-rounded"
                        :class="{'active': hasVideo && canAddVideo, 'inactive no-hover': hasImage || !canAddVideo}">
                        smart_display
                    </span>
                </div>
            </div>

            <div
                v-if="props.menuSet.has('VisibilityAction')"
                :id="`${props.switchFrom}-visibility-action-btn`"
                class="flex-col max-sm:z-[1] relative">
                <div
                    class="flex"
                    @click="state.showVisibilityPanel = !state.showVisibilityPanel">
                    <span
                        title="帖子可见范围"
                        class="material-symbols-rounded"
                        :class="[state.showVisibilityPanel ? 'bg-primaryContainer active' : '', curVisibility.code != 'PUBLIC' ? 'active' : '']">
                        {{ curVisibility.icon }}
                    </span>
                </div>

                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                    <div
                        v-if="state.showVisibilityPanel && store.MOBILE_MODE"
                        class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]" />
                    <Transition name="fade">
                        <VisibilityAction
                            v-if="state.showVisibilityPanel"
                            :id="`${props.switchFrom}-visibility-action`"
                            :switch-id="`${props.switchFrom}-visibility-action`"
                            class="absolute max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:pb-4 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-full ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:top-[2.5rem] z-[1001]"
                            :visibility="props.visibility"
                            :ui="state.visibilityOptions"
                            @dismiss="dismissVisibilityAction"
                            @picked-visibility="pickVisibility">
                        </VisibilityAction>
                    </Transition>
                </Teleport>
            </div>

            <div
                v-if="props.menuSet.has('DatetimePicker')"
                :id="`${props.switchFrom}-datetime-picker-action-btn`"
                class="flex-col relative">
                <div
                    class="flex"
                    @click="handleTimeSelect">
                    <span
                        title="定时发送"
                        class="material-symbols-rounded"
                        :class="[state.showSchedulePanel ? 'bg-primaryContainer active' : '', props.createdTime ? 'active' : '']">
                        schedule
                    </span>
                </div>
                <input
                    v-show="false"
                    id="date-input"
                    ref="dateInput"
                    type="date"
                    :min="toDatePickerFormat(getDateTimeRange(new Date(), 1, 'YEAR')[0])"
                    :max="toDatePickerFormat(getDateTimeRange(new Date(), 1, 'YEAR')[1])"
                    @change="handleDateInputChange" />
                <input
                    v-show="false"
                    id="time-input"
                    ref="timeInput"
                    type="time"
                    @change="handleTimeInputChange" />
                <Transition name="fade">
                    <DateTimePickerAction
                        v-if="state.showSchedulePanel"
                        :id="`${props.switchFrom}-datetime-picker-action`"
                        class="absolute border-[1px] dark:border-neutral-700 max-sm:hidden min-h-max min-w-max ring-1 ring-slate-900/5 rounded-[8px] shadow-lg top-10 z-[99]"
                        show-date-picker
                        show-time-picker
                        :switch-id="`${props.switchFrom}-datetime-picker-action`"
                        :valid-date-time-range="getDateTimeRange(new Date(), 1, 'YEAR')"
                        note-msg="您仅可以安排未来一年内的帖子"
                        :cur-picked-time="props.createdTime ?? 0"
                        @close-with-clear="pickedTimeAndClose"
                        @close-with-ok="pickedTimeAndClose">
                    </DateTimePickerAction>
                </Transition>
            </div>

            <!-- <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3" /> -->

            <div
                v-if="props.menuSet.has('EmojiPanel')"
                :id="`${props.switchFrom}-emoji-panel-btn`"
                class="flex-col relative">
                <div
                    class="flex"
                    @click="state.showEmojiPanel = !state.showEmojiPanel">
                    <span
                        title="表情面板"
                        class="material-symbols-rounded"
                        :class="[state.showEmojiPanel ? 'bg-primaryContainer active' : '']">
                        mood
                    </span>
                </div>
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                    <div
                        v-if="state.showEmojiPanel && store.MOBILE_MODE"
                        class="bg-black/50 fixed fixed-page h-screen left-0 sm:hidden top-0 w-screen z-[1001]" />
                    <Transition name="fade">
                        <EmojiPanel
                            v-if="state.showEmojiPanel"
                            :id="`${props.switchFrom}-emoji-panel`"
                            :switch-id="`${props.switchFrom}-emoji-panel`"
                            class="absolute dark:border-neutral-700 h-[18rem] max-sm:bottom-0 max-sm:fixed max-sm:h-[24rem] max-sm:left-0 max-sm:rounded-b-none max-sm:rounded-t-[0.75rem] max-sm:w-screen max-sm:z-[1001] min-h-[8rem] min-w-max pb-4 pr-[1px] px-1 ring-1 ring-slate-900/5 rounded-[8px] shadow-lg sm:top-[2.5rem] z-[99]"
                            @dismiss-emoji-panel="dismissEmojiPanel"
                            @insert-emoji-code="insertEmoji">
                        </EmojiPanel>
                    </Transition>
                </Teleport>
            </div>

            <div
                v-if="showUnImpl && props.menuSet.has('LongArticle')"
                id="long-article">
                <span
                    title="长文章"
                    class="material-symbols-rounded">
                    <!-- TODO implement it. -->
                    article
                </span>
            </div>

            <div
                v-if="showUnImpl && props.menuSet.has('PollAction')"
                id="poll">
                <span
                    title="投票"
                    class="material-symbols-rounded">
                    <!-- TODO implement it. -->
                    equalizer
                </span>
            </div>

            <div
                v-if="props.menuSet.has('MarkdownPreview')"
                id="preview"
                @click="toggleMarkdown">
                <span
                    :class="[props.showMarkdownPanel ? 'active' : '']"
                    title="预览"
                    class="material-symbols-rounded">
                    visibility
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
                :class="submitBtnClass"
                class="max-sm:hidden px-6 py-2 rounded-full text-sm"
                @click="emits('submit')">
                <span>发布</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.material-symbols-rounded {
    font-size: 1.3rem;
    cursor: pointer;
    padding: 0.4rem;
}

.material-symbols-rounded.inactive {
    color: rgb(var(--color-border) / 1);
    cursor: not-allowed;
}

.material-symbols-rounded.active {
    color: rgb(var(--color-primary));
}

.material-symbols-rounded.active:where([theme="dark"], [theme="dark"] *){
    color: inherit;
    background-color: rgb(var(--color-primary-container));
}

.material-symbols-rounded:not(.inactive):hover {
    background-color: rgb(var(--color-primary-container)) !important;
    color: rgb(var(--color-primary));
}

.material-symbols-rounded:not(.inactive):where([theme="dark"], [theme="dark"] *):hover{
    color: inherit;
}
</style>

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-unused-properties, vue/max-lines-per-block -->
<script setup>
import { reactive, defineAsyncComponent, ref, computed, nextTick } from 'vue'
import { getDateTimeRange, toDatePickerFormat } from '@/indexApp/utils/formatUtils.js'
import { store } from '@/indexApp/js/store.js'
const EmojiPanel = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'))
const VisibilityAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/VisibilityAction.vue'))
const DateTimePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/DateTimePickerAction.vue'))

const imgFile = ref()
const videoFile = ref()
const dateInput = ref()
const timeInput = ref()
const showUnImpl = JSON.parse(import.meta.env.VITE_SHOW_UNFINISHED)
const props = defineProps({
    /**
     * 传入的默认选择可见范围
     */
    visibility: {
        type: String,
        required: false,
        default: 'PUBLIC'
    },
    /** 传入的创建时间 */
    createdTime: {
        type: [Number, String],
        required: false,
        default: undefined
    },
    /** 可以输入的最大字符数 */
    maxContentWordCount: {
        type: Number,
        required: false,
        default: Number.MAX_SAFE_INTEGER
    },
    /** 当前已输入内容的字符长度 */
    contentLength: {
        type: Number,
        required: true
    },
    /** 传入的图片文件列表 */
    imgList: {
        type: Array,
        required: false,
        default: new Array(0)
    },
    /** 传入的视频文件列表 */
    videoList: {
        type: Array,
        required: false,
        default: new Array(0)
    },
    /** 是否为markdown预览模式 */
    showMarkdownPanel: {
        type: Boolean,
        required: false,
        default: false
    },
    /** 控制需要显示哪些菜单 */
    menuSet: {
        type: Set,
        required: true
    },
    /** 声明是从哪里打开的菜单 */
    switchFrom: {
        type: String,
        required: true
    }
})
const emits = defineEmits(['insertEmoji', 'changeVisibility', 'changeCreatedTime', 'submit', 'pushImage', 'popImage', 'resize', 'preview', 'pushVideo', 'popVideo'])
const state = reactive({
    showVisibilityPanel: false,
    showEmojiPanel: false,
    showSchedulePanel: false,
    showImagePanel: false,
    visibilityOptions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'person' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
    ],
    verifiedUser: JSON.parse(localStorage.getItem("CUR_USER")).verified
})

function handleImgFileChange() {
    const imgs = Array.of(...imgFile.value.files)

    if (imgs.length == 0) return
    emits('pushImage', { images: imgs })

    if (props.imgList.length > 9) { store.setWarningMsg('最多仅支持上传9张图片！') }

    while (props.imgList.length > 9) { emits('popImage') }
}

function handleVideoFileChange() {
    const videos = Array.of(...videoFile.value.files)

    if (videos.length == 0) return
    emits('pushVideo', { videos: videos })

    if (props.videoList.length > 1) { store.setWarningMsg('最多仅支持上传1条视频！') }

    while (props.videoList.length > 1) { emits('popVideo') }
}

function preChoosePics() {
    if (props.imgList.length > 0 || state.showImagePanel == true) {
        const lastState = state.showImagePanel
        state.showImagePanel = !lastState
        return
    }
    imgFile.value.showPicker()
}

function preChooseVideos() {
    if (props.videoList.length > 0 || state.showVideoPanel == true) {
        const lastState = state.showVideoPanel
        state.showVideoPanel = !lastState
        return
    }
    videoFile.value.showPicker()
}

const hasImage = computed(() => {
    return props.imgList.length > 0
})

const hasVideo = computed(() => {
    return props.videoList.length > 0
})

const canAddImage = computed(() => {
    return props.imgList.length < 9 && !hasVideo.value
})

const canAddVideo = computed(() => {
    return props.videoList.length < 1 && !hasImage.value && state.verifiedUser
})

const curVisibility = computed(() => {
    const filteredVisibility = state.visibilityOptions.filter(it => it.code == props.visibility)
    return filteredVisibility.length > 0 ? filteredVisibility[0] : state.visibilityOptions[0]
})

function dismissVisibilityAction() {
    state.showVisibilityPanel = false
}

function dismissEmojiPanel() {
    state.showEmojiPanel = false
}

function insertEmoji(unified) {
    const emoji = String.fromCodePoint(...unified.split('-').map(it => `0x${it}`))
    emits('insertEmoji', { emoji: emoji })
}

function pickVisibility(action) {
    emits('changeVisibility', { visibility: action.code })
    state.showVisibilityPanel = false
}

// XXX 分两步分别选择日期和时间，容易引起歧义
function handleTimeSelect() {
    const onlyDate = typeof props.createdTime === 'string'
    const dateAndTime = typeof props.createdTime === 'number'
    const emptyDate = typeof props.createdTime === 'undefined'

    if (store.MOBILE_MODE && (dateAndTime || emptyDate)) {
        dateInput.value.showPicker()
        return
    }

    if (store.MOBILE_MODE && onlyDate) {
        timeInput.value.showPicker()
        return
    }

    if (!store.MOBILE_MODE) {
        state.showSchedulePanel = !state.showSchedulePanel
    }
}

function handleDateInputChange() {
    emits('changeCreatedTime', { createdTime: dateInput.value.value })
}

async function handleTimeInputChange() {
    emits('changeCreatedTime', { createdTime: new Date(`${props.createdTime}T${timeInput.value.value}`).getTime() })
    await nextTick()
    pickedTimeAndClose({ timestamps: props.createdTime })
}

function pickedTimeAndClose(args) {
    if (args && args.timestamps) {
        if (Date.now() >= args.timestamps) {
            store.setWarningMsg('您安排的预发布时间不能早于现在！')
            emits('changeCreatedTime', { createdTime: undefined })
            return
        }

        emits('changeCreatedTime', { createdTime: args.timestamps })
    } else {
        emits('changeCreatedTime', { createdTime: undefined })

    }
    state.showSchedulePanel = false
}

async function toggleMarkdown() {
    emits('preview', { isShow: !props.showMarkdownPanel })
    await nextTick()
    if (!props.showMarkdownPanel) {
        emits('resize')
    }
}

const isValidContentLength = computed(() => {
    return leftWordCount.value >= 0 && leftWordCount.value < props.maxContentWordCount
})

const submitBtnClass = computed(() => ({
    'bg-primary cursor-pointer text-onPrimary dark:text-onPrimaryContainer': isValidContentLength.value,
    'bg-border text-onPrimary dark:text-onSurface-disable cursor-not-allowed pointer-events-none': !isValidContentLength.value,
}))

const leftWordCount = computed(() => {
    return props.maxContentWordCount - props.contentLength
})

const leftWordCountClass = computed(() => ({
    'text-primary dark:text-onPrimary': leftWordCount.value >= 0,
    'text-onError': leftWordCount.value < 0,
    'hidden': leftWordCount.value === props.maxContentWordCount
}))
</script>