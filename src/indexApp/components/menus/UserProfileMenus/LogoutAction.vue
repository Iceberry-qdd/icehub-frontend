<template>
    <div @click="handleClick">
        <span class="material-icons-round max-sm:bg-red-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem] text-red-500">logout</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem]">退出登录</div>
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
import { inject, reactive } from 'vue'
const { dismissProfileMenus } = inject('dismissProfileMenus')
import { logout } from '@/indexApp/js/api'
import { store } from '@/indexApp/js/store.js'
import ConfirmDialogBox from '@/components/ConfirmDialogBox.vue'

const state = reactive({
    confirmBDialogUi: {
        show: false,
        title: '确定要退出登录吗？',
        confirmButton: {
            text: '确定退出',
            color: 'rgb(239 68 68)',
            bgColor: 'rgb(254 226 226)',
            selected: false
        },
        cancelButton: {
            text: '取消',
            color: '#000000',
            bgColor: 'rgb(243 244 246)',
            selected: false
        },
        loading: {
            show: false,
            text: '正在退出登录...',
            color: 'rgb(239 68 68)'
        }
    },
})

async function doLogout(){
    try{
        state.confirmBDialogUi.loading.show = true
        const response = await logout()
        if (!response.ok) throw new Error((await response.json()).error)

        const result = await response.json()
        if(result){
            clearToken()
            dismissConfirmDialogBox()
            dismissProfileMenus()
            redirectToAuth()
        }else{
            throw new Error('退出登录失败！')
        }
    }catch(e){
        store.setErrorMsg(e.message)
        console.error(e)
    }finally{
        state.confirmBDialogUi.loading.show = false
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