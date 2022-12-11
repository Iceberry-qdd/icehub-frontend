<template>
    <div class="flex flex-row  py-4 pl-8 border-b-[1px] border-gray-200">
        <div class="border-[1px] rounded-md h-fit">
            <img src="https://api.multiavatar.com/User2.svg" width="40" height="40" />
        </div>
        <div class="w-full pl-2">
            <div class="text-[11pt] mt-[20px] mb-2"> 回复 <span class="cursor-pointer  font-bold">@{{ replyTo }}</span>
            </div>
            <textarea v-model="state.content"
                class="focus:outline-none tracking-wide text-lg leading-6 text-justify min-w-full max-w-full min-h-fit bg-transparent pr-2"
                maxlength="512" placeholder="发布评论" id="review" name="review"></textarea>
            <div class="flex flex-row justify-between mr-8 items-center" v-if="state.content.length > 0">
                <div class="flex flex-row gap-x-2">
                    <div>图片</div>
                    <div>定位</div>
                </div>
                <div @click="submitReview"
                    class="text-sm py-2 px-6 rounded-full text-white bg-[#0d6efd] cursor-pointer">
                    <span>发布</span>
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
    content: ''
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
    try {
        if (state.content.trim() == '') throw new Error('评论内容为空！')
        if(!props.post && !props.parent) console.error('同时为空！')

        const data = {
            'content': state.content,
            'postId': props.post?props.post.id:null,
            'parentId': props.parent?props.parent.id:null
        }
        const response = await reviewing(data)
        if (!response.ok) throw new Error(await response.text())

        location.reload()
    } catch (e) {
        store.setMsg(e.message)
        console.error(e)
    }
}

async function getParentReview(parentId){
    try{
        const response = await getReviewById(parentId)
        if (!response.ok) throw new Error(await response.text())

        state.parentReview = await response.json()
        //console.log(state.parentReview)
    }catch(e){
        store.setMsg(e.message)
        console.error(e)
    }
}
</script>