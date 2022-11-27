<template>
    <div>
        <div v-if="isLoading"
            class="flex flex-col justify-center items-center z-[102] absolute w-full h-[12rem] bg-[#00000066] rounded">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                </circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </div>
        <div class="bg-white rounded-md pl-2 pr-2 pt-2 pb-2">
            <div>
                <textarea v-model="content"
                    class="p-2 focus:outline-none tracking-wide text-sm leading-6 text-justify resize-none rounded w-full"
                    maxlength="512" rows="5" placeholder="发布帖子" id="post" name="post"></textarea>
            </div>
            <div class="px-2 flex flex-row justify-between">
                <div class="text-base flex flex-row gap-x-4 items-center justify-start content-center">
                    <input v-show="false" @change="choosePics" type="file" id="imgFile" name="imgFile" multiple="true"
                        accept="image/*" />
                    <i @click="choosePics" :class="[imgList.length > 0 ? 'text-[#0d6efd]' : 'text-black']"
                        class=" cursor-pointer bi bi-images" title="添加照片"></i>
                    <i class="cursor-pointer bi bi-camera-video-fill" title="添加视频"></i>
                    <i class="cursor-pointer bi bi-markdown-fill" title="使用markdown格式"></i>
                    <i class="cursor-pointer bi bi-code-slash" title="添加代码片段"></i>
                    <i class="cursor-pointer bi bi-eye-fill" title="公开"></i>
                    <i class="cursor-pointer bi bi-eye-slash-fill" title="隐藏"></i>
                    <i class="cursor-pointer bi bi-at text-xl" title="提及某人"></i>
                    <i class="cursor-pointer bi bi-clock-history" title="定时删除"></i>
                    <i class="cursor-pointer bi bi-arrow-up-square-fill" title="在个人主页置顶"></i>
                    <i class="cursor-pointer bi bi-emoji-smile" title="添加表情"></i>
                </div>
                <div @click="submitPost"
                    :class='[content.length > 0 ? "bg-[#0d6efd] cursor-pointer" : "bg-gray-400 cursor-not-allowed"]'
                    class="text-sm py-2 px-6 rounded-full text-white">
                    <span>发布</span>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>

<script>
import { uploadFiles, posting } from '../../api.js'
import { store } from '../../store.js'

export default {
    data() {
        return {
            store,
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
        }
    },
    methods: {
        async submitPost() {
            const imgFileSelector = document.getElementById("imgFile")
            this.imgList = imgFileSelector.files;

            try {
                if (this.content.length == 0) throw new Error("文字内容不能为空！")

                this.isLoading = true
                this.data.content = this.content

                if (this.imgList.length > 0) {
                    const response = await uploadFiles(this.imgList)
                    //if (!response.ok) throw new Error(response)
                    this.data.attachmentsUrl = JSON.parse(response)
                }

                const response = await posting(this.data)
                if (!response.ok) throw new Error(await response.text())
                this.result = await response.json()

                //防止重复提交上一次的内容
                this.content = ""
                this.imgList = []

                // 发布完成后刷新页面
                location.reload()
            } catch (err) {
                this.store.setMsg(err.message)
                console.error(err)
            } finally {
                this.isLoading = false
            }

        },

        choosePics() {
            const imgFileSelector = document.getElementById("imgFile")
            imgFileSelector.click()
            const imgs = imgFileSelector.files;

            if (imgs.length == 0) return
            this.imgList = imgFileSelector.files;
        }
    },
    computed: {
    },
    watch: {

    }
}
</script>