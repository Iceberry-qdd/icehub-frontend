<template>
    <div class="bg-white border-[1px] rounded-[8px]">
        <Banner
            :user="props.user"
            class="-mb-[calc(3.5rem+0.2rem)/2] h-[6rem] object-cover rounded-t-[8px] w-full">
        </Banner>
        <div class="flex flex-col gap-y-1 items-start justify-start pb-2 px-2 w-full">
            <div class="flex flex-row items-end justify-between w-full">
                <Avatar
                    :user="props.user"
                    class="border-[0.2rem] border-white box-content h-[3.5rem] object-cover rounded-[8px] text-[3.5rem] w-[3.5rem]">
                </Avatar>
                <div
                    v-if="!isSelf"
                    :class="followBtnClass"
                    class="btn-no-select flex flex-row items-center justify-center min-w-[4.5rem] px-3 py-1 rounded-full text-[0.85rem]"
                    @click.stop="state.yourFollowStatus !== 'UN_FOLLOW' ? doUnFollowUser() : doFollowUser()">
                    {{ followButtonText }}
                </div>
            </div>
            <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                <div class="font-bold hover:underline hover:underline-offset-4 text-[12pt]">
                    {{ state.user.nickname }}
                </div>
                <IconVerify
                    v-if="state.user.verified"
                    class="h-[0.9rem] text-blue-500 w-[0.9rem]">
                </IconVerify>
                <div
                    v-if="state.user.confirmFollow"
                    class="material-symbols-rounded no-hover p-0 text-[1.25rem]">
                    lock
                </div>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="break-all text-[0.85rem] webkit-box-1">{{ brief }}</div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import Avatar from '@/components/Avatar.vue'
import Banner from '@/indexApp/components/Banner.vue'
import { store } from '@/indexApp/js/store.js'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    user: props.user,
    loading: true,
    yourFollowStatus: props.user.yourFollowStatus,
    yourFanStatus: props.user.yourFanStatus,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    followTextMap: new Map([
        ['NOT_FOLLOW', '订阅'],
        ['WAIT_PASS', '等待批准'],
        ['FOLLOW', '已订阅'],
        [undefined, '订阅']
    ])
})

const isSelf = computed(() => state.curUser.id === props.user.id)

const followBtnClass = computed(() => ({
    'bg-blue-500': state.yourFollowStatus === 'NOT_FOLLOW',
    'bg-gray-200': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-zinc-500': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-white': state.yourFollowStatus === 'NOT_FOLLOW'
}))

const followButtonText = computed(() => {
    if(state.user.yourFollowStatus === 'FOLLOW' && state.yourFanStatus === 'FAN') return '相互订阅'
    if(state.user.yourFollowStatus === 'NOT_FOLLOW' && props.user.confirmFollow) return '请求订阅'
    return state.followTextMap.get(state.user.yourFollowStatus)
})

async function doFollowUser() {
    state.loading = true
    try {
        const response = await followUser(props.user.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result?.confirmed){
            store.setSuccessMsg("订阅成功！")
            state.yourFollowStatus = 'FOLLOW'
        } else {
            state.yourFollowStatus = 'WAIT_PASS'
        }
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}

async function doUnFollowUser() {
    state.loading = true
    try {
        const response = await unFollowUser(props.user.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        state.yourFollowStatus = 'NOT_FOLLOW'
        store.setSuccessMsg("取消订阅成功！")
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        state.loading = false
    }
}

const brief = computed(() => {
    const remark = state.user.remark
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
})
</script>