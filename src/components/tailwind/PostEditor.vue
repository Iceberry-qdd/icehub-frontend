<template>
    <div class="border-b">
        <div class=" relative bg-white pl-2 pr-2 pt-2 pb-2">
            <div v-if="state.isLoading" class="absolute left-1/2 -translate-x-1/2 z-[102] top-0 w-full h-full bg-white">
                <div class="flex flex-col justify-center items-center gap-2 h-full">
                    <IconLoading class="-ml-1 mr-3 h-6 w-6 text-[#6b7280]"></IconLoading>
                    <div class="text-[11pt] text-[#6b7280]">帖子发布中...</div>
                </div>
            </div>
            <div>
                <VueShowdown tag="markdown" :extensions="['exts']" v-if="state.showMarkdownPanel==true" :markdown="state.content" class="min-h-[6rem]"></VueShowdown>
                <textarea v-else v-model="state.content" @keydown="resize"
                    class="p-2 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                    maxlength="25000" rows="3" placeholder="发布帖子" id="post-input" name="post"></textarea>
            </div>
            <div class="px-2 flex flex-row justify-between">
                <div class="text-base flex flex-row gap-x-4 items-center justify-start content-center">
                    <input v-show="false" type="file" id="imgFile" @change="clickFileSelector" name="imgFile" multiple="true" accept="image/*" />
                    <div id= "imagePickerAction" class="relative flex-col">
                        <div class="flex" @click="preChoosePics">
                            <add-picture v-tooltip="'添加图片'" theme="outline" size="18" fill="#333" :strokeWidth="3" :class="[hasImage ? 'bg-blue-200' : '', state.showImagePanel ? 'bg-[#d3d3d5]' : '']" />
                        </div>
                        <Transition name="fade">
                            <ImagePickerAction
                                v-if="state.showImagePanel == true"
                                :imgList="state.imgList"
                                :imagesInfo = 'state.data.imagesInfo'>
                            </ImagePickerAction>
                        </Transition>
                    </div>

                    <!-- <video-two v-tooltip="'添加视频'" theme="outline" size="18" fill="#333" :strokeWidth="3" v-if="!hasImage" /> -->

                    <div id = "visibilityForPostEditorAction" class="relative flex-col">
                        <div class="flex" @click="state.showVisibilityPanel = !state.showVisibilityPanel">
                            <preview-open v-tooltip="'帖子可见范围'" v-if="state.data.status == 'PUBLIC'" theme="outline" size="18" fill="#333"
                                :strokeWidth="3" :class="[state.showVisibilityPanel ? 'bg-[#d3d3d5]' : '']" />
                            <preview-close v-tooltip="'帖子可见范围'" v-else theme="outline" size="18" fill="#333" :strokeWidth="3"
                                class="bg-blue-200" />
                        </div>
                        <Transition name="fade">
                            <VisibilityForPostEditorAction 
                                class="absolute top-[2.5rem]"
                                :visibility="state.data.status"
                                v-if="state.showVisibilityPanel"
                                @dismissVisibilityForPostEditorAction="dismissVisibilityForPostEditorAction"
                                @picked-visibility="pickVisibility">
                            </VisibilityForPostEditorAction>
                        </Transition>
                    </div>

                    <div id = "dateTimePickerAction" class="relative flex-col">
                        <div class="flex" @click="state.showSchedulePanel = !state.showSchedulePanel">
                            <m-time v-tooltip="'定时发送'" theme="outline" size="18" fill="#333" :strokeWidth="3" :class="[state.showSchedulePanel ? 'bg-[#d3d3d5]' : '',state.data.createdTime ? 'bg-blue-200' : '']" />
                        </div>
                        <Transition name="fade">
                            <DateTimePickerAction
                                v-if="state.showSchedulePanel"
                                :showDatePicker = 'true'
                                :showTimePicker = 'true'
                                :validDateTimeRange = 'getDateTimeRange(new Date(), 1, "YEAR")'
                                :noteMsg = '"您仅可以安排未来一年内的帖子"'
                                :curPickedTime = state.data.createdTime
                                @closeWithClear = 'pickedTimeAndClose'
                                @closeWithOk = 'pickedTimeAndClose'
                            ></DateTimePickerAction>
                        </Transition>
                    </div>

                    <!-- <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3" /> -->

                    <div id="emojiPanel" class="relative flex-col">
                        <div class="flex" @click="state.showEmojiPanel=!state.showEmojiPanel">
                            <grinning-face-with-open-mouth v-tooltip="'表情面板'" theme="outline" size="18" fill="#333" :strokeWidth="3" :class="[state.showEmojiPanel ? 'bg-[#d3d3d5]' : '']" />
                        </div>
                        <Transition name="fade">
                            <EmojiPanel
                                @dismissEmojiPanel="dismissEmojiPanel"
                                v-if="state.showEmojiPanel" @emojiName="insertEmoji"
                                class="z-[99] absolute top-[2.5rem] min-w-max min-h-max">
                            </EmojiPanel>
                        </Transition>
                    </div>

                    <button @click="state.showMarkdownPanel=!state.showMarkdownPanel"
                        :class="[state.showMarkdownPanel?'bg-[#bfdbfe]':'bg-transparent']"
                        class="hover:bg-gray-300 p-1 w-[30px] h-[31px] rounded-full" >
                        <i class="cursor-pointer bi bi-markdown-fill " title="启用markdown格式并预览"></i>
                    </button>

                    <!-- <i class="cursor-pointer bi bi-code-slash" title="添加代码片段"></i>
                    <i class="cursor-pointer bi bi-arrow-up-square-fill" title="在个人主页置顶"></i>-->
                </div>

                <div @click="submitPost"
                    :class='[state.content.length > 0 ? "bg-[#0d6efd] cursor-pointer" : "bg-gray-400 cursor-not-allowed pointer-events-none"]'
                    class="text-sm py-2 px-6 rounded-full text-white">
                    <span>发布</span>
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
    font-size: 14pt;
    cursor: pointer;
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
import { computed, reactive, watch } from 'vue'
import { uploadImages, posting, postingPlan } from '@/api.js'
import { store } from '@/store.js'
import { VideoTwo, AddPicture, PreviewOpen, PreviewClose, AtSign, Time as mTime, GrinningFaceWithOpenMouth } from '@icon-park/vue-next'
import IconLoading from '@/components/icons/IconLoading.vue'
import EmojiPanel from '@/components/tailwind/menus/EmojiPanel.vue'
import { VueShowdown } from 'vue-showdown'
import VisibilityForPostEditorAction from '@/components/tailwind/menus/VisibilityForPostEditorAction.vue'
import DateTimePickerAction from '@/components/tailwind/menus/DateTimePickerAction.vue'
import ImagePickerAction from '@/components/tailwind/menus/ImagePickerAction.vue'
import { renderMath } from '../../katexConfig.js'
import { getDateTimeRange } from '@/utils/formatUtils.js'

