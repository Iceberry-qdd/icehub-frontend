<template>
    <div
        :class="itemClass"
        class="border-b-[1px] flex flex-nowrap flex-row gap-x-3 items-start p-2">
        <Avatar
            :user="props.user"
            class="flex-none h-[3rem] object-cover rounded-[8px] text-[3rem] w-[3rem]"
            @click="routeToUserProfile">
        </Avatar>
        <div class="flex-1">
            <div class="cursor-pointer flex flex-row gap-x-1 items-center justify-start">
                <div
                    class="font-bold hover:underline hover:underline-offset-4 text-[14pt] webkit-box-1"
                    @click="routeToUserProfile">
                    {{ props.user.nickname }}
                </div>
                <IconVerify
                    v-if="props.user.verified"
                    class="h-[0.9rem] text-blue-500 w-[0.9rem]">
                </IconVerify>
                <div
                    v-if="props.user.confirmFollow"
                    class="material-symbols-rounded no-hover p-0 text-[1rem]">
                    lock
                </div>
                <div
                    v-if="state.yourFanStatus === 'FAN' && state.yourFollowStatus !== 'FOLLOW'"
                    class="bg-blue-100 cursor-default px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                    订阅了你
                </div>
                <div
                    v-if="state.yourFanStatus === 'WAIT_PASS'"
                    class="bg-blue-100 cursor-default px-2 rounded-[4px] shrink-0 text-[0.85rem] text-blue-500">
                    请求订阅你
                </div>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="font-light text-[0.9rem] webkit-box-2">{{ brief(props.user.remark) }}</div>
        </div>
        <div
            v-if="!isSelf && state.yourFanStatus === 'WAIT_PASS' && !store.MOBILE_MODE"
            :class="yourFanButtonClass"
            class="cursor-pointer flex flex-none flex-nowrap font-bold items-center justify-center place-self-center px-[1rem] py-[0.4rem] rounded-full text-[11pt] text-white w-[6rem]"
            @click="passFanRequest">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div v-if="!state.loading"> {{ yourFanButtonText }} </div>
            <IconLoading
                v-else
                :class="yourFanLoadingIconClass"
                class="h-5 w-5">
            </IconLoading>
        </div>
        <div
            v-if="!isSelf"
            :class="yourFollowButtonClass"
            class="cursor-pointer flex flex-none flex-nowrap font-bold items-center justify-center place-self-center px-[1rem] py-[0.4rem] rounded-full text-[11pt] text-white w-[6rem]"
            @click="toggleFollowState">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div v-if="!state.loading"> {{ yourFollowButtonText }} </div>
            <IconLoading
                v-else
                :class="yourFollowLoadingIconClass"
                class="h-5 w-5">
            </IconLoading>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { followUser, unFollowUser } from '@/indexApp/js/api.js'
import IconLoading from '@/components/icons/IconLoading.vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { store } from '@/indexApp/js/store.js'
import IconVerify from '@/components/icons/IconVerify.vue'

const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})
const router = useRouter()
// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    loading: false,
    yourFollowStatus: props.user.yourFollowStatus,
    yourFanStatus: props.user.yourFanStatus,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    followTextMap: new Map([
        ['NOT_FOLLOW', '订阅'],
        ['WAIT_PASS', '等待批准'],
        ['FOLLOW', '已订阅'],
        [undefined, '订阅']
    ]),
    fanTextMap: new Map([
        ['WAIT_PASS', '允许订阅'],
        [undefined, '']
    ])
})

const yourFollowButtonClass = computed(() => ({
    'bg-blue-500': state.yourFollowStatus === 'NOT_FOLLOW',
    'bg-gray-200': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-zinc-500': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-white': state.yourFollowStatus === 'NOT_FOLLOW'
}))


const yourFollowButtonText = computed(() => {
    if (state.yourFollowStatus === 'FOLLOW' && state.yourFanStatus === 'FAN') return '相互订阅'
    if(state.yourFollowStatus === 'NOT_FOLLOW' && props.user.confirmFollow) return '请求订阅'
    return state.followTextMap.get(state.yourFollowStatus)
})

const yourFollowLoadingIconClass = computed(() => ({
    'text-zinc-500': state.yourFollowStatus !== 'NOT_FOLLOW',
    'text-white': state.yourFollowStatus === 'NOT_FOLLOW'
}))

const yourFanButtonClass = computed(() => ({
    'bg-blue-500': state.yourFanStatus === 'WAIT_PASS',
    'bg-gray-200': state.yourFanStatus !== 'WAIT_PASS',
    'text-zinc-500': state.yourFanStatus !== 'WAIT_PASS',
    'text-white': state.yourFanStatus === 'WAIT_PASS'
}))


const yourFanButtonText = computed(() => {
    return state.fanTextMap.get(state.yourFanStatus)
})

const yourFanLoadingIconClass = computed(() => ({
    'text-zinc-500': state.yourFollowStatus === 'WAIT_PASS',
    'text-white': state.yourFollowStatus !== 'WAIT_PASS'
}))

const itemClass = computed(() => ({
    'justify-between': !isSelf.value,
    'justify-start': isSelf.value
}))

const isSelf = computed(() => state.curUser.id === props.user.id)

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: props.user.nickname } })
}

function brief(remark) {
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
}

function toggleFollowState() {
    state.yourFollowStatus ? unFollowAUser() : followAUser()
}

async function followAUser() {
    const { id } = props.user
    state.loading = true
    try {
        const response = await followUser(id)
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

async function unFollowAUser() {
    const { id } = props.user
    state.loading = true
    try {
        const response = await unFollowUser(id)
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

function passFanRequest(){
    state.yourFanStatus = 'FAN'
}
</script>