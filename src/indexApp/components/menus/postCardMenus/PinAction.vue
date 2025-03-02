<template>
    <div @click="doTogglePin">
        <span class="material-symbols-rounded max-sm:bg-gray-100 max-sm:dark:bg-neutral-700 max-sm:p-3 p-0 sm:no-hover sm:text-[1.25rem] text-[1.5rem]">push_pin</span>
        <div class="max-sm:dark:text-white/50 max-sm:text-[0.8rem] max-sm:text-zinc-500">
            {{ text }}
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss -->
<script setup>
import { inject, computed } from 'vue'
import { togglePin } from '@/indexApp/js/api'
import { store } from '@/indexApp/js/store.js'

const props = defineProps({
    /** 待置顶的帖子 */
    post: {
        type: Object,
        required: true
    }
})
const { pinPostOnUi } = inject('pinPostOnUi', { pinPostOnUi: () => { } })
const { dismissPostMenus } = inject('dismissPostMenus')

const text = computed(() => {
    return props.post.top ? '取消置顶' : '置顶'
})

async function doTogglePin() {
    try {
        const response = await togglePin(props.post.id, props.post.top, !props.post.top)
        if (!response.ok) throw new Error((await response.json()).message)

        const result = await response.json()
        if (result == false) throw new Error("置顶失败！")
        // XXX 此处为方便，直接修改props对象的属性值
        // eslint-disable-next-line vue/no-mutating-props
        props.post.top = !props.post.top
        pinPostOnUi(props.post.id, props.post.top)
        store.setSuccessMsg(`该帖子已${!props.post.top ? '取消置顶' : '置顶'}！`)
    } catch (e) {
        console.error(e)
        store.setErrorMsg(e.message)
    } finally {
        dismissPostMenus()
    }
}
</script>