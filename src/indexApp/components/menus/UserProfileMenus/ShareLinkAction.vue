<template>
    <div
        class="flex flex-rows gap-x-3 items-center justify-start"
        @click="handleClick">
        <span class="material-icons-round no-hover p-0 text-[1.2rem]">share</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="btn-no-select">分享该用户</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { store } from '@/indexApp/js/store.js'

const { dismissProfileMenus }  = inject('dismissProfileMenus')
const props = defineProps({
    /** 该用户主页的链接 */
    link: {
        type: String,
        required: true
    }
})
async function handleClick(){
    navigator.clipboard ? (await copyLinkV2()) : copyLinkV1()
}

function copyLinkV1() {
    try {
        const el = document.createElement('input')
        el.setAttribute('value', props.link)
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        store.setSuccessMsg('已复制至剪贴板！')
    } catch (e) {
        store.setErrorMsg(e.message)
        console.log(e)
    }finally{
        dismissProfileMenus()
    }
}

async function copyLinkV2() {
    const PERMISSION_NAME = 'clipboard-write'
    try {
        const result = await navigator.permissions.query({ name: PERMISSION_NAME })
        switch (result.state) {
            case 'granted':
                await navigator.clipboard.writeText(props.link)
                store.setSuccessMsg('已复制至剪贴板！')
                break
            case 'prompt':
                store.setWarningMsg('待授予访问系统剪贴板权限...')
                break
            case 'denied':
                throw new Error('没有访问系统剪贴板的权限！')
            default: ;
        }
    } catch (e) {
        store.setErrorMsg('链接复制失败！')
        console.log(e)
    }finally{
        dismissProfileMenus()
    }
}
</script>