<template>
    <div @click="copyLink">
        <span class="material-icons-round max-sm:bg-gray-100 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">content_copy</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:text-[0.8rem] max-sm:text-zinc-500">复制链接</div>
    </div>
</template>

<script setup>
import { reactive, inject } from 'vue'
import { store } from '@/indexApp/js/store.js'

const { dismissPostMenus } = inject('dismissPostMenus')
const props = defineProps({
    /** 传入的链接字符串 */
    link: {
        type: String,
        required: true
    }
})

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    link: props.link
})

async function copyLink() {
    navigator.clipboard ? (await copyLinkV2()) : copyLinkV1()
}

function copyLinkV1() {
    try {
        const el = document.createElement('input')
        el.setAttribute('value', state.link)
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        store.setSuccessMsg('已复制至剪贴板！')
    } catch (e) {
        store.setErrorMsg(e.message)
    } finally {
        dismissPostMenus()
    }
}

async function copyLinkV2() {
    const PERMISSION_NAME = 'clipboard-write'
    try {
        const result = await navigator.permissions.query({ name: PERMISSION_NAME })
        switch (result.state) {
            case 'granted':
                await navigator.clipboard.writeText(state.link)
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
    } finally {
        dismissPostMenus()
    }
}
</script>