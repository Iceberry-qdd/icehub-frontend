<template>
    <div class="border-b">
        <div v-if="state.showImageEditPanel == true" id="imageEditPanel"
            class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
            <div class="w-[25%] h-fit bg-white rounded-[8px] overflow-y-auto">
                <div id="imgWrapper" class="relative flex flex-row justify-center items-center w-full">
                    <div v-if="state.data.imagesInfo[state.imageEditIndex].hidden == 'true'" class="absolute h-full w-full bg-white/5 backdrop-blur-xl"></div>
                    <img :src="loadImage(state.imgList[state.imageEditIndex])" class="max-w-full max-h-full object-cover" />
                    <div class="absolute bottom-0 right-0 flex flex-row gap-2 p-2">
                        <button v-if="state.data.imagesInfo[state.imageEditIndex].hidden == 'false'" title="标记为敏感内容">
                            <IconFlagOn @click="toggleHiddenFlag" class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[15pt] rounded-full cursor-pointer"></IconFlagOn>
                        </button>
                        <button v-else title="标记为敏感内容">
                            <IconFlagOff @click="toggleHiddenFlag" class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[15pt] rounded-full cursor-pointer"></IconFlagOff>
                        </button>
                        <button v-if="state.showAltEditor[state.imageEditIndex] == true" title="添加描述文字">
                            <IconAltOn @click="toggleAltFlag" class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[11pt] rounded-full cursor-pointer"></IconAltOn>
                        </button>
                        <button v-else title="添加描述文字">
                            <IconAltOff @click="toggleAltFlag" class="w-[1.2rem] h-[1.2rem] text-white bg-[#000000BB] p-[0.3rem] box-content text-[11pt] rounded-full cursor-pointer"></IconAltOff>
                        </button>
                    </div>
                </div>

                <textarea v-if="state.showAltEditor[state.imageEditIndex] == true"
                    v-model="state.data.imagesInfo[state.imageEditIndex].altText" @keydown="resize"
                    class="p-3 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                    maxlength="512" rows="2" placeholder="简述此图片的内容" id="post-input" name="post"></textarea>
                <div @click="dismissImageEditPanel" class="cursor-pointer bg-blue-500 w-fit text-[11pt] mt-3 mb-3 mr-0 ml-3 text-white font-bold px-4 py-1 rounded-full">确定</div>
            </div>
        </div>


        <div class=" relative bg-white pl-2 pr-2 pt-2 pb-2">
            <div v-if="state.isLoading" class="absolute left-1/2 -translate-x-1/2 z-[102] top-0 w-full h-full bg-white">
                <div class="flex flex-col justify-center items-center gap-2 h-full">
                    <IconLoading class="-ml-1 mr-3 h-6 w-6 text-[#6b7280]"></IconLoading>
                    <div class="text-[11pt] text-[#6b7280]">帖子发布中...</div>
                </div>
            </div>
            <div>
                <VueShowdown v-if="state.showMarkdown==true" :markdown="state.content" class="min-h-[6rem]"></VueShowdown>
                <textarea v-else v-model="state.content" @keydown="resize"
                    class="p-2 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                    maxlength="25000" rows="3" placeholder="发布帖子" id="post-input" name="post"></textarea>
            </div>
            <div class="px-2 flex flex-row justify-between">
                <div class="text-base flex flex-row gap-x-4 items-center justify-start content-center">
                    <input v-show="false" type="file" id="imgFile" @change="clickFileSelector" name="imgFile"
                        multiple="true" accept="image/*" />
                    <div class="relative flex-col">
                        <div class="flex" @click="preChoosePics">
                            <add-picture v-tooltip="'添加图片'" theme="outline" size="18" fill="#333" :strokeWidth="3" :class="[hasImage ? 'bg-blue-200' : '']" />
                        </div>
                        <Transition name="fade">
                            <div v-if="state.showImagePanel == true" id="imagePanel"
                            class="z-[99] absolute top-[2.5rem] min-w-max min-h-max bg-white rounded-[6px] p-3 shadow-md ring-1 ring-gray-200">
                                <div class="grid grid-cols-3 grid-rows-1 gap-2">
                                    <div class="relative" v-for="(item, key) in state.imgList" :key="key" :index="key">
                                        <div v-if="state.data.imagesInfo[key].hidden == 'true'"
                                            class="absolute h-full w-full rounded-[8px] bg-white/5 backdrop-blur-xl"></div>
                                        <img class="max-w-[5rem] min-w-[5rem] h-[5rem] rounded-[8px] cursor-default object-cover"
                                            :src="loadImage(item)" />
                                        <div
                                            class="absolute w-full h-full rounded-[8px] top-0 left-0 bg-transparent cursor-pointer">
                                            <div @click="editImage(key)"
                                                class="flex h-full w-full justify-center items-center rounded-[8px] hover:bg-[#00000066] hover:text-white text-transparent">
                                                <IconMagic class="text-[16pt]" />
                                            </div>
                                        </div>

                                        <div @click="deleteImg(item, key)"
                                            class="absolute w-[1.25rem] h-[1.25rem] top-0 right-0 rounded-tr-[8px] rounded-[4px] bg-[#000000BB] cursor-pointer">
                                            <div class="flex w-full h-full justify-center items-center">
                                                <IconError class="text-gray-300 text-[10pt]"></IconError>
                                            </div>
                                        </div>
                                    </div>
                                    <div @click="choosePics" v-if="state.imgList.length < 9"
                                        class="flex justify-center items-center max-w-[5rem] min-w-[5rem] h-[5rem] hover:bg-zinc-200 rounded-[8px] cursor-pointer active:bg-zinc-300">
                                        <IconAdd class="text-gray-500"></IconAdd>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                    <video-two v-tooltip="'添加视频'" theme="outline" size="18" fill="#333" :strokeWidth="3" v-if="!hasImage" />
                    <!-- <i class="cursor-pointer bi bi-markdown-fill" title="使用markdown格式"></i> -->
                    <div class="relative flex-col">
                        <div class="flex" @click="state.showVisibilityPanel = !state.showVisibilityPanel">
                            <preview-open v-tooltip="'帖子可见范围'" v-if="state.data.status == 'PUBLIC'" theme="outline" size="18" fill="#333"
                                :strokeWidth="3" />
                            <preview-close v-tooltip="'帖子可见范围'" v-else theme="outline" size="18" fill="#333" :strokeWidth="3"
                                class="bg-blue-200" />
                        </div>
                        <Transition name="fade">
                            <div v-if="state.showVisibilityPanel == true"
                            class="z-[99] absolute top-[2.5rem] min-w-max min-h-max bg-white rounded-[6px] shadow-md ring-1 ring-gray-200">
                                <div @click="{ state.data.status = action.code; state.showVisibilityPanel = false }"
                                    class="flex flex-row justify-left items-center gap-x-2 hover:bg-gray-100 active:bg-gray-200 pl-4 pr-5 py-[0.65rem] cursor-pointer"
                                    v-for="action in state.visibilityActions" :key="action.id" :index="action.id">
                                    <IconDone v-if="state.data.status == action.code"></IconDone>
                                    <IconDone v-else class="text-transparent"></IconDone>
                                    <div>{{ action.name }}</div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                    <!-- <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3" /> -->
                    <m-time v-tooltip="'定时发送'" theme="outline" size="18" fill="#333" :strokeWidth="3" />
                    <div class="relative flex-col">
                        <div class="flex" @click="state.showEmojiPanel=!state.showEmojiPanel">
                            <grinning-face-with-open-mouth v-tooltip="'表情面板'" theme="outline" size="18" fill="#333" :strokeWidth="3" />
                        </div>
                        <Transition name="fade">
                            <EmojiPanel v-if="state.showEmojiPanel" @emojiName="insertEmoji" class="z-[99] absolute top-[2.5rem] min-w-max min-h-max"></EmojiPanel>
                        </Transition>
                    </div>

                    <!-- <i class="cursor-pointer bi bi-camera-video-fill" title="添加视频"></i> -->
                    <button @click="state.showMarkdown=!state.showMarkdown">
                        <i class="cursor-pointer bi bi-markdown-fill" title="预览markdown"></i>
                    </button>

                    <!-- <i class="cursor-pointer bi bi-code-slash" title="添加代码片段"></i>
                    <i class="cursor-pointer bi bi-arrow-up-square-fill" title="在个人主页置顶"></i>
                    <i class="cursor-pointer bi bi-emoji-smile" title="添加表情"></i> -->
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

