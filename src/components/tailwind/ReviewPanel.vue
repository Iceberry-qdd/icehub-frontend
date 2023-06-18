<template>
    <div @click.self="dismiss"
        class="z-[111] flex flex-row justify-center items-center fixed left-0 right-0 top-0 bottom-0 bg-[#00000066]">
        <div class="w-[40%] min-h-[20%] max-h-[60%] p-4 bg-white rounded-[8px] overflow-y-auto">
            <ReviewCard :review="state.parentReview"></ReviewCard>
            <ReviewEditor :post="state.post" :parent="state.parentReview" :tie-location="'bottom'" :from-review-panel="true"></ReviewEditor>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>
import ReviewEditor from './ReviewEditor.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import { store } from '@/store.js'
import ReviewCard from './ReviewCard.vue'

const state = reactive({
    parentReview: store.REVIEW_PANEL_DATA,
    post: null
})

function dismiss() {
    store.clearReviewPanel()
    document.querySelector("body").removeAttribute("style")
}

onMounted(() => {
    document.querySelector("body").setAttribute("style", "overflow:hidden")
})

onUnmounted(() => {
    dismiss()
})
</script>