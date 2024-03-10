<template>
    <div class="h-[56px] sticky top-0 w-full z-[102]">
        <div
            id="h"
            class="flex flex-row items-center justify-between px-[1rem] text-[15pt] w-[calc(100%*5/13)]"
            :class="[!state.noBorder ? 'border-btm' : '']">
            <div class="flex flex-row h-full items-center text-[15pt]">
                <div
                    v-if="props.goBack"
                    class="cursor-pointer material-icons-round mr-[0.5rem] text-[14pt]"
                    title="返回"
                    @click="routeBackTo">
                    arrow_back_ios
                </div>
                <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
                <div class="font-bold text-[14pt]">{{ props.title }}</div>
            </div>
            <div
                v-if="props.showMenu"
                id="header-opt"
                :title="props.iconTooltip">
                <span
                    v-if="props.menuIcon"
                    class="material-icons-round text-[14pt]"
                    @click="handleAction">
                    {{ props.menuIcon }}
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
#h {
    background-color: rgb(255 255 255 / 84%);
    backdrop-filter: blur(25px);
    z-index: 104;
    height: 56px;
    position: fixed;
}

.border-btm {
    border-bottom: 1px solid #EEEEEE;
}
</style>

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
    /** Header组件的宽度 */
    width: {
        type: Number,
        required: false,
        default: 0
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