<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="bg-background">
        <Header
            v-show="!state.isLoading"
            class="sm:hidden sticky"
            :title="state.headerConfig.title"
            :go-back="state.headerConfig.goBack"
            :show-menu="state.headerConfig.showMenu"
            :menu-icon="state.headerConfig.menuIcon"
            :icon-tooltip="state.headerConfig.iconTooltip"
            @handle-action="submitPost">
            <div class="flex font-bold gap-x-2 items-center justify-start w-full">
                <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                <div class="close-btn material-symbols-rounded text-[1.125rem]" @click="handleClose">close</div>
                <div>{{ state.showMarkdownPanel ? '预览' : '撰写帖子' }}</div>
            </div>
        </Header>
        <div
            v-if="state.data.createdTime && !state.isLoading"
            class="bg-primaryContainer dark:text-onHelper py-1 sm:hidden sticky text-[0.9rem] text-center text-primary-inActive top-[48px] z-[104]">
            该帖子定于{{ standardDateTime(state.data.createdTime) }}发布
        </div>
        <div
            id="post-editor-container"
            class="bg-inherit flex-col flex-nowrap max-sm:z-[103] relative sm:p-2">
            <div
                v-if="state.isLoading"
                class="-translate-x-1/2 absolute bg-white dark:bg-[#121212] h-full left-1/2 max-sm:fixed top-0 w-full z-[102]">
                <div class="dark:text-white/50 flex flex-col gap-2 h-full items-center justify-center text-[#6b7280]">
                    <IconLoading
                        class="-ml-1 h-6 mr-3 text-primary w-6"
                        :percent="state.uploadPercent">
                    </IconLoading>
                    <div class="text-[11pt]">
                        {{ state.commitText }}
                    </div>
                </div>
            </div>
            <VueShowdown
                v-if="state.showMarkdownPanel == true"
                tag="markdown"
                :extensions="['exts']"
                :markdown="state.content"
                class="max-sm:p-2 min-h-[6rem]">
            </VueShowdown>
            <!-- eslint-disable-next-line vue/html-self-closing -->
            <textarea
                v-else
                ref="postInput"
                v-model="state.content"
                class="bg-inherit break-all focus:outline-none leading-6 min-h-[5rem] overflow-hidden p-2 resize-none rounded text-[1rem] text-justify tracking-wide w-full"
                :maxlength="state.maxContentWordCount + 50"
                rows="3"
                placeholder="写点什么吧~"
                name="post"
                @input="resize">
                </textarea>
            <Transition name="fade">
                <ImagePickerAction
                    v-if="hasImage"
                    editor-menu-id="postEditorMenu"
                    class="mb-2 mx-2"
                    :img-list="state.imgList"
                    :images-info="state.imageListInfo"
                    @delete="handleDeleteImage"
                    @update="handleUpdateImage">
                </ImagePickerAction>
            </Transition>
            <Transition name="fade">
                <VideoPickerAction
                    v-if="hasVideo"
                    editor-menu-id="postEditorMenu"
                    class="mb-2 mx-2"
                    :video-list="state.videoList"
                    @delete="(index) => state.videoList.splice(index, 1)">
                </VideoPickerAction>
            </Transition>
            <EditorMenu
                id="postEditorMenu"
                class="bottom-0 left-0 max-sm:fixed max-sm:h-10 max-sm:pr-4 px-2 w-full z-10"
                :menu-set="state.menuSet"
                switch-from="post-editor"
                :visibility="state.data.status"
                :created-time="state.data.createdTime"
                :max-content-word-count="state.maxContentWordCount"
                :content-length="state.content.length"
                :img-list="state.imgList"
                :video-list="state.videoList"
                :show-markdown-panel="state.showMarkdownPanel"
                @insert-emoji="insertEmoji"
                @change-visibility="({visibility}) => {state.data.status = visibility}"
                @change-created-time="({createdTime}) => {state.data.createdTime = createdTime}"
                @submit="submitPost"
                @push-image="({images}) => {state.imgList.push(...images)}"
                @pop-image="() => {state.imgList.pop()}"
                @push-video="({videos}) => {state.videoList.push(...videos)}"
                @pop-video="() => {state.videoList.pop()}"
                @resize="resize"
                @preview="({isShow}) => {state.showMarkdownPanel = isShow}">
            </EditorMenu>
        </div>
    </div>
</template>

<!-- eslint-disable vue/max-lines-per-block -->
<script setup>
import { computed, reactive, inject, defineAsyncComponent, ref } from 'vue'
import { uploadImages, posting, postingPlan, getUploadPresignedUrl, uploadVideo } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { VueShowdown } from 'vue-showdown'
import EditorMenu from '@/indexApp/components/menus/EditorMenu.vue'
import { standardDateTime } from '@/indexApp/utils/formatUtils.js'
import Header from '@/indexApp/components/Header.vue'
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/ImagePickerAction.vue'))
const VideoPickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/VideoPickerAction.vue'))

