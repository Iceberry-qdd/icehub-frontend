<template>
    <div
        class="cursor-pointer flex flex-row hover:bg-helper items-center justify-between"
        @click="handleClick">
        <div>
            <p>退出登录</p>
        </div>
        <span class="material-symbols-rounded no-hover p-0 text-[1.15rem] text-inherit">logout</span>
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
import { logout } from '@/indexApp/js/api'
import { store } from '@/indexApp/js/store.js'
const ConfirmDialogBox = defineAsyncComponent(() => import('@/components/ConfirmDialogBox.vue'))

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '从此设备上退出登录？',
        confirmButton: {
            selected: false,
            color: 'text-onError',
            bgColor: 'bg-error'
        },
        cancelButton: {
            selected: false
        },
        loading: {
            show: false
        }
    },
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