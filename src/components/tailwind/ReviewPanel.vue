<template>
    <div @click.self="dismiss"
        class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div class="w-[40%] min-h-[20%] max-h-[60%] p-4 bg-white rounded-[8px] overflow-y-auto">
            <ReviewCard :review="props.parentReview"></ReviewCard>
            <ReviewEditor
                :post="state.post"
                :parent="props.parentReview"
                :tie-location="'bottom'"
                @dismiss = 'dismiss'
                :from-review-panel="true">
            </ReviewEditor>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import ReviewEditor from '@/components/tailwind/ReviewEditor.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import { store } from '@/store.js'
import ReviewCard from '@/components/tailwind/ReviewCard.vue'

const emits = defineEmits(['dismiss'])
const props = defineProps(['parentReview'])
const state = reactive({
    post: null
})

function dismiss() {
    emits('dismiss')
    document.querySelector("body").removeAttribute("style")
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    dismiss()
})
</script>