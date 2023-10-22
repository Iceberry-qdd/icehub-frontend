<template>
    <div @click.self="dismiss"
        class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div class="flex flex-col flex-nowrap justify-between w-[40%] max-h-[60%] p-4 bg-white rounded-[8px] overflow-y-auto" :class="[state.showVisibilityPanel ? 'min-h-[38%]' : 'min-h-[28%]']">
            <div class="flex flex-row justify-between items-center">
                <div class="flex flex-row items-center gap-x-2">
                    <img :src="avatar" class="w-[2.5rem] h-[2.5rem] rounded-[8px]" />
                    <div class="flex flex-row gap-4 h-full justify-center items-center">
                        <span class="text-[13pt] font-bold cursor-default">{{ state.curUser.nickname }}</span>
                        <div @click="toggleVisibilityAction" class="relative flex flex-row gap-x-1 items-center text-[11pt] text-[#3b82f6] border-[#3b82f6] border-2 py-[0.1rem] px-3 rounded-full min-w-[4rem] cursor-pointer">
                            <span>{{ curVisibility.name }}</span>
                            <VisibilityForPostEditorAction
                                class="absolute top-[2rem] text-black z-[99] py-1"
                                :visibility="state.data.status"
                                v-if="state.showVisibilityPanel"
                                :ui="state.visibilityActions"
                                @picked-visibility="pickVisibility">
                            </VisibilityForPostEditorAction>
                            <span class="material-icons-round no-hover"> keyboard_arrow_down </span>
                        </div>
                    </div>
                </div>

                <div @click="reposting"
                    :class="[state.loading?'cursor-not-allowed bg-gray-400':'bg-blue-500 cursor-pointer']"
                    class="text-white px-5 py-1 rounded-full text-[11pt] font-bold">
                    <IconLoading v-if="state.loading" class="'h-5 w-5 text-white'"></IconLoading>
                    <span v-else>转发</span>
                </div>
            </div>
            <div class="pt-2 ml-[3rem] grow">
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
.material-icons-round {
    border-radius: 0;
    font-size: 14pt;
    padding: 0;
}

.material-icons-round:hover {
    background-color: transparent;
    font-size: 14pt;
    padding: 0;
    border-radius: 0;
}
</style>

<script setup>
import { reactive, onMounted, onUnmounted, computed, inject } from 'vue'
import RepostCard from '@/components/tailwind/RepostCard.vue'
import { posting } from '@/api.js'
import { store } from '@/store.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { ws, MsgPack } from '@/websocket.js'
import VisibilityForPostEditorAction from '@/components/tailwind/menus/VisibilityForPostEditorAction.vue'

const props = defineProps(['post'])
const emits = defineEmits(['dismiss', 'postingNew'])
const { postingNew } = inject('postingNew')

const state = reactive({
    loading: false,
    parentPost: props.post,
    data: {
        content: null,
        top: false,
        attachmentsUrl: [],
        type: 'REPOST',
        parentId: null,
        rootId: null,
        status:'PUBLIC'
    },
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    showVisibilityPanel: false,
    visibilityActions: [
        { id: 1, name: '公开', code: 'PUBLIC',icon:'public', picked: false },
        { id: 2, name: '公共时间线内隐藏', code: 'NOT_TIMELINE',icon:'vpn_lock', picked: false },
        { id: 3, name: '订阅者可见', code: 'ONLY_FOLLOWER', icon:'people_outline', picked: false },
        { id: 4, name: '互相订阅者可见', code: 'ONLY_CO_FOLLOWER', icon:'people', picked: false },
        { id: 6, name: '仅自己可见', code: 'ONLY_SELF', icon:'lock', picked: false },
    ]
})

function resize() {
    const input = document.getElementById('review-input')
    input.style.height = `${input.scrollHeight}px`
    //FIXME 当删除内容时无法自动调整大小
}

function dismiss(){
    emits('dismiss')
}

async function reposting() {
    if(state.loading==true){
        store.setWarningMsg('正在提交中，请勿重复提交')
        return
    }
    state.loading = true
    try {
        if(state.parentPost.plan) throw new Error('该帖子尚未发布，无法进行转发操作')
        state.data.parentId = state.parentPost.id
        state.data.rootId = state.parentPost.root ? state.parentPost.root.id : state.parentPost.id
        const response = await posting(state.data)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()

        //防止重复提交上一次的内容
        state.data.content = null
        store.setSuccessMsg('转发成功')
        // 发布通知
        const receiverId=state.parentPost.root==null ? state.parentPost.user.id : state.parentPost.root.user.id
        // ws.sendToOneQueue(new MsgPack(result.id, state.curUser.id, 'REPOST', receiverId),'interact')
        if(state.data.status.code !== 'PUBLIC'){
            postingNew(result)
        }
        dismiss()
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    } finally {
        state.loading = false
    }
}

const avatar = computed(() => {
    const defaultUrl = `https://api.multiavatar.com/${state.curUser.nickname}.svg`
    const { previewUrl, originUrl,contentType } = state.curUser.avatarUrl || [null, null,null]
    if(contentType && contentType.toLowerCase() == 'image/gif') return originUrl || defaultUrl
    return previewUrl || originUrl || defaultUrl
})

const curVisibility = computed(() => {
    const filteredActions = state.visibilityActions.filter(it => it.code == state.data.status)
    return filteredActions.length > 0 ? filteredActions[0] : state.visibilityActions[0]
})

function pickVisibility(args){
    state.data.status = args[0]
    for(let i = 0; i < state.visibilityActions.length; i++){
        const action = state.visibilityActions[i]
        action.picked = action.code === state.data.status
    }
    state.showVisibilityPanel = false
}

function toggleVisibilityAction(){
    const lastState = state.showVisibilityPanel
    state.showVisibilityPanel = !lastState
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style")
})
</script>