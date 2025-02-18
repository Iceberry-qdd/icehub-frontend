<template>
    <div
        class="border-b-[1px] dark:border-[#1e1e1e] flex flex-nowrap flex-row gap-x-3 items-start p-2">
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
                    class="dark:text-onPrimary h-[0.9rem] text-primary w-[0.9rem]">
                </IconVerify>
                <div
                    v-if="props.user.confirmFollow"
                    class="dark:text-white/50 material-symbols-rounded no-hover p-0 text-[1rem]">
                    lock
                </div>
            </div>
            <div class="dark:text-white/50 font-light text-[0.9rem] text-neutral-500 webkit-box-2">
                {{ brief(props.user.remark) }}
            </div>
        </div>
        <div
            class="bg-primary cursor-pointer flex flex-none flex-nowrap font-bold items-center justify-center place-self-center px-[1rem] py-[0.4rem] rounded-full text-[11pt] text-onPrimary w-[6rem]"
            @click="unBlockUser">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div v-if="!state.loading">移出</div>
            <IconLoading
                v-else
                class="h-5 w-5">
            </IconLoading>
        </div>
        <Teleport to="#app">
            <ConfirmDialogBox
                v-if="state.confirmBDialogUi.show"
                class="fixed top-0"
                :ui="state.confirmBDialogUi"
                @choice="choose">
            </ConfirmDialogBox>
        </Teleport>
    </div>
</template>

<script setup>
import { reactive, defineAsyncComponent } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import { useRouter } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import IconVerify from '@/components/icons/IconVerify.vue'
import { deleteOneBlacklist } from '@/indexApp/js/api.js'
import { store } from '@/indexApp/js/store.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const router = useRouter()
const emits = defineEmits(['deleteOnUi'])
const props = defineProps({
    /** 用户对象 */
    user: {
        type: Object,
        required: true
    }
})

const state = reactive({
    loading: false,
    curUser: JSON.parse(localStorage.getItem("CUR_USER")),
    confirmBDialogUi: {
        show: false,
        title: '解除屏蔽此用户？',
        confirmButton: {
            selected: false
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    }
})

function routeToUserProfile() {
    router.push({ name: 'profile', params: { nickname: props.user.nickname } })
}

function brief(remark) {
    const defaultRemark = '该用户很神秘，什么都没写。'
    return remark || defaultRemark
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        doUnblockUser()
    } else {
        state.confirmBDialogUi.show = false
        state.loading = false
    }
}

function unBlockUser(){
    state.confirmBDialogUi.show = true
    state.loading = true
}

async function doUnblockUser() {
    try {
        state.confirmBDialogUi.loading.show = true
        const response = await deleteOneBlacklist('USER', props.user.id, state.curUser.id)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result) {
            store.setSuccessMsg('已解除屏蔽此用户')
            emits('deleteOnUi', props.user.id)
        } else {
            throw new Error("解除屏蔽失败！")
        }
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    }finally{
        state.confirmBDialogUi.loading = false
        state.confirmBDialogUi.show = false
        state.loading = false
    }
}
</script>