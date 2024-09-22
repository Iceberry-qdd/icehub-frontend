<template>
    <div>
        <div class="gap-x-2 gap-y-4 grid grid-cols-3">
            <div
                v-for="(item, name) in props.highlightOptions"
                :key="name"
                class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2': props.highlight === name}"
                    :style="{backgroundImage: `url('${item.preview}')`}"
                    class="aspect-video bg-[length:120%] bg-repeat-y bg-top border-[1px] cursor-pointer overflow-hidden p-2 rounded-[12px] select-none"
                    @click="emits('select', name)" />
                <div class="cursor-default mt-2">{{ item.zh }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'

const emits = defineEmits(['select'])
const props = defineProps({
    /** 选中的表情类型 */
    highlight: {
        type:String,
        required: true
    },
    /** 支持的表情类型 */
    highlightOptions: {
        type: Object,
        required: true
    }
})
const state = reactive({


})
</script>