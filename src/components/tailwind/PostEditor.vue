<template>
    <div class="border-b">
        <div v-if="state.isLoading"
            class="flex flex-col justify-center items-center z-[102] absolute w-[38.46%] h-[12.1rem] bg-[#00000066]">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                </circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>
        <div class="bg-white pl-2 pr-2 pt-2 pb-2">
            <div>
                <textarea v-model="state.content" @keydown="resize"
                    class="p-2 focus:outline-none tracking-wide text-[14pt] leading-6 text-justify resize-none overflow-hidden rounded w-full"
                    maxlength="512" rows="3" placeholder="发布帖子" id="post-input" name="post"></textarea>
            </div>
            <div class="px-2 flex flex-row justify-between">
                <div class="text-base flex flex-row gap-x-4 items-center justify-start content-center">
                    <input v-show="false" @change="choosePics" type="file" id="imgFile" name="imgFile" multiple="true" accept="image/*" />
                    <!-- <span title="添加图片" @click="choosePics"
                        :class="[state.imgList.length > 0 ? 'text-[#0d6efd]' : 'text-black']"
                        class="material-icons-round">photo_library</span> -->
                    <add-picture @click="choosePics" theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <video-two theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <i class="cursor-pointer bi bi-markdown-fill" title="使用markdown格式"></i>
                    <source-code theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <preview-open theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <at-sign theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <m-time theme="outline" size="18" fill="#333" :strokeWidth="3"/>
                    <grinning-face-with-open-mouth theme="outline" size="18" fill="#333" :strokeWidth="3"/>
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
import { reactive } from 'vue';
import { uploadFiles, posting } from '../../api.js'
import { store } from '../../store.js'
import { VideoTwo,AddPicture,SourceCode,PreviewOpen,AtSign,Time as mTime,GrinningFaceWithOpenMouth } from '@icon-park/vue-next'

const state = reactive({
    content: "",
    imgList: [],
    imgUrls: [],
    isLoading: false,
    result: "",
    data: {
        "content": "",
        "top": false,
        "attachmentsUrl": []
    }
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
        if (!response.ok) throw new Error(await response.text())
        state.result = await response.json()

        //防止重复提交上一次的内容
        state.content = ""
        state.imgList = []

        // 发布完成后刷新页面
        location.reload()
    } catch (err) {
        store.setMsg(err.message)
        console.error(err)
    } finally {
        state.isLoading = false
    }
}

function choosePics() {
    const imgFileSelector = document.getElementById("imgFile")
    imgFileSelector.click()
    const imgs = imgFileSelector.files;

    if (imgs.length == 0) return
    state.imgList = imgFileSelector.files;
}
</script>