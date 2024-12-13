<template>
    <div
        id="confirmDialogBox"
        class="bg-[#00000066] fixed-page flex flex-row h-screen items-center justify-center max-sm:z-[1001] sm:backdrop-blur-sm w-screen z-[111]">
        <div
            class="bg-white dark:bg-[#1e1e1e] fade-in flex flex-col flex-nowrap gap-y-[1rem] items-center justify-between max-h-[75%] min-h-[8rem] overflow-y-auto p-6 rounded-[8px] w-[18rem]">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="dark:text-white/75 text-[0.95rem] text-justify">{{ title }}</div>
            <IconLoading
                v-if="props.ui.loading.show"
                class="dark:text-white/50 h-5 text-primary w-5">
            </IconLoading>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-else class="flex flex-nowrap flex-row gap-x-[1rem] max-sm:flex-col max-sm:gap-y-[0.5rem] max-sm:w-full text-[0.9rem]">
                <div
                    v-if="showConfirmBtn"
                    id="confirmButton"
                    :class="[confirmBtnColor, confirmBtnBgColor]"
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] px-4 py-[0.3rem] rounded-full text-center"
                    @click="confirm">
                    {{ confirmBtnText }}
                </div>
                <div
                    v-if="showCancelBtn"
                    id="cancelButton"
                    :class="[cancelBtnColor, cancelBtnBgColor]"
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] px-4 py-[0.3rem] rounded-full text-center"
                    @click="cancel">
                    {{ cancelBtnText }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-in {
    animation: fade-in 250ms cubic-bezier(0.78, 0.14, 0.15, 0.86) 0s 1 normal forwards;
}

@keyframes fade-in {
    0% {
        scale: 0.5;
    }

    80% {
        scale: 1.1;
    }

    100% {
        scale: 1;
    }
}
</style>

<script setup>
import { computed } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const props = defineProps({
    /** 弹窗的UI配置属性 */
    ui: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['choice'])

// eslint-disable-next-line vue/no-setup-props-reactivity-loss
const {
    loading: { text: loadingText = '请稍等......' },
    title: titleText,
    confirmButton: {
        show: showConfirmBtn = true,
        color: confirmBtnColor = 'text-primary dark:text-onPrimary',
        bgColor: confirmBtnBgColor = 'bg-primaryContainer',
        text: confirmBtnText = '确定'
    },
    cancelButton: {
        show: showCancelBtn = true,
        color: cancelBtnColor = 'text-onPrimaryContainer',
        bgColor: cancelBtnBgColor = 'bg-helper dark:bg-error',
        text: cancelBtnText = '取消'
    }
} = props.ui

const title = computed(() => {
    return props.ui.loading.show ? loadingText : titleText
})

function confirm() {
    emits('choice', { choice: 'confirm' })
}

function cancel() {
    emits('choice', { choice: 'cancel' })
}
</script>