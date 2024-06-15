<template>
    <div
        id="confirmDialogBox"
        class="bg-[#00000066] flex flex-row h-full items-center justify-center max-sm:z-[1001] sm:backdrop-blur-sm w-full z-[111]"
        @click.stop="">
        <div
            class="bg-white flex flex-col flex-nowrap gap-y-[1rem] items-center justify-between max-h-[75%] min-h-[8rem] overflow-y-auto p-6 rounded-[8px] w-[18rem]">
            <!-- eslint-disable-next-line vue/singleline-html-element-content-newline -->
            <div class="text-[0.95rem]">{{ title }}</div>
            <IconLoading
                v-if="props.ui.loading.show"
                class="h-auto w-5"
                :style="loadingStyle">
            </IconLoading>
            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <div v-else class="flex flex-nowrap flex-row gap-x-[1rem] text-[0.9rem]">
                <div
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] px-4 py-[0.3rem] rounded-full text-center"
                    :style="confirmButtonStyle"
                    @click="confirm">
                    {{ props.ui.confirmButton.text }}
                </div>
                <div
                    class="btn-no-select cursor-pointer font-bold max-sm:py-2 min-w-[4.5rem] py-[0.3rem] rounded-full text-center"
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