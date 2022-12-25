<template>
    <div class="flex flex-row gap-x-[1rem] py-[1rem] px-[1.5rem] border-b-[1px] border-gray-200">
        <div class="border-[1px] rounded-md h-fit"><img :src="avatar" class="h-[2.5rem] w-[2.5rem] max-w-none" />
        </div>
        <div class="w-full">
            <div v-if="state.content.length > 0" class="text-[11pt] mb-2"> 回复 <span
                    class="cursor-pointer  font-bold">@{{ replyTo }}</span>
            </div>
            <textarea v-model="state.content" @keydown="resize" :disabled="state.loading"
                :class="{ 'text-gray-400': state.loading }"
                class="focus:outline-none overflow-y-hidden tracking-wide resize-none text-lg leading-6 text-justify min-w-full max-w-full min-h-fit bg-transparent pr-2"
                maxlength="512" placeholder="发布评论" id="review-input" name="review"></textarea>
            <div class="flex flex-row justify-between mr-8 items-center" v-if="state.content.length > 0">
                <div class="flex flex-row gap-x-2 ">
                    <div><span class="material-icons-round text-[13pt]">collections</span></div>
                    <div><span class="material-icons-round text-[13pt]">location_on</span></div>
                </div>
                <div @click="submitReview"
                    class="text-sm py-2 px-6 rounded-full text-white bg-[#0d6efd] cursor-pointer">
                    <span v-if="!state.loading">发布</span>
                    <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive, computed } from 'vue';
import { reviewing } from '../../api';
import { store } from '../../store';

const props = defineProps(['post', 'parent'])

const state = reactive({
    content: '',
    loading: false
})

const replyTo = computed(() => {
    //console.log(props.post)
    try {
        if (props.parent) {
            //getParentReview(props.parent.id)
            return props.parent.user.nickname
        } else if (props.post) {
            return props.post.user.nickname
        } else {
            throw new Error('获取评论用户名失败！')
        }
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
})

async function submitReview() {
    state.loading = true
    try {
        if (state.content.trim() == '') throw new Error('评论内容为空！')
        if (!props.post && !props.parent) console.error('同时为空！')

        const data = {
            'content': state.content,
            'postId': props.post ? props.post.id : null,
            'parentId': props.parent ? props.parent.id : null
        }
        const response = await reviewing(data)
        if (!response.ok) throw new Error(await response.text())

        location.reload()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

const avatar = computed(() => {
    const avatar = (JSON.parse(localStorage.getItem("CUR_USER"))).avatarUrl
    const nickname = (JSON.parse(localStorage.getItem("CUR_USER"))).nickname

    try {
        if (!avatar || avatar == '') {
            return `https://api.multiavatar.com/${nickname}.svg`
        } else {
            return avatar
        }
    } catch (e) {
        return ''
    }
})

function resize() {
    const input = document.getElementById('review-input')
    //console.log(input.scrollHeight)
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

// async function getParentReview(parentId){
//     try{
//         const response = await getReviewById(parentId)
//         if (!response.ok) throw new Error(await response.text())

//         state.parentReview = await response.json()
//         //console.log(state.parentReview)
//     }catch(e){
//         store.setMsg(e.message)
//         console.error(e)
//     }
// }
</script>