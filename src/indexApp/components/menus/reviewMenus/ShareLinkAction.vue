<template>
    <div @click="handleClick">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">copy</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">复制链接</div>
    </div>
</template>

<script setup>
import { inject } from 'vue'
import { store } from '@/indexApp/js/store.js'

const { dismissReviewMenus }  = inject('dismissReviewMenus')
const props = defineProps({
    /** 该评论的链接 */
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
    }finally{
        dismissReviewMenus()
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
        dismissReviewMenus()
    }
}
</script>