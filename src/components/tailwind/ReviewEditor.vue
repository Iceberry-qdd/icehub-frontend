<template>
    <div class="flex relative flex-row gap-x-[1rem] py-[1rem] px-[1.5rem]"
        :class="[props.fromReviewPanel?'':'border-gray-100 border-b-[1px]']">
        <div v-if="props.tieLocation == 'mid'" class="timeline-mid absolute w-[0.15rem] h-full top-0 left-[2.7rem] bg-gray-200 z-0"></div>
        <div v-if="props.tieLocation == 'top'" class="timeline-top absolute w-[0.15rem] top-[2.5rem] left-[2.7rem] bg-gray-200 z-0"></div>
        <div v-if="props.tieLocation == 'bottom'" class="timeline-bottom absolute w-[0.15rem] h-[2.5rem] top-0 left-[2.7rem] bg-gray-200 -z-0"></div>
        <div class="h-fit z-10"><img :src="avatar" class="rounded-[6px] h-[2.5rem] w-[2.5rem] max-w-none cursor-default" /></div>
        <div class="w-full">
            <div v-if="state.content.length > 0" class="text-[11pt] mb-2">
                回复 <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
            </div>
            <textarea v-model="state.content" @keydown="resize" :disabled="state.loading"
                :class="{ 'text-gray-400': state.loading }"
                class="focus:outline-none overflow-y-hidden tracking-wide resize-none text-lg leading-6 text-justify min-w-full max-w-full min-h-fit bg-transparent pr-2"
                maxlength="512" placeholder="发布评论" id="review-input" name="review"></textarea>
            <div class="flex flex-row justify-between items-center" v-if="state.content.length > 0">
                <div class="flex flex-row gap-x-2 items-center" v-if="!state.loading">
                    <add-picture theme="outline" size="20" fill="#333" :strokeWidth="3" />
                    <local-two theme="outline" size="20" class="icon" fill="#333" :strokeWidth="4" />
                    <div class="relative flex-col">
                        <div class="flex" @click="state.showEmojiPanel=!state.showEmojiPanel">
                            <grinning-face-with-open-mouth v-tooltip="'表情面板'" theme="outline" size="18" fill="#333" :strokeWidth="3" />
                        </div>
                        <Transition name="fade">
                            <EmojiPanel v-if="state.showEmojiPanel" @emojiName="insertEmoji" class="z-[99] absolute top-[2.5rem] min-w-max min-h-max"></EmojiPanel>
                        </Transition>
                    </div>
                </div>
                <div class="flex flex-row gap-x-2 items-center" v-else></div>
                <div @click="submitReview"
                    :class="[state.loading ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer bg-[#0d6efd]']"
                    class="text-sm py-[0.4rem] px-6 rounded-full text-white">
                    <span v-if="!state.loading">发布</span>
                    <IconLoading v-else class="'h-5 w-5 text-white'"></IconLoading>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { reactive, computed } from 'vue'
import { reviewing } from '@/api'
import { store } from '@/store'
import { AddPicture, LocalTwo,GrinningFaceWithOpenMouth } from '@icon-park/vue-next'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/websocket.js'
import EmojiPanel from '@/components/tailwind/menus/EmojiPanel.vue'

const props = defineProps(['post', 'parent','tieLocation','fromReviewPanel'])

const state = reactive({
    content: '',
    loading: false,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showEmojiPanel:false
})

const replyTo = computed(() => {
    try {
        if (props.parent) {
            return props.parent.user.nickname
        } else if (props.post) {
            return props.post.user.nickname
        } else {
            throw new Error('获取评论用户名失败！')
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }
})

async function submitReview() {
    if (state.loading == true) {
        store.setWarningMsg('正在提交中，请勿重复提交')
        return
    }
    state.loading = true
    try {
        if (state.content.trim() == '') throw new Error('评论内容不能为空！')
        if (!props.post && !props.parent) throw new Error('该评论没有依赖的父级内容，非法评论！')

        const data = {
            'content': state.content,
            'postId': props.post ? props.post.id : props.parent.postId,
            'parentId': props.parent ? props.parent.id : null
        }
        const response = await reviewing(data)
        if (!response.ok) throw new Error((await response.json()).error)
        const result = await response.json()

        const reviewId = result.id
        const receiverId = data.parentId == null ? props.post.user.id : props.parent.user.id
        // ws.sendToOneQueue(new MsgPack(reviewId, state.curUser.id, 'REVIEW', receiverId), 'interact')

        location.reload()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${state.curUser.nickname}.svg`
    const { previewUrl, originUrl, contentType } = state.curUser.avatarUrl || [null, null, null]
    if (contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

function resize() {
    const input = document.getElementById('review-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

function insertEmoji(name){
    const emojiName=` :${name[0]}: `
    state.content=state.content.concat(emojiName)
    state.showEmojiPanel=false
}
</script>