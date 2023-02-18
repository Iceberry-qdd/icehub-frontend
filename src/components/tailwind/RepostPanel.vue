<template>
    <div @click.self="dismiss"
        class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div class="w-[40%] min-h-[20%] max-h-[60%] p-4 bg-white rounded-[8px] overflow-y-auto">
            <div class="flex flex-row justify-between items-center">
                <div class="flex flex-row items-center gap-x-2">
                    <img :src="avatar" class="w-[2.5rem] h-[2.5rem] rounded-[8px]" />
                    <div class="flex flex-col h-full justify-center">
                        <!-- <span class="text-[10pt] text-gray-500">转发</span> -->
                        <span class="text-[13pt] font-bold cursor-default">{{ state.curUser.nickname }}</span>
                    </div>
                </div>

                <div @click="reposting"
                    class="bg-blue-500 cursor-pointer text-white px-4 py-1 rounded-full text-[11pt] font-bold">
                    <IconLoading v-if="state.loading" class="'h-5 w-5 text-white'"></IconLoading>
                    <span v-else>转发</span>
                </div>
            </div>
            <div class="pt-2 ml-[3rem]">
                <textarea v-model="state.data.content" @keydown="resize" :disabled="state.loading"
                    :class="{ 'text-gray-400': state.loading, 'cursor-not-allowed': state.loading }"
                    class="focus:outline-none overflow-y-hidden tracking-wide resize-none text-lg leading-6 text-justify min-w-full max-w-full min-h-fit bg-transparent"
                    maxlength="512" placeholder="写点什么吧~" id="review-input" name="review"></textarea>
            </div>
            <RepostCard v-if="state.parentPost" class="ml-[3rem] cursor-default pointer-events-none"
                :post="state.parentPost"></RepostCard>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'
import RepostCard from '@/components/tailwind/RepostCard.vue'
import { posting } from '@/api.js'
import { store } from '@/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'

const state = reactive({
    loading: false,
    parentPost: store.REPOST_POST,
    data: {
        "content": null,
        "top": false,
        "attachmentsUrl": [],
        "type": "REPOST",
        "parentId": null,
        "rootId": null
    },
    curUser: JSON.parse(localStorage.getItem("CUR_USER"))
})

function resize() {
    const input = document.getElementById('review-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

async function reposting() {
    state.loading = true
    try {
        state.data.parentId = state.parentPost.id
        state.data.rootId = state.parentPost.root ? state.parentPost.root.id : state.parentPost.id
        const response = await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()

        //防止重复提交上一次的内容
        state.data.content = null
        dismiss()
        store.setSuccessMsg('转发成功')
        // 发布完成后刷新页面
        setTimeout(() => { location.reload() }, 1500)
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

const avatar = computed(() => {
    const { previewUrl, originUrl } = state.curUser.avatarUrl || [null, null]
    const defaultUrl = `https://api.multiavatar.com/${state.curUser.nickname}.svg`
    return previewUrl || originUrl || defaultUrl
})

function dismiss() {
    store.clearRepost()
    document.querySelector("body").removeAttribute("style")
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    dismiss()
})
</script>