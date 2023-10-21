<template>
    <div @click.stop="" id="confirmDialogBox" class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div
            class="flex flex-col flex-nowrap justify-between items-center gap-y-[1rem] w-[18rem] min-h-[8rem] max-h-[75%] p-6 bg-white rounded-[8px] overflow-y-auto">
            <div class="text-[11pt]">{{ title }}</div>
            <IconLoading v-if="props.ui.loading.show" class="h-auto w-5" :style="loadingStyle"></IconLoading>
            <div v-else class="flex flex-row flex-nowrap gap-x-[1rem]">
                <div @click="confirm" class="text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer" :style="confirmButtonStyle">
                    {{ props.ui.confirmButton.text }}
                </div>
                <div @click="cancel" class=" text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer" :style="cancelButtonStyle">
                    {{ props.ui.cancelButton.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { computed, reactive, onMounted, onUnmounted } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'

const props = defineProps(['ui'])
const emits = defineEmits(['choice'])

const title = computed(() => {
    return props.ui.loading.show ? props.ui.loading.text : props.ui.title
})

const loadingStyle = reactive({
    color: props.ui.loading.color
})

const confirmButtonStyle = reactive({
    color: props.ui.confirmButton.color,
    backgroundColor: props.ui.confirmButton.bgColor
})

const cancelButtonStyle = reactive({
    color: props.ui.cancelButton.color,
    backgroundColor: props.ui.cancelButton.bgColor
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