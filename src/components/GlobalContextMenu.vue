<template>
    <div
        id="context-menu"
        ref="contextMenu"
        :style="translateStyle"
        class="cursor-pointer flex flex-col min-w-[12rem] ring-1 ring-slate-900/10 rounded-[8px] shadow-lg">
        <RefreshAction
            v-if="state.actionVisMap.get('RefreshAction')"
            class="action first:rounded-t-[8px] last:rounded-b-[8px]">
        </RefreshAction>
    </div>
</template>

<script setup>
import { onMounted, reactive, onUnmounted, computed, ref, inject } from 'vue'
import RefreshAction from '@/components/menu/contextMenus/RefreshAction.vue'

const {dismissContextMenu} = inject('dismissContextMenu')

const props = defineProps({
    /** 鼠标点击的横坐标 */
    clickX: {
        type: Number,
        required: true
    },
    /** 鼠标点击的纵坐标 */
    clickY: {
        type: Number,
        required: true
    }
})
const state = reactive({
    location: {x: 0, y: 0},
    actionVisMap: new Map([
        [RefreshAction.__name, true],
        [undefined, false] // 最后设置一个{undefined: false} 保证名字匹配不上时默认不显示
    ])
})

function handleProfileMenusDismiss(event) {
    const profileMenus = document.querySelector('#context-menu')
    if (!profileMenus || (!profileMenus.contains(event.target))) {
        dismissContextMenu()
    }
    event.stopPropagation()
}

const contextMenu = ref()
const translateStyle = computed(() => {
    if(!contextMenu.value){
        return {'translate': `${props.clickX}px ${props.clickY}px`}
    }

    const {width, height} = contextMenu.value.getBoundingClientRect()
    let clickX = props.clickX, clickY = props.clickY

    if(width + props.clickX > window.innerWidth){
        clickX = props.clickX - width
    }

    if(height + props.clickY > window.innerHeight){
        clickY = props.clickY - height
    }

    return {'translate': `${clickX}px calc(${clickY}px - env(titlebar-area-height, 0px))`}
})

onMounted(() => {
    document.addEventListener('click', handleProfileMenusDismiss)
})

onUnmounted(() => {
    document.removeEventListener('click', handleProfileMenusDismiss)
})
</script>