.fade-enter-active{
    transition: opacity 0.15s ease-in-out;
}

.fade-leave-active{
    transition: opacity 0.15s ease-in-out;
}

.fade-enter-from{
    opacity: 0;
}

.fade-leave-to{
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
import { uploadImages, posting } from '@/api.js'
import { store } from '@/store.js'
import { VideoTwo, AddPicture, PreviewOpen, PreviewClose, AtSign, Time as mTime, GrinningFaceWithOpenMouth } from '@icon-park/vue-next'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconError from '@/components/icons/IconError.vue'
import IconDone from '@/components/icons/IconDone.vue'
import IconMagic from '@/components/icons/IconMagic.vue'
import IconAltOn from '@/components/icons/IconAltOn.vue'
import IconAltOff from '@/components/icons/IconAltOff.vue'
import IconFlagOn from '@/components/icons/IconFlagOn.vue'
import IconFlagOff from '@/components/icons/IconFlagOff.vue'
import EmojiPanel from '@/components/menus/EmojiPanel.vue'
import { VueShowdown } from 'vue-showdown'

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
        scheduledPostingTime: null,
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
        ]
    },
    visibilityActions: [
        { id: 1, name: '公开', code: 'PUBLIC' },
        { id: 2, name: '公共时间线内隐藏', code: 'NOT_TIMELINE' },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER' },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER' },
        // { id: 5, name: '指定用户可见', code: 'ONLY_SPECIFIED' },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF' },
    ],
    showVisibilityPanel: false,
    showImageEditPanel: false,
    imageEditIndex: 0,
    showEmojiPanel:false,
    showAltEditor: [false, false, false, false, false, false, false, false, false],
    showMarkdown:false
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

        state.isLoading = true
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

        const response = await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)
        state.result = await response.json()

        //防止重复提交上一次的内容
        state.content = ""
        state.imgList = []

        // 发布完成后刷新页面
        location.reload()
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

