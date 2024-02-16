<template>
    <div
        id="confirmDialogBox"
        class="bg-[#00000066] bottom-0 fixed flex flex-row items-center justify-center left-0 right-0 top-0 z-[111]"
        @click.stop="">
        <div
            class="bg-white flex flex-col flex-nowrap gap-y-[1rem] items-center justify-between max-h-[75%] min-h-[8rem] overflow-y-auto p-6 rounded-[8px] w-[18rem]">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="text-[11pt]">{{ title }}</div>
            <IconLoading
                v-if="props.ui.loading.show"
                class="h-auto w-5"
                :style="loadingStyle">
            </IconLoading>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-else class="flex flex-nowrap flex-row gap-x-[1rem]">
                <div
                    class="btn-no-select cursor-pointer px-4 py-[0.3rem] rounded-full text-[11pt]"
                    :style="confirmButtonStyle"
                    @click="confirm">
                    {{ props.ui.confirmButton.text }}
                </div>
                <div
                    class="btn-no-select cursor-pointer px-4 py-[0.3rem] rounded-full text-[11pt]"
                    :style="cancelButtonStyle"
                    @click="cancel">
                    {{ props.ui.cancelButton.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, onMounted, onUnmounted } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const props = defineProps({
    /** 弹窗的UI配置属性 */
    ui: {
        type: Object,
        required: true
    }
})
const emits = defineEmits(['choice'])

const title = computed(() => {
    return props.ui.loading.show ? props.ui.loading.text : props.ui.title
})

const loadingColor = computed(() => props.ui.loading.color)
const loadingStyle = reactive({
    color: loadingColor
})

const confirmBtnColor = computed(() => props.ui.confirmButton.color)
const confirmBtnBgColor = computed(() => props.ui.confirmButton.bgColor)
const confirmButtonStyle = reactive({
    color: confirmBtnColor,
    backgroundColor: confirmBtnBgColor
})

const cancelBtnColor = computed(() => props.ui.cancelButton.color)
const cancelBtnBgColor = computed(() => props.ui.cancelButton.bgColor)
const cancelButtonStyle = reactive({
    color: cancelBtnColor,
    backgroundColor: cancelBtnBgColor
})

function confirm() {
    emits('choice', { choice: 'confirm' })
}

function cancel() {
    emits('choice', { choice: 'cancel' })
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    document.querySelector("body").removeAttribute("style")
})
</script>