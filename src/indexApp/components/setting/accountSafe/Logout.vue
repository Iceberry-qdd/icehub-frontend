<template>
    <div
        class="cursor-pointer flex flex-row hover:bg-gray-100 items-center justify-between px-4 py-2"
        @click="handleClick">
        <div>
            <p>退出登录</p>
            <p class="text-[0.85rem] text-neutral-400">
                {{ info }}
            </p>
        </div>
        <span class="material-symbols-rounded no-hover p-0 text-[1.15rem]">logout</span>
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
import { computed, reactive } from 'vue'
import { logout } from '@/indexApp/js/api'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '确定要退出登录吗？',
        confirmButton: {
            text: '确定退出',
            selected: false,
            color: 'text-onError',
            bgColor: 'bg-error'
        },
        cancelButton: {
            text: '取消',
            selected: false
        },
        loading: {
            show: false,
            text: '正在退出登录...'
        }
    },
})

const info = computed(() => {
    return '从该设备上退出您的账号。'
})

async function doLogout(){
    try{
        state.confirmBDialogUi.loading.show = true
        const response = await logout()
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if(result){
            clearToken()
            redirectToAuth()
        }else{
            throw new Error('退出登录失败！')
        }
    }catch(e){
        store.setErrorMsg(e.message)
    }finally{
        state.confirmBDialogUi.loading.show = false
        dismissConfirmDialogBox()
    }
}

function clearToken(){
    localStorage.clear()
}

function choose(args) {
    const choice = args.choice
    if (choice == 'confirm') {
        doLogout()
    } else {
        dismissConfirmDialogBox()
    }
}

function dismissConfirmDialogBox() {
    state.confirmBDialogUi.show = false
}

function handleClick(){
    state.confirmBDialogUi.show = true
}

function redirectToAuth(){
    const origin = location.origin
    location.replace(`${origin}/auth.html`)
}
</script>