const emits = defineEmits(['postingNew'])

const state = reactive({
    content: "",
    imgList: [],
    isLoading: false,
    result: "",
    showImagePanel: false,
    data: {
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
    showSchedulePanel: false
})

const hasImage = computed(() => {
    return state.imgList.length > 0
})

function resize() {
    const input = document.getElementById('post-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

async function submitPost() {
    try {
        if (state.content.length == 0) throw new Error("文字内容不能为空！")
        if (state.data.createdTime && Date.now() >= state.data.createdTime) throw new Error('您安排的预发布时间早于现在！')

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
        state.content = ""
        state.imgList = []

        emits('postingNew', { post: state.result })
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

function insertEmoji(name) {
    const emojiName = ` :${name[0]}: `
    state.content = state.content.concat(emojiName)
}

function pickVisibility(args) {
    state.data.status = args[0]
    state.showVisibilityPanel = false
}

function pickedTimeAndClose(args) {
    if (args && args.timestamps) {
        if (Date.now() >= args.timestamps) {
            store.setWarningMsg('您安排的预发布时间不能早于现在！')
            return
        }

        const time = new Date(args.timestamps)
        state.data.createdTime = args.timestamps
    } else {
        state.data.createdTime = null
    }
    state.showSchedulePanel = false
}

function dismissVisibilityForPostEditorAction(){
    state.showVisibilityPanel = false
}

function dismissEmojiPanel(){
    state.showEmojiPanel = false
}

watch(() => state.showMarkdownPanel, (newVal) => {
    if (newVal == true) {
        renderMath()
    }
})
</script>