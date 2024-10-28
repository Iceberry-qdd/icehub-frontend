<template>
    <div @click="share">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">{{ icon }}</span>
        <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">{{ text }}</div>
    </div>
</template>

<script setup>
import { inject, computed, reactive } from 'vue'
import { store } from '@/indexApp/js/store.js'

const { dismissProfileMenus } = inject('dismissProfileMenus', { 'dismissProfileMenus': () => { } }, true)
const { dismissPostMenus } = inject('dismissPostMenus', { 'dismissProfileMenus': () => { } }, true)
const { dismissReviewMenus } = inject('dismissReviewMenus', { 'dismissProfileMenus': () => { } }, true)
const props = defineProps({
    /** 链接 */
    link: {
        type: String,
        required: true
    },
    /** 分享的类型，取值可为[POST | USER | REVIEW] */
    type: {
        type: String,
        required: true
    }
})

const state = reactive({
    typeMap: new Map([
        ['POST', '帖子'],
        ['USER', '用户'],
        ['REVIEW', '评论'],
        [undefined, '内容']
    ])
})

new Map().get()
const text = computed(() => {
    return store.PWA_MODE && navigator.share ? `分享${state.typeMap.get(props.type)}` : '复制链接'
})

const icon = computed(() => {
    return store.PWA_MODE && navigator.share ? 'share' : 'content_copy'
})

async function share() {
    store.PWA_MODE && navigator.share ? doShare() : copyLink()
}

function doShare() {
    const shareOptions = {
        title: `Icehub - ${state.typeMap.get(props.type)}分享`,
        url: props.link
    }
    navigator.share(shareOptions)
        .then(() => store.setSuccessMsg(`分享${state.typeMap.get(props.type)}成功！`))
        .catch((e) => {
            store.setErrorMsg(`分享${state.typeMap.get(props.type)}失败！`)
            console.error(e)
        })
}

async function copyLink() {
    if (!navigator.clipboard) {
        store.setErrorMsg('复制链接失败，无法获取剪贴板！')
        return
    }

    const PERMISSION_NAME = 'clipboard-write'
    try {
        const result = await navigator.permissions.query({ name: PERMISSION_NAME })
        switch (result.state) {
            case 'granted':
                await navigator.clipboard.writeText(props.link)
                store.setSuccessMsg('已复制至剪贴板！')
                break
            case 'prompt':
                store.setWarningMsg('请授予剪贴板写入权限！')
                break
            case 'denied':
                store.setErrorMsg('您已拒绝剪贴板写入权限，请检查网站设置！')
            default: ;
        }
    } catch (e) {
        store.setErrorMsg('链接复制失败！')
        console.error(e)
    } finally {
        switch (props.type) {
            case 'USER': dismissProfileMenus(); break;
            case 'POST': dismissPostMenus(); break;
            case 'REVIEW': dismissReviewMenus(); break;
            default: break;
        }
    }
}
</script>