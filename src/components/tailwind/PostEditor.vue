<template>
    <div class="border-b">
        <div v-if="state.isLoading"
            class="flex flex-col justify-center items-center z-[102] fixed w-[38.46%] h-screen bg-[#00000066]">
            <IconLoading class="'-ml-1 mr-3 h-5 w-5 text-white'"></IconLoading>
        </div>
        <div class="bg-white pl-2 pr-2 pt-2 pb-2">
            <div>
                <textarea v-model="state.content" @keydown="resize"
                    class="p-2 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                    maxlength="512" rows="3" placeholder="发布帖子" id="post-input" name="post"></textarea>
            </div>
            <div class="px-2 flex flex-row justify-between">
                <div class="text-base flex flex-row gap-x-4 items-center justify-start content-center">
                    <input v-show="false" type="file" id="imgFile" @change="clickFileSelector" name="imgFile"
                        multiple="true" accept="image/*" />
                    <div class="relative flex-col">
                        <div class="flex" @click="preChoosePics">
                            <add-picture theme="outline" size="18" fill="#333" :strokeWidth="3"
                                :class="[hasImage ? 'bg-blue-200' : '']" />
                        </div>
                        <div v-if="state.showImagePanel == true" id="imagePanel"
                            class="z-[99] absolute top-[2.5rem] min-w-max min-h-max bg-white rounded-[6px] p-3 shadow-md ring-1 ring-gray-200">
                            <div class="grid grid-cols-3 grid-rows-1 gap-2">
                                <div class="relative" v-for="(item, key) in state.imgList" :key="key" :index="key">
                                    <img class="max-w-[5rem] min-w-[5rem] h-[5rem] rounded-[8px] cursor-default object-cover"
                                        :src="loadImage(item)" />
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
                    </div>
                    <video-two theme="outline" size="18" fill="#333" :strokeWidth="3" v-if="!hasImage" />
                    <i class="cursor-pointer bi bi-markdown-fill" title="使用markdown格式"></i>
                    <!-- <source-code theme="outline" size="18" fill="#333" :strokeWidth="3" /> -->
                    <preview-open theme="outline" size="18" fill="#333" :strokeWidth="3" />
                    <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3" />
                    <m-time theme="outline" size="18" fill="#333" :strokeWidth="3" />
                    <grinning-face-with-open-mouth theme="outline" size="18" fill="#333" :strokeWidth="3" />
                    <!-- <i class="cursor-pointer bi bi-camera-video-fill" title="添加视频"></i>
                    <i class="cursor-pointer bi bi-markdown-fill" title="使用markdown格式"></i>
                    <i class="cursor-pointer bi bi-code-slash" title="添加代码片段"></i>
                    <i class="cursor-pointer bi bi-eye-fill" title="公开"></i>
                    <i class="cursor-pointer bi bi-eye-slash-fill" title="隐藏"></i>
                    <i class="cursor-pointer bi bi-at text-xl" title="提及某人"></i>
                    <i class="cursor-pointer bi bi-clock-history" title="定时删除"></i>
                    <i class="cursor-pointer bi bi-arrow-up-square-fill" title="在个人主页置顶"></i>
                    <i class="cursor-pointer bi bi-emoji-smile" title="添加表情"></i> -->
                </div>
                <div @click="submitPost"
                    :class='[state.content.length > 0 ? "bg-[#0d6efd] cursor-pointer" : "bg-gray-400 cursor-not-allowed"]'
                    class="text-sm py-2 px-6 rounded-full text-white">
                    <span>发布</span>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
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
import { computed, reactive } from 'vue';
import { uploadFiles, posting } from '@/api.js'
import { store } from '@/store.js'
import { VideoTwo, AddPicture, PreviewOpen, AtSign, Time as mTime, GrinningFaceWithOpenMouth } from '@icon-park/vue-next'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconError from '@/components/icons/IconError.vue'

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
        type: "NORMAL"
    }
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
    const imgFileSelector = document.getElementById("imgFile")
    state.imgList = imgFileSelector.files;

    try {
        if (state.content.length == 0) throw new Error("文字内容不能为空！")

        state.isLoading = true
        state.data.content = state.content

        if (state.imgList.length > 0) {
            const response = await uploadFiles(state.imgList)
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

</script>