function loadImage(file) {
    let URL = window.URL || window.webkitURL
    let imgUrl = URL.createObjectURL(file)
    return imgUrl
}

function deleteImg(item) {
    state.imgList.splice(state.imgList.indexOf(item), 1)
}

function editImage(imageIndex) {
    state.showImageEditPanel = true
    state.imageEditIndex = imageIndex
}

function toggleHiddenFlag() {
    const index = state.imageEditIndex
    const lastState = state.data.imagesInfo[index].hidden
    state.data.imagesInfo[index].hidden = lastState == 'false' ? 'true' : 'false'
}

function toggleAltFlag() {
    const index = state.imageEditIndex
    const lastState = state.showAltEditor[index]
    state.showAltEditor[index] = !lastState
}

watch(() => state.showImageEditPanel, (newVal, oldVal) => {
    if (newVal == true) {
        document.querySelector("body").setAttribute("style", "overflow:hidden")
    } else {
        document.querySelector("body").removeAttribute("style")
    }
})

function dismissImageEditPanel() {
    state.showImageEditPanel = false
    const index = state.imageEditIndex
    if (state.showAltEditor[index] == false) { state.data.imagesInfo[index].altText = '' }
}

function insertEmoji(name){
    const emojiName=` :${name[0]}: `
    // console.log(emojiName)
    state.content=state.content.concat(emojiName)
    state.showEmojiPanel=false
}

</script>