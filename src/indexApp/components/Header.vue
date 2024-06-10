<template>
    <div
        id="h"
        class="backdrop-blur-xl bg-white/80 flex flex-row h-[56px] items-center justify-between max-sm:h-[48px] max-sm:px-2 px-[1rem] sticky text-lg top-0 z-[104]"
        :class="[!state.noBorder ? 'border-b-[1px] border-[#EEEEEE]' : '']">
        <div class="flex flex-0 flex-row h-full items-center">
            <div
                v-if="props.goBack"
                class="cursor-pointer material-icons-round mr-[0.5rem] text-[1.125rem]"
                title="返回"
                @click="routeBackTo">
                arrow_back_ios
            </div>
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div
                v-if="props.title"
                class="font-bold max-sm:ml-2">
                {{ props.title }}
            </div>
        </div>
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <slot></slot>
        <div
            v-if="props.showMenu"
            id="header-opt"
            :title="props.iconTooltip"
            class="flex-0">
            <span
                v-if="props.menuIcon"
                class="material-icons-round text-[1.125rem]"
                @click="handleAction">
                {{ props.menuIcon }}
            </span>
        </div>
    </div>
</template>

<!-- eslint-disable vue/no-unused-properties -->
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    /** 标题字符串 */
    title: {
        type: String,
        required: true
    },
    /** 是否显示返回箭头 */
    goBack: {
        type: Boolean,
        required: true
    },
    /** 是否显示菜单按钮 */
    showMenu: {
        type: Boolean,
        required: true
    },
    /** 菜单按钮字符串，若传入Material UI支持的字符串，则自动转换为相应图标 */
    menuIcon: {
        type: String,
        required: false,
        default: ''
    },
    /** menuIcon表示的意义字符串 */
    iconTooltip: {
        type: String,
        required: false,
        default: ''
    },
    /** 是否隐藏下边框 */
    noBorder: {
        type: Boolean,
        required: false,
        default: false
    }
})
const emits = defineEmits(['handleAction'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const state = reactive({
    routeUrl: '/',
    editIcon: '',
    url: window.location.href,
    submit: false,
    noBorder: props.noBorder != null ? props.noBorder : false
})


function handleAction() {
    emits('handleAction')
}

function routeBackTo() {
    router.back()
}
</script>