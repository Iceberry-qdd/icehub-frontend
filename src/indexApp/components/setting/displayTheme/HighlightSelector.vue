<template>
    <div>
        <div class="gap-x-2 gap-y-4 grid grid-cols-3">
            <div
                v-for="(item, name) in props.highlightOptions"
                :key="name"
                class="flex-1 text-center">
                <div
                    :class="{'ring-[3px] ring-offset-2  ring-primary-inActive dark:ring-onPrimary ring-offset-primaryContainer': props.highlight === name}"
                    :style="{backgroundImage: `url('${item.preview}')`}"
                    class="aspect-video bg-[length:250%] bg-left-top bg-no-repeat border-[1px] border-gray-300 cursor-pointer dark:border-neutral-700 overflow-hidden p-2 rounded-[12px] select-none"
                    @click="emits('select', name)" />
                <div class="cursor-default mt-2">{{ item.zh }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emits = defineEmits(['select'])
const props = defineProps({
    /** 选中的代码高亮类型 */
    highlight: {
        type:String,
        required: true
    },
    /** 支持的代码高亮类型 */
    highlightOptions: {
        type: Object,
        required: true
    }
})
</script>