<template>
    <div class="bg-white flex flex-row justify-between max-sm:z-[1]">
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
                    @click="preChoosePics">
                    <span
                        title="添加图片"
                        class="material-icons-round"
                        :class="[hasImage ? 'active' : '']">
                        add_photo_alternate
                    </span>
                </div>
            </div>

            <div
                v-if="props.menuSet.has('VisibilityAction')"
                :id="`${props.switchFrom}-visibility-action`"
                class="flex-col max-sm:z-[1] relative">
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

                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                    <div
                        v-if="state.showVisibilityPanel && store.MOBILE_MODE"
                        class="bg-black/50 fixed h-screen left-0 sm:hidden top-0 w-screen z-[1001]" />
                    <Transition name="fade">
                        <VisibilityAction
                            v-if="state.showVisibilityPanel"
                            :switch-id="`${props.switchFrom}-visibility-action`"
                            class="absolute max-sm:bottom-0 max-sm:fixed max-sm:left-0 max-sm:w-full sm:top-[2.5rem] z-[1001]"
                            :visibility="props.visibility"
                            :ui="state.visibilityOptions"
                            @dismiss-visibility-action="dismissVisibilityAction"
                            @picked-visibility="pickVisibility">
                        </VisibilityAction>
                    </Transition>
                </Teleport>
            </div>

            <div
                v-if="props.menuSet.has('DatetimePicker')"
                id="datetime-picker-action"
                class="flex-col relative">
                <div
                    class="flex max-sm:hidden"
                    @click="handleTimeSelect">
                    <span
                        title="定时发送"
                        class="material-icons-round"
                        :class="[state.showSchedulePanel ? 'bg-blue-100 active' : '', props.createdTime ? 'active' : '']">
                        schedule
                    </span>
                </div>
                <div
                    class="flex sm:hidden"
                    @click="handleTimeSelect('mobile')">
                    <span
                        title="定时发送"
                        class="material-icons-round"
                        :class="[state.showSchedulePanel ? 'bg-blue-100 active' : '', props.createdTime ? 'active' : '']">
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
                        class="max-sm:hidden"
                        show-date-picker
                        show-time-picker
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
                :id="`${props.switchFrom}-emoji-panel`"
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
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <Teleport to="#app" :disabled="!store.MOBILE_MODE">
                    <div
                        v-if="state.showEmojiPanel && store.MOBILE_MODE"
                        class="bg-black/50 fixed h-screen left-0 sm:hidden top-0 w-screen z-[1001]" />
                    <Transition name="fade">
                        <EmojiPanel
                            v-if="state.showEmojiPanel"
                            :switch-id="`${props.switchFrom}-emoji-panel`"
                            class="absolute h-[18rem] max-sm:bottom-0 max-sm:fixed max-sm:h-[24rem] max-sm:left-0 max-sm:w-screen max-sm:z-[1001] min-h-[8rem] min-w-max pb-4 ring-1 ring-slate-900/5 shadow-lg sm:top-[2.5rem] z-[99]"
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
                    class="material-icons-round">
                    <!-- TODO implement it. -->
                    article
                </span>
            </div>

            <div
                v-if="showUnImpl && props.menuSet.has('PollAction')"
                id="poll">
                <span
                    title="投票"
                    class="material-icons-round">
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
                    class="material-icons-round">
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
                class="max-sm:hidden px-6 py-2 rounded-full text-sm text-white"
                @click="emits('submit')">
                <span>发布</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.material-icons-round {
    font-size: 1.3rem;
    cursor: pointer;
    padding: 0.4rem;
}

.material-icons-round:not(.close-btn).active {
    color: rgb(59 130 246);
}

.material-icons-round:not(.close-btn):not(.active) {
    color: #303133;
}

.material-icons-round:not(.close-btn):hover {
    background-color: #dbeafe !important;
    color: rgb(59 130 246);
}

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

