<template>
    <div>
        <BaseNotifyTimelinePage
            ref="BaseNotifyTimelinePageRef"
            :types="props.tab.types">
        </BaseNotifyTimelinePage>
    </div>
</template>

<script setup>
import BaseNotifyTimelinePage from '@/indexApp/routes/notify/BaseNotifyTimelinePage.vue'
import { ref, watch } from 'vue'

const BaseNotifyTimelinePageRef = ref()
const props = defineProps({
    /** 消息类型描述对象 */
    tab: {
        type: Object,
        required: true
    },
    /** 需要标记所有消息为已读的tab id */
    markReadTabId: {
        type: String,
        required: false,
        default: undefined
    }
})

watch(() => props.markReadTabId, (newVal, _) => {
    if(newVal === props.tab.id){
        BaseNotifyTimelinePageRef.value.markReadByTypesOnUi(props.tab.types)
    }
})
</script>