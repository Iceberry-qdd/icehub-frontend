<template>
    <div
        class="bg-[#00000066] fixed h-full w-full z-[101]"
        @click.self="dismiss">
        <div
            class="absolute bg-white h-[8rem] rounded-[8px] translate-x-[calc((100vw-30rem)/2)] translate-y-[calc((100vh-8rem)/2)] w-[30rem]">
            <div
                class="cursor-default flex flex-nowrap flex-row h-[2.75rem] items justify-center select-none text-center w-full">
                <div
                    v-for="item in state.items"
                    v-show="item.show"
                    :key="item.id"
                    class="basis-1/3 flex flex-col gap-y-1 h-[8rem] items-center justify-center">
                    <!-- eslint-disable-next-line vue/max-attributes-per-line, vue/singleline-html-element-content-newline -->
                    <div class="material-icons-round" @click="handleSelect(item.select)">{{ item.icon }}</div>
                    <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                    <div class="text-[0.8rem] text-zinc-400">{{ item.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-setup-props-reactivity-loss vue/no-ref-object-reactivity-loss -->
<script setup>
import { reactive, onMounted, onUnmounted, computed } from 'vue'

const emits = defineEmits(['dismiss', 'select'])
const props = defineProps({
    /** 以哪种方式触发该组件, 取值[avatar|banner] */
    from: {
        type: String,
        required: false,
        default: 'avatar'
    }
})

const fromText = computed(() => {
    switch (props.from) {
        case 'avatar': return '头像'
        case 'banner': return '背景图'
        default: return ''
    }
})
const state = reactive({
    items: [
        { id: 1, name: '从文件选择', icon: 'add_photo_alternate', show: true, select: 'file' },
        { id: 2, name: '使用表情', icon: 'mood', show: props.from === 'avatar', select: 'emoji' },
        { id: 3, name: `恢复默认${fromText.value}`, icon: 'restore', show: true, select: 'restore' }
    ]
})

function handleSelect(select){
    emits('select', {select: select})
    dismiss()
}

function dismiss(){
    emits('dismiss')
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style", "overflow:hidden")
})
</script>