<template>
    <div
        class="bg-[#00000066] bottom-0 fixed flex flex-row items-center justify-center left-0 right-0 top-0 z-[111]"
        @click.self="dismiss">
        <div class="bg-white max-h-[80%] min-h-[20%] overflow-y-auto p-4 rounded-[8px] w-[40%]">
            <ReviewCard :review="props.parentReview"></ReviewCard>
            <ReviewEditor
                :post="state.post"
                :parent="props.parentReview"
                tie-location="bottom"
                from-review-panel
                @dismiss="dismiss">
            </ReviewEditor>
        </div>
    </div>
</template>

<script setup>
import ReviewEditor from '@/indexApp/components/postDetail/ReviewEditor.vue'
import { reactive, onMounted, onUnmounted } from 'vue'
import ReviewCard from '@/indexApp/components/replyDetail/ReviewCard.vue'

const emits = defineEmits(['dismiss'])
const props = defineProps({
    /** 传入的被回复的评论对象 */
    // eslint-disable-next-line vue/no-unused-properties
    parentReview: {
        type: Object,
        required: true
    }
})
const state = reactive({
    post: null
})

// TODO 退出时保存用户的评论草稿
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