<!-- eslint-disable vue/no-setup-props-reactivity-loss, vue/no-unused-properties -->
<script setup>
import { reactive, defineAsyncComponent, ref, computed, nextTick } from 'vue'
import { getDateTimeRange, toDatePickerFormat } from '@/indexApp/utils/formatUtils.js'
import { store } from '@/indexApp/js/store.js'
const EmojiPanel = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/EmojiPanel.vue'))
const VisibilityAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/VisibilityAction.vue'))
const DateTimePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/DateTimePickerAction.vue'))

const imgFile = ref()
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
        type:Number,
        required: true
    },
    /** 传入的图片文件列表 */
    imgList: {
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
        type:String,
        required: true
    }
})
const emits = defineEmits(['insertEmoji', 'changeVisibility', 'changeCreatedTime', 'submit', 'pushImage', 'popImage', 'resize', 'preview'])
const state = reactive({
    showVisibilityPanel: false,
    showEmojiPanel: false,
    showSchedulePanel: false,
    showImagePanel: false,
    visibilityOptions: [
        { id: 1, name: '公开', code: 'PUBLIC', icon: 'public' },
        { id: 2, name: '探索页内隐藏', code: 'NOT_TIMELINE', icon: 'vpn_lock' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon: 'people_outline' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon: 'people' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon: 'lock' },
    ]
})

function handleImgFileChange() {
    const imgs = Array.of(...imgFile.value.files)

    if (imgs.length == 0) return
    emits('pushImage', {images: imgs})

    if (props.imgList.length > 9) { store.setWarningMsg('最多仅支持上传9张图片！') }

    while (props.imgList.length > 9) { emits('popImage') }
}

function preChoosePics() {
    if (props.imgList.length > 0 || state.showImagePanel == true) {
        const lastState = state.showImagePanel
        state.showImagePanel = !lastState
        return
    }
    imgFile.value.showPicker()
}

const hasImage = computed(() => {
    return props.imgList.length > 0
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
    emits('insertEmoji', {emoji: emoji})
}

function pickVisibility(action) {
    emits('changeVisibility', {visibility: action.code})
    state.showVisibilityPanel = false
}

function handleTimeSelect(mode) {
    switch (mode) {
        case 'mobile':
            dateInput.value.showPicker()
            break;
        default:
            state.showSchedulePanel = !state.showSchedulePanel
            break;
    }
}

async function handleDateInputChange(e) {
    emits('changeCreatedTime', {createdTime: dateInput.value.value})
    await nextTick()
    if (props.createdTime) {
        timeInput.value.showPicker()
    }
}

async function handleTimeInputChange(e) {
    emits('changeCreatedTime', {createdTime: new Date(`${props.createdTime}T${timeInput.value.value}`).getTime()})
    await nextTick()
    pickedTimeAndClose({ timestamps: props.createdTime })
}

function pickedTimeAndClose(args) {
    if (args && args.timestamps) {
        if (Date.now() >= args.timestamps) {
            store.setWarningMsg('您安排的预发布时间不能早于现在！')
            emits('changeCreatedTime', {createdTime: undefined})
            return
        }

        emits('changeCreatedTime', {createdTime: args.timestamps})
    } else {
        emits('changeCreatedTime', {createdTime: undefined})

    }
    state.showSchedulePanel = false
}

async function toggleMarkdown() {
    emits('preview', {isShow: !props.showMarkdownPanel})
    await nextTick()
    if (!props.showMarkdownPanel) {
        emits('resize')
    }
}

const isValidContentLength = computed(() => {
    return leftWordCount.value >= 0 && leftWordCount.value < props.maxContentWordCount
})

const submitBtnClass = computed(() => ({
    'bg-blue-500': isValidContentLength.value,
    'cursor-pointer': isValidContentLength.value,
    'bg-gray-300': !isValidContentLength.value,
    'cursor-not-allowed': !isValidContentLength.value,
    'pointer-events-none': !isValidContentLength.value
}))

const leftWordCount = computed(() => {
    return props.maxContentWordCount - props.contentLength
})

const leftWordCountClass = computed(() => ({
    'text-blue-500': leftWordCount.value >= 0,
    'text-red-500': leftWordCount.value < 0,
    'hidden': leftWordCount.value === props.maxContentWordCount
}))
</script>