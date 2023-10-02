<template>
    <div class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div
            class="flex flex-col flex-nowrap justify-evenly items-center gap-y-[0.5rem] w-[16rem] h-[8rem] p-4 bg-white rounded-[8px] overflow-y-auto">
            <div class="text-[11pt]">{{ title }}</div>
            <IconLoading v-if="store.CONFIRM_DIALOG_BOX.loading.show" class="h-auto w-5" :style="loadingStyle">
            </IconLoading>
            <div v-else class="flex flex-row flex-nowrap gap-x-[1rem]">
                <div @click="confirm" class="text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer" :style="confirmButtonStyle">
                    {{ store.CONFIRM_DIALOG_BOX.confirmButton.text }}
                </div>
                <div @click="cancel" class=" text-[11pt] rounded-full px-4 py-[0.3rem] cursor-pointer" :style="cancelButtonStyle">
                    {{ store.CONFIRM_DIALOG_BOX.cancelButton.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import { computed, reactive, onUnmounted, watch } from 'vue'
import IconLoading from '@/components/icons/IconLoading.vue'
import { store } from '@/store'

const title = computed(() => {
    return store.CONFIRM_DIALOG_BOX.loading.show ? store.CONFIRM_DIALOG_BOX.loading.text : store.CONFIRM_DIALOG_BOX.title
})

const loadingStyle = reactive({
    color: store.CONFIRM_DIALOG_BOX.loading.color
})

const confirmButtonStyle = reactive({
    color: store.CONFIRM_DIALOG_BOX.confirmButton.color,
    backgroundColor: store.CONFIRM_DIALOG_BOX.confirmButton.bgColor
})

const cancelButtonStyle = reactive({
    color: store.CONFIRM_DIALOG_BOX.cancelButton.color,
    backgroundColor: store.CONFIRM_DIALOG_BOX.cancelButton.bgColor
})

function confirm() {
    store.selectCDBConfirmButton()
}

function cancel() {
    store.selectCDBCancelButton()
}

watch(() => store.CONFIRM_DIALOG_BOX.cancelButton.selected, (newVal, oldVal) => {
    if (newVal == true && store.CONFIRM_DIALOG_BOX.show == true) {
        store.dismissCDB()
    }
})

// onUnmounted(() => {
//     store.resetCDB()
// })
</script>