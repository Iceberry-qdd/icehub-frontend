<!-- eslint-disable vue/max-lines-per-block -->
<template>
    <div class="bg-white border-b">
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
            class="bg-blue-100 py-1 sm:hidden sticky text-[0.9rem] text-center text-zinc-500 top-[48px] z-[104]">
            该帖子定于{{ standardDateTime(state.data.createdTime) }}发布
        </div>
        <div
            id="post-editor-container"
            class="flex-col flex-nowrap max-sm:z-[103] relative sm:p-2">
            <div
                v-if="state.isLoading"
                class="-translate-x-1/2 absolute bg-white h-full left-1/2 max-sm:fixed top-0 w-full z-[102]">
                <div class="flex flex-col gap-2 h-full items-center justify-center">
                    <IconLoading class="-ml-1 h-6 mr-3 text-[#6b7280] w-6"></IconLoading>
                    <div class="text-[#6b7280] text-[11pt]">
                        帖子发布中...
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
                class="break-all focus:outline-none leading-6 min-h-[5rem] overflow-hidden p-2 resize-none rounded text-[1rem] text-justify tracking-wide w-full"
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
                    class="mb-2 ml-2"
                    :img-list="state.imgList"
                    :images-info="state.imageListInfo">
                </ImagePickerAction>
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
                :show-markdown-panel="state.showMarkdownPanel"
                @insert-emoji="({emoji}) => {state.content = state.content.concat(emoji)}"
                @change-visibility="({visibility}) => {state.data.status = visibility}"
                @change-created-time="({createdTime}) => {state.data.createdTime = createdTime}"
                @submit="submitPost"
                @push-image="({images}) => {state.imgList.push(...images)}"
                @pop-image="() => {state.imgList.pop()}"
                @resize="resize"
                @preview="({isShow}) => {state.showMarkdownPanel = isShow}">
            </EditorMenu>
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

<!-- eslint-disable vue/max-lines-per-block -->
<script setup>
import { computed, reactive, inject, defineAsyncComponent, ref } from 'vue'
import { uploadImages, posting, postingPlan } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { VueShowdown } from 'vue-showdown'
import EditorMenu from '@/indexApp/components/menus/EditorMenu.vue'
import { standardDateTime } from '@/indexApp/utils/formatUtils.js'
import Header from '@/indexApp/components/Header.vue'
const ImagePickerAction = defineAsyncComponent(() => import('@/indexApp/components/menus/postEditorMenus/ImagePickerAction.vue'))

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
    menuSet: new Set(['ImagePicker','DatetimePicker','PollAction','LongArticle', 'VisibilityAction', 'EmojiPanel', 'MarkdownPreview']),
    maxContentWordCount: 1000,
    content: "",
    imgList: new Array(),
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
    result: "",
    data: {
        allowReview: true,
        content: "",
        isTop: false,
        images: undefined,
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
            const response = await uploadImages(state.imgList)
            //if (!response.ok) throw new Error(response)
            state.data.images = JSON.parse(response)

            for (let i = 0; i < state.data.images.length; i++) {
                state.data.images[i].hidden = state.imageListInfo[i].hidden
                state.data.images[i].altText = state.imageListInfo[i].altText
            }
        }

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
}

const hasImage = computed(() => {
    return state.imgList.length > 0
})

const leftWordCount = computed(() => {
    return state.maxContentWordCount - state.content.length
})


function handleClose() {
    emits('close')
}
</script>