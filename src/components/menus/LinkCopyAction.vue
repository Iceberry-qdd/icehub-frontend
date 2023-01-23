<template>
    <div>
        <div @click="copyLink">复制链接</div>
    </div>
</template>

<style scoped>

</style>

<script setup>
import { reactive } from 'vue'
import { store } from '@/store.js'

const props = defineProps(['link'])

const state = reactive({
    link: props.link
})

async function copyLink() {
    navigator.clipboard ? (await copyLinkV2()) : copyLinkV1()
}

function copyLinkV1() {
    console.log('V1')
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
        console.log(e)
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
    }
}

</script>