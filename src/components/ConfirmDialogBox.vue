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
                class="h-auto w-5"
                :style="loadingStyle">
            </IconLoading>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-else class="flex flex-nowrap flex-row gap-x-[1rem] text-[0.9rem]">
                <div
                    id="confirmButton"
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] px-4 py-[0.3rem] rounded-full text-center"
                    @click="confirm">
                    {{ props.ui.confirmButton.text }}
                </div>
                <div
                    id="cancelButton"
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] px-4 py-[0.3rem] rounded-full text-center"
                    @click="cancel">
                    {{ props.ui.cancelButton.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-in {
    animation: fade-in 250ms cubic-bezier(0.78, 0.14, 0.15, 0.86) 0s 1 normal forwards;
}

#confirmButton{
    background-color: v-bind(confirmBtnBgColor);
    color: v-bind(confirmBtnColor);
}

#confirmButton:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
    color: #fca5a5;
}

#cancelButton{
    background-color: v-bind(cancelBtnBgColor);
    color: v-bind(cancelBtnColor);
}

#cancelButton:where([theme="dark"], [theme="dark"] *){
    background-color: #404040;
    color: white;
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
import { computed, reactive } from 'vue'
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
    loading: { text: loadingText, color: loadingColor },
    title: titleText,
    confirmButton: { color: confirmBtnColor, bgColor: confirmBtnBgColor },
    cancelButton: { color: cancelBtnColor, bgColor: cancelBtnBgColor }
} = props.ui

const title = computed(() => {
    return props.ui.loading.show ? loadingText : titleText
})

const loadingStyle = reactive({
    color: loadingColor
})

function confirm() {
    emits('choice', { choice: 'confirm' })
}

function cancel() {
    emits('choice', { choice: 'cancel' })
}
</script>