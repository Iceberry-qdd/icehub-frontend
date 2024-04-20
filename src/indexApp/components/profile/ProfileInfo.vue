<template>
    <div>
        <Avatar
            :user="props.user"
            class="border-[4px] border-white h-[5rem] rounded-lg text-[5rem] translate-x-[1rem] w-[5rem]"
            @click="props.user?.avatar?.url ? showSlide([props.user.avatar], 0) : ''">
        </Avatar>
        <div class="flex flex-col gap-y-1 px-[1rem]">
            <div class="flex flex-nowrap flex-row justify-between">
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="font-bold max-w-[20rem] text-[18pt] w-fit">{{ props.user.nickname }}</div>
                <div
                    v-if="!isMyself && !props.user.blocking && !props.user.blocked"
                    class="bg-blue-500 cursor-pointer font-bold px-5 py-[0.325rem] rounded-full text-white"
                    :class="followButtonClass"
                    @click="toggleFollowState">
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div v-if="!state.loading">{{ followButtonText }}</div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                </div>
                <div
                    v-else-if="props.user.blocking && !isMyself"
                    class="bg-red-200 cursor-pointer font-bold px-5 py-[0.325rem] rounded-full text-white"
                    @click="state.confirmBDialogUi.show = true">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div v-if="!state.loading" class="text-red-500"> 解除屏蔽 </div>
                    <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                    <IconLoading v-else class="'h-5 text-white' w-5"></IconLoading>
                    <Teleport to="#app">
                        <ConfirmDialogBox
                            v-if="state.confirmBDialogUi.show"
                            :ui="state.confirmBDialogUi"
                            @choice="choose">
                        </ConfirmDialogBox>
                    </Teleport>
                </div>
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="">{{ props.user.remark }}</div>
            <div class="flex flex-row gap-x-2 items-center">
                <IconCalendar class="text-[14pt]"></IconCalendar>
                <div>{{ formattedDate }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.verified == true" class="flex flex-row gap-x-2 items-center">
                <IconVerify class="h-[1rem] text-blue-500 w-[1rem]"></IconVerify>
                <div>{{ props.user.verifiedInfo }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.city" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconLocation class="text-[14pt]" title="所在城市"></IconLocation>
                <div>{{ props.user.city }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.email" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconEmail class="text-[12pt]" title="电子邮箱"></IconEmail>
                <div>{{ props.user.email }}</div>
            </div>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-if="props.user.website" class="flex flex-row gap-x-2 items-center">
                <!-- eslint-disable-next-line vue/max-attributes-per-line -->
                <IconWebsite class="text-[12pt]" title="个人网站"></IconWebsite>
                <a
                    :href="props.user.website"
                    class="hover:decoration-blue-500 hover:text-blue-500 hover:underline">
                    {{ props.user.website }}
                </a>
            </div>
            <div class="flex flex-row gap-x-6">
                <div
                    class="cursor-pointer hover:underline"
                    @click="routeTo('followerList', props.user.nickname)">
                    <span>{{ followerCountText }}</span>
                </div>
                <div
                    class="cursor-pointer hover:underline"
                    @click="routeTo('followingList', props.user.nickname)">
                    <span>{{ followingCountText }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.icon {
    width: 1.2rem;
    text-align: center;
    text-align: -webkit-center;
}

.i-icon {
    padding: 0;
    background-color: transparent;
    border-radius: 99rem;
}

.i-icon:hover {
    cursor: auto;
    padding: 0;
    background-color: transparent;
    border-radius: 99rem;
}
</style>

<script setup>
import { reactive, computed, inject } from 'vue'
import { followUser, unFollowUser, deleteOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
import { useRouter } from 'vue-router'
import IconLoading from '@/components/icons/IconLoading.vue'
import IconCalendar from '@/components/icons/IconCalendar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import IconLocation from '@/components/icons/IconLocation.vue'
import IconWebsite from '@/components/icons/IconWebsite.vue'
import IconEmail from '@/components/icons/IconEmail.vue'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'
import Avatar from '@/components/Avatar.vue'
import { standardDate } from '@/indexApp/utils/formatUtils.js'

const { refreshProfileOnUi } = inject('refreshProfileOnUi')
const router = useRouter()
const props = defineProps({
    /** 传入的用户对象 */
    user: {
        type: Object,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    isFollowing: props.user.following,
    isFollower: props.user.follower,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    loading: false,
    confirmBDialogUi: {
        show: false,
        title: '确定要解除屏蔽吗？',
        confirmButton: {
            text: '解除屏蔽',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '保持屏蔽',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '解除屏蔽中......',
            color: 'rgb(239 68 68)'
        }
    }
})

const formattedDate = computed(() => {
    const timestamps = props.user.createdTime
    return standardDate(timestamps)
})

const followerCountText = computed(() => {
    const gender = props.user.gender
    const followingCount = props.user.followingCount
    if (isMyself.value == true) return `订阅我的 ${followingCount}`
    if (gender == 'FEMALE') return `订阅她的 ${followingCount}`
    return `订阅他的 ${followingCount}`
})

const followingCountText = computed(() => {
    const gender = props.user.gender
    const followerCount = props.user.followerCount
    if (isMyself.value == true) return `我的订阅 ${followerCount}`
    if (gender == 'FEMALE') return `她的订阅 ${followerCount}`
    return `他的订阅 ${followerCount}`
})

const isMyself = computed(() => { return props.user.id == state.curUser.id })

const followButtonText = computed(() => {
    if(props.user.following && props.user.follower) return '相互订阅'
    return props.user.following ? '已订阅' : '订阅'
})

const followButtonClass = computed(() => ({
    'bg-gray-200': state.isFollowing,
    'bg-blue-500': !state.isFollowing,
    'text-black': state.isFollowing,
    'text-white': !state.isFollowing 
}))

function routeTo(routeName, routeParam) {
    router.push({ name: routeName, params: { nickname: routeParam } })
}

function toggleFollowState() {
    const userId = props.user.id
    if (state.isFollowing) {
        unFollowAUser(userId)
    } else {
        followAUser(userId)
    }
}

async function followAUser(userId) {
    state.loading = true
    try {
        const response = await followUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('关注失败！')
        state.isFollowing = result
    } catch (e) {
        store.setErrorMsg('订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

async function unFollowAUser(userId) {
    state.loading = true
    try {
        const response = await unFollowUser(userId)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = response.json()
        if (result == false) throw new Error('取消关注失败！')
        state.isFollowing = !result
    } catch (e) {
        store.setErrorMsg('取消订阅失败！')
        console.error(e)
    } finally {
        state.loading = false
    }
}

function showSlide(images, idx) {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
    store.showSlide(images, idx)
}

async function unblockUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await deleteOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if (result) {
            store.setSuccessMsg('已解除屏蔽此用户')
            refreshProfileOnUi()
            state.confirmBDialogUi.show = false
        } else {
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        store.setErrorMsg(e.message)
        console.error(e)
    }finally{
        state.confirmBDialogUi.loading = false
    }
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        unblockUser()
    } else {
        state.confirmBDialogUi.show = false
    }
}
</script>