const { postingNew } = inject('postingNew')
const postInput = ref()
const emits = defineEmits(['close'])
const state = reactive({
    headerConfig: {
        title: '',
        goBack: false,
        showMenu: true,
        menuIcon: 'done',
        iconTooltip: '提交'
    },
    menuSet: new Set(['ImagePicker','VideoPicker', 'DatetimePicker','PollAction','LongArticle', 'VisibilityAction', 'EmojiPanel', 'MarkdownPreview']),
    maxContentWordCount: 1000,
    content: "",
    imgList: new Array(),
    videoList: new Array(),
    imageListInfo: [
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" },
        { hidden: false, altText: null, contentType: "" }
    ],
    isLoading: false,
    uploadPercent: -1,
    commitText: undefined,
    result: "",
    data: {
        allowReview: true,
        content: "",
        isTop: false,
        images: undefined,
        videos: new Array(),
        type: "NORMAL",
        status: 'PUBLIC',
        createdTime: undefined,
        userId: JSON.parse(localStorage.getItem("CUR_USER")).id
    },
    showMarkdownPanel: false
})

function resize() {
    if(!CSS.supports('field-sizing: content')){
        postInput.value.style.height = 'auto'
        postInput.value.style.height = `${postInput.value.scrollHeight}px`
    }
}

async function submitPost() {
    try {
        if (state.content.length == 0) throw new Error("文字内容不能为空！")
        if (state.data.createdTime && Date.now() >= state.data.createdTime) throw new Error('您安排的预发布时间早于现在！')
        if (leftWordCount.value < 0) throw new Error('您发布的帖子内容超出长度限制！')

        state.isLoading = true
        state.data.content = state.content

        if (state.imgList.length > 0) {
            state.commitText = '图片上传中...'
            const response = await uploadImages(state.imgList, (e) => {
                if (e.lengthComputable) {
                    state.uploadPercent = e.loaded / e.total * 100
                }
            })
            if (!response.ok) throw new Error((await response.json()).message)
            state.data.images = await response.json()

            state.uploadPercent = -1
            for (let i = 0; i < state.data.images.length; i++) {
                state.data.images[i].hidden = state.imageListInfo[i].hidden
                state.data.images[i].altText = state.imageListInfo[i].altText
            }
        }

        if(state.videoList.length > 0){
            state.commitText = '视频上传中...'
            const file = state.videoList.at(0)
            const {name, type} = file
            let response = await getUploadPresignedUrl(type)
            if (!response.ok) throw new Error('视频上传失败！')
            const uploadUrl = await response.text()
            const videoId = RegExp(/.*&x-amz-meta-Id=(?<videoId>[0-9a-f\-]+)&/).exec(uploadUrl).groups['videoId']
            state.data.videos.push(videoId)

            response = await uploadVideo(file, uploadUrl, (e) => {
                if (e.lengthComputable) {
                    state.uploadPercent = e.loaded / e.total * 100
                } 
            })
            if (!response.ok) throw new Error((await response.json()).message)
            state.uploadPercent = -1
        }

        state.commitText = '帖子发布中...'
        const response = state.data.createdTime ? await postingPlan(state.data) : await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).message)
        state.result = await response.json()
        reset()
        postingNew(state.result)
        handleClose()
    } catch (err) {
        store.setErrorMsg(err.message)
    } finally {
        state.isLoading = false
        state.uploadPercent = -1
        state.commitText = undefined
    }
}

//防止重复提交上一次的内容
function reset() {
    state.content = ''
    state.imgList = new Array()
    state.showImagePanel = false
    state.data.allowReview = true
    state.data.content = ''
    state.data.isTop = false
    state.data.images = undefined
    state.data.createdTime = undefined
    state.data.status = 'PUBLIC'
    state.videoList = new Array()
    state.data.videos = new Array()
}

const hasImage = computed(() => {
    return state.imgList.length > 0
})

const hasVideo = computed(() => {
    return state.videoList.length > 0
})

const leftWordCount = computed(() => {
    return state.maxContentWordCount - state.content.length
})

function handleClose() {
    emits('close')
}

function insertEmoji({emoji}){
    const start = postInput.value.selectionStart
    state.content = state.content.slice(0, start).concat(emoji).concat(state.content.slice(start))
}

function handleDeleteImage(index){
    state.imgList.splice(index, 1)
    state.imageListInfo.at(index).altText = null
    state.imageListInfo.at(index).hidden = false
    state.imageListInfo.at(index).contentType = ''
}

function handleUpdateImage({ image, imageInfo, index }){
    state.imgList[index] = image.file
    state.imageListInfo[index] = imageInfo
}
</script>